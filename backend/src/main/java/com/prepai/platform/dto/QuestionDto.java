package com.prepai.platform.dto;

import com.prepai.platform.entity.Question;
import java.util.Arrays;
import java.util.List;

public class QuestionDto {

    private Long id;
    private String subjectId;
    private String topicId;
    private String topic;
    private String difficulty;
    private String questionText;
    private List<String> options;
    private String sourceCitation;
    private Integer correctIndex; // included during review or practice mode
    private String explanation;   // included during review or practice mode

    public QuestionDto() {}

    public static QuestionDto fromEntity(Question q, boolean includeAnswers) {
        QuestionDto dto = new QuestionDto();
        dto.setId(q.getId());
        dto.setSubjectId(q.getSubjectId());
        dto.setTopicId(q.getTopicId());
        dto.setTopic(q.getTopic());
        dto.setDifficulty(q.getDifficulty());
        dto.setQuestionText(q.getQuestionText());
        dto.setOptions(Arrays.asList(q.getOptionA(), q.getOptionB(), q.getOptionC(), q.getOptionD()));
        dto.setSourceCitation(q.getSourceCitation());
        if (includeAnswers) {
            dto.setCorrectIndex(q.getCorrectIndex());
            dto.setExplanation(q.getExplanation());
        }
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    public String getTopicId() {
        return topicId;
    }

    public void setTopicId(String topicId) {
        this.topicId = topicId;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
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

    public String getSourceCitation() {
        return sourceCitation;
    }

    public void setSourceCitation(String sourceCitation) {
        this.sourceCitation = sourceCitation;
    }

    public Integer getCorrectIndex() {
        return correctIndex;
    }

    public void setCorrectIndex(Integer correctIndex) {
        this.correctIndex = correctIndex;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
