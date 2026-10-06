package com.prepai.platform.repository;

import com.prepai.platform.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, String> {
    List<Topic> findBySubjectIdOrderBySortOrderAsc(String subjectId);
    List<Topic> findBySubjectIdAndLevelTierOrderBySortOrderAsc(String subjectId, String levelTier);
}
