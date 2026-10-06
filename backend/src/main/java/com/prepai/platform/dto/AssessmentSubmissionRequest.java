package com.prepai.platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public class AssessmentSubmissionRequest {

    private String subjectId;

    @NotNull(message = "Answers map is required")
    private Map<Long, Integer> answers; // questionId -> selectedIndex (0..3)

    private int durationSeconds;
    private String companyType;

    public AssessmentSubmissionRequest() {}

    public AssessmentSubmissionRequest(String subjectId, Map<Long, Integer> answers, int durationSeconds) {
        this.subjectId = subjectId;
        this.answers = answers;
        this.durationSeconds = durationSeconds;
    }

    public AssessmentSubmissionRequest(String subjectId, Map<Long, Integer> answers, int durationSeconds, String companyType) {
        this.subjectId = subjectId;
        this.answers = answers;
        this.durationSeconds = durationSeconds;
        this.companyType = companyType;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    public Map<Long, Integer> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, Integer> answers) {
        this.answers = answers;
    }

    public int getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(int durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public String getCompanyType() {
        return companyType;
    }

    public void setCompanyType(String companyType) {
        this.companyType = companyType;
    }
}
