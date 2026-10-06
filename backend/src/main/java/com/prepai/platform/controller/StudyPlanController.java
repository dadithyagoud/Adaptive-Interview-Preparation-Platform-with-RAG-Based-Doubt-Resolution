package com.prepai.platform.controller;

import com.prepai.platform.dto.StudyPlanTopicDto;
import com.prepai.platform.service.StudyPlanService;
import com.prepai.platform.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/study-plans")
public class StudyPlanController {

    private final StudyPlanService studyPlanService;
    private final JwtUtil jwtUtil;

    public StudyPlanController(StudyPlanService studyPlanService, JwtUtil jwtUtil) {
        this.studyPlanService = studyPlanService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/{subjectId}")
    public ResponseEntity<List<StudyPlanTopicDto>> getStudyPlan(
            @PathVariable String subjectId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = extractUserIdFromHeader(authHeader);
        List<StudyPlanTopicDto> plan = studyPlanService.getStudyPlan(subjectId, userId);
        return ResponseEntity.ok(plan);
    }

    @PostMapping("/topics/{topicId}/toggle")
    public ResponseEntity<Map<String, Object>> toggleTopic(
            @PathVariable String topicId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = extractUserIdFromHeader(authHeader);
        boolean isCompleted = studyPlanService.toggleTopicCompletion(userId, topicId);

        Map<String, Object> response = new HashMap<>();
        response.put("topicId", topicId);
        response.put("completed", isCompleted);
        return ResponseEntity.ok(response);
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
