package com.prepai.platform.service;

import com.prepai.platform.dto.StudyPlanTopicDto;
import com.prepai.platform.entity.AssessmentResult;
import com.prepai.platform.entity.Topic;
import com.prepai.platform.entity.UserTopicProgress;
import com.prepai.platform.repository.AssessmentResultRepository;
import com.prepai.platform.repository.TopicRepository;
import com.prepai.platform.repository.UserTopicProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudyPlanService {

    private final TopicRepository topicRepository;
    private final UserTopicProgressRepository userTopicProgressRepository;
    private final AssessmentResultRepository assessmentResultRepository;
    private final com.prepai.platform.repository.QuestionRepository questionRepository;

    public StudyPlanService(TopicRepository topicRepository,
                            UserTopicProgressRepository userTopicProgressRepository,
                            AssessmentResultRepository assessmentResultRepository,
                            com.prepai.platform.repository.QuestionRepository questionRepository) {
        this.topicRepository = topicRepository;
        this.userTopicProgressRepository = userTopicProgressRepository;
        this.assessmentResultRepository = assessmentResultRepository;
        this.questionRepository = questionRepository;
    }

    public List<StudyPlanTopicDto> getStudyPlan(String subjectId, Long userId) {
        List<Topic> topics = topicRepository.findBySubjectIdOrderBySortOrderAsc(subjectId);

        Set<String> completedTopicIds = new HashSet<>();
        if (userId != null && userId > 0) {
            List<UserTopicProgress> progressList = userTopicProgressRepository.findByUserId(userId);
            for (UserTopicProgress p : progressList) {
                if (p.isCompleted()) {
                    completedTopicIds.add(p.getTopicId());
                }
            }
        }

        // Determine diagnosed level or focus areas from latest assessment
        String diagnosedLevel = "intermediate";
        if (userId != null && userId > 0) {
            Optional<AssessmentResult> latestResult =
                    assessmentResultRepository.findTopByUserIdAndSubjectIdOrderByCompletedAtDesc(userId, subjectId);
            if (latestResult.isPresent()) {
                diagnosedLevel = latestResult.get().getDiagnosedLevel();
            }
        }

        final String activeLevel = diagnosedLevel;

        return topics.stream().map(t -> {
            StudyPlanTopicDto dto = new StudyPlanTopicDto();
            dto.setId(t.getId());
            dto.setSubjectId(t.getSubjectId());
            dto.setLevelTier(t.getLevelTier());
            dto.setTitle(t.getTitle());
            dto.setOverview(t.getOverview());
            dto.setDiagram(t.getDiagram());
            dto.setKeyPoints(t.getKeyPoints());
            dto.setQuestionCount((int) questionRepository.countByTopicId(t.getId()));
            dto.setDurationMinutes(t.getDurationMinutes());
            dto.setSortOrder(t.getSortOrder());
            dto.setCompleted(completedTopicIds.contains(t.getId()));

            // Highlight topics matching student's active level tier or beginner tier if beginner
            boolean isFocus = t.getLevelTier().equalsIgnoreCase(activeLevel);
            dto.setRecommendedFocus(isFocus);

            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public boolean toggleTopicCompletion(Long userId, String topicId) {
        if (userId == null || userId <= 0) {
            return true;
        }

        Optional<UserTopicProgress> existing = userTopicProgressRepository.findByUserIdAndTopicId(userId, topicId);
        if (existing.isPresent()) {
            UserTopicProgress p = existing.get();
            p.setCompleted(!p.isCompleted());
            p.setCompletedAt(p.isCompleted() ? java.time.LocalDateTime.now() : null);
            userTopicProgressRepository.save(p);
            return p.isCompleted();
        } else {
            UserTopicProgress p = new UserTopicProgress(userId, topicId, true);
            userTopicProgressRepository.save(p);
            return true;
        }
    }
}
