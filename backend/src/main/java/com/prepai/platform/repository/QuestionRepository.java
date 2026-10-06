package com.prepai.platform.repository;

import com.prepai.platform.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findBySubjectId(String subjectId);

    List<Question> findByTopicId(String topicId);

    List<Question> findBySubjectIdAndDifficulty(String subjectId, String difficulty);

    List<Question> findBySubjectIdAndTopic(String subjectId, String topic);

    long countBySubjectId(String subjectId);

    long countByTopicId(String topicId);

    @Query(value = "SELECT * FROM questions WHERE subject_id = :subjectId ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Question> findRandomQuestionsBySubjectId(@Param("subjectId") String subjectId, @Param("limit") int limit);

    @Query(value = "SELECT * FROM questions WHERE topic_id = :topicId ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Question> findRandomQuestionsByTopicId(@Param("topicId") String topicId, @Param("limit") int limit);
}
