package com.prepai.platform.repository;

import com.prepai.platform.entity.AssessmentResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentResultRepository extends JpaRepository<AssessmentResult, Long> {
    List<AssessmentResult> findByUserIdOrderByCompletedAtDesc(Long userId);
    Optional<AssessmentResult> findTopByUserIdAndSubjectIdOrderByCompletedAtDesc(Long userId, String subjectId);
}
