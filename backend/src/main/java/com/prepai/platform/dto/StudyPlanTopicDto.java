package com.prepai.platform.dto;

public class StudyPlanTopicDto {

    private String id;
    private String subjectId;
    private String levelTier;
    private String title;
    private String overview;
    private String diagram;
    private String keyPoints;
    private int durationMinutes;
    private int sortOrder;
    private int questionCount;
    private boolean completed;
    private boolean recommendedFocus;

    public StudyPlanTopicDto() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    public String getLevelTier() {
        return levelTier;
    }

    public void setLevelTier(String levelTier) {
        this.levelTier = levelTier;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public String getDiagram() {
        return diagram;
    }

    public void setDiagram(String diagram) {
        this.diagram = diagram;
    }

    public String getKeyPoints() {
        return keyPoints;
    }

    public void setKeyPoints(String keyPoints) {
        this.keyPoints = keyPoints;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }

    public int getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(int questionCount) {
        this.questionCount = questionCount;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public boolean isRecommendedFocus() {
        return recommendedFocus;
    }

    public void setRecommendedFocus(boolean recommendedFocus) {
        this.recommendedFocus = recommendedFocus;
    }
}
