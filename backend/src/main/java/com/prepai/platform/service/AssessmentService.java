package com.prepai.platform.service;

import com.prepai.platform.dto.AssessmentResultResponse;
import com.prepai.platform.dto.AssessmentSubmissionRequest;
import com.prepai.platform.dto.QuestionDto;
import com.prepai.platform.entity.AssessmentResult;
import com.prepai.platform.entity.Question;
import com.prepai.platform.entity.Topic;
import com.prepai.platform.entity.UserTopicProgress;
import com.prepai.platform.repository.AssessmentResultRepository;
import com.prepai.platform.repository.QuestionRepository;
import com.prepai.platform.repository.TopicRepository;
import com.prepai.platform.repository.UserTopicProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AssessmentService {

    private final QuestionRepository questionRepository;
    private final AssessmentResultRepository assessmentResultRepository;
    private final TopicRepository topicRepository;
    private final UserTopicProgressRepository userTopicProgressRepository;

    public AssessmentService(QuestionRepository questionRepository,
                             AssessmentResultRepository assessmentResultRepository,
                             TopicRepository topicRepository,
                             UserTopicProgressRepository userTopicProgressRepository) {
        this.questionRepository = questionRepository;
        this.assessmentResultRepository = assessmentResultRepository;
        this.topicRepository = topicRepository;
        this.userTopicProgressRepository = userTopicProgressRepository;
    }

    public List<QuestionDto> getDiagnosticQuestions(String subjectId, int count) {
        return getDiagnosticQuestions(subjectId, count, null);
    }

    public List<QuestionDto> getDiagnosticQuestions(String subjectId, int count, String companyType) {
        int limit = Math.max(5, Math.min(count, 30));

        if (companyType != null && !companyType.isBlank()) {
            List<Question> allQuestions = questionRepository.findBySubjectId(subjectId);
            if (!allQuestions.isEmpty()) {
                List<Question> filtered = selectCompanySpecificQuestions(allQuestions, companyType, limit);
                return filtered.stream()
                        .map(q -> QuestionDto.fromEntity(q, false))
                        .collect(Collectors.toList());
            }
        }

        List<Question> questions = questionRepository.findRandomQuestionsBySubjectId(subjectId, limit);

        // Fallback if random native query returned empty (e.g. during initial setup)
        if (questions.isEmpty()) {
            questions = questionRepository.findBySubjectId(subjectId);
            if (questions.size() > limit) {
                Collections.shuffle(questions);
                questions = questions.subList(0, limit);
            }
        }

        return questions.stream()
                .map(q -> QuestionDto.fromEntity(q, false))
                .collect(Collectors.toList());
    }

    private List<Question> selectCompanySpecificQuestions(List<Question> allQuestions, String companyType, int limit) {
        Set<String> priorityTopics = new HashSet<>();
        List<String> preferredDifficulties = new ArrayList<>();

        switch (companyType.toLowerCase()) {
            case "product": // FAANG / Tier 1 (Google, Amazon, Microsoft)
                // Concurrency, Synchronization, Scheduling, Virtual Memory, Deadlocks
                priorityTopics.addAll(Arrays.asList("os-mod-6", "os-mod-7", "os-mod-8", "os-mod-9", "os-mod-10", "os-mod-11", "os-mod-12", "os-mod-14", "os-mod-15"));
                preferredDifficulties.addAll(Arrays.asList("advanced", "intermediate"));
                break;
            case "service": // Mass Recruiters (TCS, Infosys, Wipro)
                // Fundamental basics, System Calls, Processes, Basic Memory
                priorityTopics.addAll(Arrays.asList("os-mod-1", "os-mod-2", "os-mod-3", "os-mod-4", "os-mod-5", "os-mod-13", "os-mod-17"));
                preferredDifficulties.addAll(Arrays.asList("beginner", "intermediate"));
                break;
            case "data": // FinTech & Data Systems (Goldman Sachs, Snowflake, Oracle)
                // Concurrency, Mutex, Locking, Paging, Disk I/O & Storage
                priorityTopics.addAll(Arrays.asList("os-mod-7", "os-mod-8", "os-mod-9", "os-mod-11", "os-mod-12", "os-mod-14", "os-mod-17", "os-mod-18"));
                preferredDifficulties.addAll(Arrays.asList("advanced", "intermediate"));
                break;
            case "cloud": // Cloud & DevOps (Cisco, Arista, AWS)
                // System Calls, Dual-Mode, Processes, Threads, I/O, Security
                priorityTopics.addAll(Arrays.asList("os-mod-1", "os-mod-2", "os-mod-3", "os-mod-4", "os-mod-5", "os-mod-19", "os-mod-20"));
                preferredDifficulties.addAll(Arrays.asList("intermediate", "advanced"));
                break;
            default:
                Collections.shuffle(allQuestions);
                return allQuestions.subList(0, Math.min(limit, allQuestions.size()));
        }

        // Tier 1: Matches both priority topic AND preferred difficulty
        List<Question> tier1 = new ArrayList<>();
        // Tier 2: Matches priority topic OR preferred difficulty
        List<Question> tier2 = new ArrayList<>();
        // Tier 3: Other questions
        List<Question> tier3 = new ArrayList<>();

        for (Question q : allQuestions) {
            boolean topicMatch = q.getTopicId() != null && priorityTopics.contains(q.getTopicId());
            boolean diffMatch = q.getDifficulty() != null && preferredDifficulties.contains(q.getDifficulty().toLowerCase());

            if (topicMatch && diffMatch) {
                tier1.add(q);
            } else if (topicMatch || diffMatch) {
                tier2.add(q);
            } else {
                tier3.add(q);
            }
        }

        Collections.shuffle(tier1);
        Collections.shuffle(tier2);
        Collections.shuffle(tier3);

        List<Question> result = new ArrayList<>(tier1);
        if (result.size() < limit) {
            result.addAll(tier2);
        }
        if (result.size() < limit) {
            result.addAll(tier3);
        }

        return result.subList(0, Math.min(limit, result.size()));
    }

    @Transactional
    public AssessmentResultResponse submitAssessment(Long userId, AssessmentSubmissionRequest request) {
        Map<Long, Integer> answers = request.getAnswers() != null ? request.getAnswers() : Collections.emptyMap();
        List<Long> questionIds = new ArrayList<>(answers.keySet());

        List<Question> questions = questionRepository.findAllById(questionIds);
        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        int score = 0;
        int totalQuestions = questions.size();

        Map<String, int[]> topicCounts = new HashMap<>(); // topic -> [correct, total]
        List<AssessmentResultResponse.AnswerReviewItem> reviewItems = new ArrayList<>();

        for (Question q : questions) {
            Integer selectedOption = answers.get(q.getId());
            boolean isCorrect = (selectedOption != null && selectedOption == q.getCorrectIndex());
            if (isCorrect) {
                score++;
            }

            topicCounts.putIfAbsent(q.getTopic(), new int[]{0, 0});
            int[] counts = topicCounts.get(q.getTopic());
            counts[1]++; // total in topic
            if (isCorrect) {
                counts[0]++; // correct in topic
            }

            List<String> options = Arrays.asList(q.getOptionA(), q.getOptionB(), q.getOptionC(), q.getOptionD());
            reviewItems.add(new AssessmentResultResponse.AnswerReviewItem(
                    q.getId(),
                    q.getQuestionText(),
                    options,
                    selectedOption,
                    q.getCorrectIndex(),
                    isCorrect,
                    q.getExplanation(),
                    q.getSourceCitation(),
                    q.getTopic(),
                    q.getTopicId()
            ));
        }

        int percentage = totalQuestions > 0 ? (int) Math.round(((double) score / totalQuestions) * 100) : 0;
        String diagnosedLevel;
        if (percentage < 50) {
            diagnosedLevel = "beginner";
        } else if (percentage < 75) {
            diagnosedLevel = "intermediate";
        } else {
            diagnosedLevel = "advanced";
        }

        Map<String, AssessmentResultResponse.TopicScore> topicBreakdown = new HashMap<>();
        List<String> weakTopics = new ArrayList<>();
        List<String> strongTopics = new ArrayList<>();

        for (Map.Entry<String, int[]> entry : topicCounts.entrySet()) {
            String topicName = entry.getKey();
            int c = entry.getValue()[0];
            int t = entry.getValue()[1];
            int topicPct = t > 0 ? (int) Math.round(((double) c / t) * 100) : 0;

            topicBreakdown.put(topicName, new AssessmentResultResponse.TopicScore(t, c, topicPct));
            if (topicPct < 60) {
                weakTopics.add(topicName);
            } else if (topicPct >= 75) {
                strongTopics.add(topicName);
            }
        }

        Long assessmentId = null;
        if (userId != null && userId > 0) {
            AssessmentResult result = new AssessmentResult(
                    userId,
                    request.getSubjectId(),
                    score,
                    totalQuestions,
                    percentage,
                    diagnosedLevel
            );
            AssessmentResult saved = assessmentResultRepository.save(result);
            assessmentId = saved.getId();
        }

        Set<String> weakTopicIdSet = new LinkedHashSet<>();
        for (Question q : questions) {
            Integer selectedOption = answers.get(q.getId());
            boolean isCorrect = (selectedOption != null && selectedOption == q.getCorrectIndex());
            if (!isCorrect && q.getTopicId() != null && !q.getTopicId().isBlank()) {
                weakTopicIdSet.add(q.getTopicId());
            }
        }
        List<String> weakTopicIds = new ArrayList<>(weakTopicIdSet);

        AssessmentResultResponse response = new AssessmentResultResponse();
        response.setAssessmentId(assessmentId);
        response.setSubjectId(request.getSubjectId());
        response.setScore(score);
        response.setTotalQuestions(totalQuestions);
        response.setPercentage(percentage);
        response.setDiagnosedLevel(diagnosedLevel);
        response.setTopicBreakdown(topicBreakdown);
        response.setWeakTopics(weakTopics);
        response.setWeakTopicIds(weakTopicIds);
        response.setStrongTopics(strongTopics);
        response.setAnswersReview(reviewItems);

        if (request.getCompanyType() != null && !request.getCompanyType().isBlank()) {
            String ct = request.getCompanyType().toLowerCase();
            int cutoff = 70;
            String name = "Target Company";
            String feedback = "";

            switch (ct) {
                case "product":
                    cutoff = 85;
                    name = "Product-Based (FAANG / Tier-1)";
                    feedback = percentage >= cutoff
                            ? "Outstanding performance! You cleared the 85% FAANG bar for Operating Systems. You demonstrated solid grasp of critical concurrency and memory management concepts."
                            : "Your score is below the 85% FAANG benchmark. FAANG interviewers heavily test race conditions, synchronization primitives, and page replacement mechanics. Review the missed modules below.";
                    break;
                case "fintech":
                case "data":
                    cutoff = 80;
                    name = "FinTech & Data Systems";
                    feedback = percentage >= cutoff
                            ? "Qualified for FinTech systems tracks! Your accuracy across low-level locking, synchronization, and paging aligns with high-frequency systems expectations."
                            : "Below the 80% FinTech benchmark. Review thread safety, mutex vs semaphore trade-offs, and virtual memory thrashing before systems rounds.";
                    break;
                case "startup":
                    cutoff = 75;
                    name = "High-Growth Tech Startup";
                    feedback = percentage >= cutoff
                            ? "Ready for fast-paced startup technical rounds! Good practical understanding of process lifecycles and resource scheduling."
                            : "Below the 75% startup benchmark. Emphasize system calls, IPC, and thread execution models to raise your accuracy.";
                    break;
                case "service":
                    cutoff = 60;
                    name = "Mass Recruiter / IT Services";
                    feedback = percentage >= cutoff
                            ? "Qualified for campus drives! Strong foundation across core CS operating system basics and process terminology."
                            : "Below the 60% campus drive benchmark. Revisit basic OS architecture and CPU scheduling algorithms.";
                    break;
                default:
                    name = request.getCompanyType();
                    feedback = percentage >= cutoff ? "Passed benchmark criteria." : "Below benchmark criteria.";
            }

            response.setCompanyType(ct);
            response.setCompanyName(name);
            response.setCompanyCutoff(cutoff);
            response.setCompanyQualified(percentage >= cutoff);
            response.setCompanyFeedback(feedback);
        }

        return response;
    }

    public List<QuestionDto> getTopicQuestions(String topicId, int count) {
        int limit = count > 0 ? count : 16;
        List<Question> questions = questionRepository.findRandomQuestionsByTopicId(topicId, limit);
        if (questions.isEmpty()) {
            questions = questionRepository.findByTopicId(topicId);
            if (questions.size() > limit) {
                Collections.shuffle(questions);
                questions = questions.subList(0, limit);
            }
        }
        return questions.stream()
                .map(q -> QuestionDto.fromEntity(q, false))
                .collect(Collectors.toList());
    }

    @Transactional
    public AssessmentResultResponse submitTopicAssessment(Long userId, String topicId, AssessmentSubmissionRequest request) {
        Map<Long, Integer> answers = request.getAnswers() != null ? request.getAnswers() : Collections.emptyMap();
        List<Long> questionIds = new ArrayList<>(answers.keySet());

        List<Question> questions = questionRepository.findAllById(questionIds);
        int score = 0;
        int totalQuestions = questions.size();
        List<AssessmentResultResponse.AnswerReviewItem> reviewItems = new ArrayList<>();
        List<String> weakConcepts = new ArrayList<>();

        for (Question q : questions) {
            Integer selectedOption = answers.get(q.getId());
            boolean isCorrect = (selectedOption != null && selectedOption == q.getCorrectIndex());
            if (isCorrect) {
                score++;
            } else {
                weakConcepts.add(q.getExplanation() != null ? q.getExplanation() : q.getQuestionText());
            }

            List<String> options = Arrays.asList(q.getOptionA(), q.getOptionB(), q.getOptionC(), q.getOptionD());
            reviewItems.add(new AssessmentResultResponse.AnswerReviewItem(
                    q.getId(),
                    q.getQuestionText(),
                    options,
                    selectedOption,
                    q.getCorrectIndex(),
                    isCorrect,
                    q.getExplanation(),
                    q.getSourceCitation(),
                    q.getTopic(),
                    q.getTopicId()
            ));
        }

        int percentage = totalQuestions > 0 ? (int) Math.round(((double) score / totalQuestions) * 100) : 0;
        boolean passed = percentage >= 70;

        Optional<Topic> topicOpt = topicRepository.findById(topicId);
        String topicTitle = topicOpt.map(Topic::getTitle).orElse(topicId);
        String keyPoints = topicOpt.map(Topic::getKeyPoints).orElse("");
        String diagram = topicOpt.map(Topic::getDiagram).orElse("");
        String overview = topicOpt.map(Topic::getOverview).orElse("");

        if (userId != null && userId > 0 && passed) {
            Optional<UserTopicProgress> existing = userTopicProgressRepository.findByUserIdAndTopicId(userId, topicId);
            if (existing.isPresent()) {
                UserTopicProgress p = existing.get();
                p.setCompleted(true);
                p.setCompletedAt(java.time.LocalDateTime.now());
                userTopicProgressRepository.save(p);
            } else {
                UserTopicProgress p = new UserTopicProgress(userId, topicId, true);
                userTopicProgressRepository.save(p);
            }
        }

        AssessmentResultResponse response = new AssessmentResultResponse();
        response.setSubjectId(request.getSubjectId() != null ? request.getSubjectId() : "os");
        response.setTopicId(topicId);
        response.setTopicTitle(topicTitle);
        response.setPassed(passed);
        response.setScore(score);
        response.setTotalQuestions(totalQuestions);
        response.setPercentage(percentage);
        response.setDiagnosedLevel(percentage < 50 ? "beginner" : (percentage < 75 ? "intermediate" : "advanced"));
        response.setTargetedKeyPoints(keyPoints);
        response.setTargetedDiagram(diagram);
        response.setTargetedOverview(overview);
        response.setWeakConcepts(weakConcepts);
        response.setAnswersReview(reviewItems);

        return response;
    }

    public List<AssessmentResult> getUserAssessmentHistory(Long userId) {
        return assessmentResultRepository.findByUserIdOrderByCompletedAtDesc(userId);
    }
}
