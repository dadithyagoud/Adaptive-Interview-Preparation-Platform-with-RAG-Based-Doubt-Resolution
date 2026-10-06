package com.prepai.platform.repository;

import com.prepai.platform.entity.KnowledgeChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeChunkRepository extends JpaRepository<KnowledgeChunk, String> {

    List<KnowledgeChunk> findBySubjectId(String subjectId);

    @Query("SELECT k FROM KnowledgeChunk k WHERE LOWER(k.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(k.keyConcepts) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<KnowledgeChunk> searchByKeyword(@Param("keyword") String keyword);
}
