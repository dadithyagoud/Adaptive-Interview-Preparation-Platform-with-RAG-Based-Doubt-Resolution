package com.prepai.platform.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "knowledge_chunks")
public class KnowledgeChunk {

    @Id
    @Column(length = 30)
    private String id; // e.g. 'os-1', 'os-2'

    @Column(nullable = false, length = 20)
    private String subjectId;

    @Column(nullable = false, length = 100)
    private String topic;

    @Column(length = 50)
    private String section;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String keyConcepts;

    public KnowledgeChunk() {}

    public KnowledgeChunk(String id, String subjectId, String topic, String section, String title, String content, String keyConcepts) {
        this.id = id;
        this.subjectId = subjectId;
        this.topic = topic;
        this.section = section;
        this.title = title;
        this.content = content;
        this.keyConcepts = keyConcepts;
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

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getKeyConcepts() {
        return keyConcepts;
    }

    public void setKeyConcepts(String keyConcepts) {
        this.keyConcepts = keyConcepts;
    }
}
