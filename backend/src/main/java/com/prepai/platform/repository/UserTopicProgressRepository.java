package com.prepai.platform.repository;

import com.prepai.platform.entity.UserTopicProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserTopicProgressRepository extends JpaRepository<UserTopicProgress, Long> {
    List<UserTopicProgress> findByUserId(Long userId);
    Optional<UserTopicProgress> findByUserIdAndTopicId(Long userId, String topicId);
}
