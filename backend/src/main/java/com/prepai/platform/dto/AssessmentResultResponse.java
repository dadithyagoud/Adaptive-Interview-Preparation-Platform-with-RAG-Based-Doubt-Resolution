package com.prepai.platform.dto;

import java.util.List;
import java.util.Map;

public class AssessmentResultResponse {

    private Long assessmentId;
    private String subjectId;
    private String topicId;
    private String topicTitle;
    private boolean passed;
    private String targetedKeyPoints;
    private String targetedDiagram;
    private String targetedOverview;
    private List<String> weakConcepts;
    private int score;
    private int totalQuestions;
    private int percentage;
    private String diagnosedLevel; // 'beginner', 'intermediate', 'advanced'
    private Map<String, TopicScore> topicBreakdown;
    private List<String> weakTopics;
    private List<String> weakTopicIds;
    private List<String> strongTopics;
    private List<AnswerReviewItem> answersReview;

    // Company-specific assessment evaluation
    private String companyType;
    private String companyName;
    private int companyCutoff;
    private boolean companyQualified;
    private String companyFeedback;

    public AssessmentResultResponse() {}

    public static class TopicScore {
        private int total;
        private int correct;
        private int percentage;

        public TopicScore() {}

        public TopicScore(int total, int correct, int percentage) {
            this.total = total;
            this.correct = correct;
            this.percentage = percentage;
        }

        public int getTotal() {
            return total;
        }

        public void setTotal(int total) {
            this.total = total;
        }

        public int getCorrect() {
            return correct;
        }

        public void setCorrect(int correct) {
            this.correct = correct;
        }

        public int getPercentage() {
            return percentage;
        }

        public void setPercentage(int percentage) {
            this.percentage = percentage;
        }
    }

    public static class AnswerReviewItem {
        private Long questionId;
        private String questionText;
        private List<String> options;
        private Integer selectedOption;
        private Integer correctOption;
        private boolean correct;
        private String explanation;
        private String sourceCitation;
        private String topic;
        private String topicId;

        public AnswerReviewItem() {}

        public AnswerReviewItem(Long questionId, String questionText, List<String> options,
                                Integer selectedOption, Integer correctOption, boolean correct,
                                String explanation, String sourceCitation, String topic) {
            this(questionId, questionText, options, selectedOption, correctOption, correct, explanation, sourceCitation, topic, null);
        }

        public AnswerReviewItem(Long questionId, String questionText, List<String> options,
                                Integer selectedOption, Integer correctOption, boolean correct,
                                String explanation, String sourceCitation, String topic, String topicId) {
            this.questionId = questionId;
            this.questionText = questionText;
            this.options = options;
            this.selectedOption = selectedOption;
            this.correctOption = correctOption;
            this.correct = correct;
            this.explanation = explanation;
            this.sourceCitation = sourceCitation;
            this.topic = topic;
            this.topicId = topicId;
        }

        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public String getQuestionText() {
            return questionText;
        }

        public void setQuestionText(String questionText) {
            this.questionText = questionText;
        }

        public List<String> getOptions() {
            return options;
        }

        public void setOptions(List<String> options) {
            this.options = options;
        }

        public Integer getSelectedOption() {
            return selectedOption;
        }

        public void setSelectedOption(Integer selectedOption) {
            this.selectedOption = selectedOption;
        }

        public Integer getCorrectOption() {
            return correctOption;
        }

        public void setCorrectOption(Integer correctOption) {
            this.correctOption = correctOption;
        }

        public boolean isCorrect() {
            return correct;
        }

        public void setCorrect(boolean correct) {
            this.correct = correct;
        }

        public String getExplanation() {
            return explanation;
        }

        public void setExplanation(String explanation) {
            this.explanation = explanation;
        }

        public String getSourceCitation() {
            return sourceCitation;
        }

        public void setSourceCitation(String sourceCitation) {
            this.sourceCitation = sourceCitation;
        }

        public String getTopic() {
            return topic;
        }

        public void setTopic(String topic) {
            this.topic = topic;
        }

        public String getTopicId() {
            return topicId;
        }

        public void setTopicId(String topicId) {
            this.topicId = topicId;
        }
    }

    public Long getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(Long assessmentId) {
        this.assessmentId = assessmentId;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public int getPercentage() {
        return percentage;
    }

    public void setPercentage(int percentage) {
        this.percentage = percentage;
    }

    public String getDiagnosedLevel() {
        return diagnosedLevel;
    }

    public void setDiagnosedLevel(String diagnosedLevel) {
        this.diagnosedLevel = diagnosedLevel;
    }

    public Map<String, TopicScore> getTopicBreakdown() {
        return topicBreakdown;
    }

    public void setTopicBreakdown(Map<String, TopicScore> topicBreakdown) {
        this.topicBreakdown = topicBreakdown;
    }

    public List<String> getWeakTopics() {
        return weakTopics;
    }

    public void setWeakTopics(List<String> weakTopics) {
        this.weakTopics = weakTopics;
    }

    public List<String> getWeakTopicIds() {
        return weakTopicIds;
    }

    public void setWeakTopicIds(List<String> weakTopicIds) {
        this.weakTopicIds = weakTopicIds;
    }

    public List<String> getStrongTopics() {
        return strongTopics;
    }

    public void setStrongTopics(List<String> strongTopics) {
        this.strongTopics = strongTopics;
    }

    public List<AnswerReviewItem> getAnswersReview() {
        return answersReview;
    }

    public void setAnswersReview(List<AnswerReviewItem> answersReview) {
        this.answersReview = answersReview;
    }

    public String getTopicId() {
        return topicId;
    }

    public void setTopicId(String topicId) {
        this.topicId = topicId;
    }

    public String getTopicTitle() {
        return topicTitle;
    }

    public void setTopicTitle(String topicTitle) {
        this.topicTitle = topicTitle;
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }

    public String getTargetedKeyPoints() {
        return targetedKeyPoints;
    }

    public void setTargetedKeyPoints(String targetedKeyPoints) {
        this.targetedKeyPoints = targetedKeyPoints;
    }

    public String getTargetedDiagram() {
        return targetedDiagram;
    }

    public void setTargetedDiagram(String targetedDiagram) {
        this.targetedDiagram = targetedDiagram;
    }

    public String getTargetedOverview() {
        return targetedOverview;
    }

    public void setTargetedOverview(String targetedOverview) {
        this.targetedOverview = targetedOverview;
    }

    public List<String> getWeakConcepts() {
        return weakConcepts;
    }

    public void setWeakConcepts(List<String> weakConcepts) {
        this.weakConcepts = weakConcepts;
    }

    public String getCompanyType() {
        return companyType;
    }

    public void setCompanyType(String companyType) {
        this.companyType = companyType;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public int getCompanyCutoff() {
        return companyCutoff;
    }

    public void setCompanyCutoff(int companyCutoff) {
        this.companyCutoff = companyCutoff;
    }

    public boolean isCompanyQualified() {
        return companyQualified;
    }

    public void setCompanyQualified(boolean companyQualified) {
        this.companyQualified = companyQualified;
    }

    public String getCompanyFeedback() {
        return companyFeedback;
    }

    public void setCompanyFeedback(String companyFeedback) {
        this.companyFeedback = companyFeedback;
    }
}
