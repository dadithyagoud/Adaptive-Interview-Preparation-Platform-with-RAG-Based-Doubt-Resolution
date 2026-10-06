package com.prepai.platform.controller;

import com.prepai.platform.dto.AssessmentResultResponse;
import com.prepai.platform.dto.AssessmentSubmissionRequest;
import com.prepai.platform.dto.QuestionDto;
import com.prepai.platform.entity.AssessmentResult;
import com.prepai.platform.service.AssessmentService;
import com.prepai.platform.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;
    private final JwtUtil jwtUtil;

    public AssessmentController(AssessmentService assessmentService, JwtUtil jwtUtil) {
        this.assessmentService = assessmentService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/{subjectId}/questions")
    public ResponseEntity<List<QuestionDto>> getQuestions(
            @PathVariable String subjectId,
            @RequestParam(defaultValue = "15") int count,
            @RequestParam(required = false) String companyType) {
        List<QuestionDto> questions = assessmentService.getDiagnosticQuestions(subjectId, count, companyType);
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/{subjectId}/submit")
    public ResponseEntity<AssessmentResultResponse> submitAssessment(
            @PathVariable String subjectId,
            @Valid @RequestBody AssessmentSubmissionRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        request.setSubjectId(subjectId);
        Long userId = extractUserIdFromHeader(authHeader);

        AssessmentResultResponse result = assessmentService.submitAssessment(userId, request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/topic/{topicId}/questions")
    public ResponseEntity<List<QuestionDto>> getTopicQuestions(
            @PathVariable String topicId,
            @RequestParam(defaultValue = "16") int count) {
        List<QuestionDto> questions = assessmentService.getTopicQuestions(topicId, count);
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/topic/{topicId}/submit")
    public ResponseEntity<AssessmentResultResponse> submitTopicAssessment(
            @PathVariable String topicId,
            @Valid @RequestBody AssessmentSubmissionRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = extractUserIdFromHeader(authHeader);
        AssessmentResultResponse result = assessmentService.submitTopicAssessment(userId, topicId, request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<List<AssessmentResult>> getHistory(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = extractUserIdFromHeader(authHeader);
        if (userId == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(assessmentService.getUserAssessmentHistory(userId));
    }

    private Long extractUserIdFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                return jwtUtil.extractUserId(token);
            }
        }
        return null;
    }
}
