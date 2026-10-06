package com.prepai.platform.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_results")
public class AssessmentResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 20)
    private String subjectId;

    private int score;

    private int totalQuestions;

    private int percentage;

    @Column(nullable = false, length = 20)
    private String diagnosedLevel; // 'beginner', 'intermediate', 'advanced'

    @Column(nullable = false, updatable = false)
    private LocalDateTime completedAt = LocalDateTime.now();

    public AssessmentResult() {}

    public AssessmentResult(Long userId, String subjectId, int score, int totalQuestions, int percentage, String diagnosedLevel) {
        this.userId = userId;
        this.subjectId = subjectId;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.percentage = percentage;
        this.diagnosedLevel = diagnosedLevel;
        this.completedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
