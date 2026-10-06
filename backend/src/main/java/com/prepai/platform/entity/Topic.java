package com.prepai.platform.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "topics")
public class Topic {

    @Id
    @Column(length = 30)
    private String id; // e.g. 'os-mod-1', 'os-mod-2'

    @Column(nullable = false, length = 20)
    private String subjectId;

    @Column(nullable = false, length = 20)
    private String levelTier; // 'beginner', 'intermediate', 'advanced'

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String overview;

    @Column(columnDefinition = "TEXT")
    private String diagram;

    @Column(columnDefinition = "TEXT")
    private String keyPoints; // JSON or newline-separated key concepts for targeted learning

    private int durationMinutes = 15;

    private int sortOrder = 0;

    public Topic() {}

    public Topic(String id, String subjectId, String levelTier, String title, String overview, int durationMinutes, int sortOrder) {
        this.id = id;
        this.subjectId = subjectId;
        this.levelTier = levelTier;
        this.title = title;
        this.overview = overview;
        this.durationMinutes = durationMinutes;
        this.sortOrder = sortOrder;
    }

    public Topic(String id, String subjectId, String levelTier, String title, String overview, String diagram, String keyPoints, int durationMinutes, int sortOrder) {
        this.id = id;
        this.subjectId = subjectId;
        this.levelTier = levelTier;
        this.title = title;
        this.overview = overview;
        this.diagram = diagram;
        this.keyPoints = keyPoints;
        this.durationMinutes = durationMinutes;
        this.sortOrder = sortOrder;
    }

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
}
