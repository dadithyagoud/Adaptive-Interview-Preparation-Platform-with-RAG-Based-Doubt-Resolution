package com.prepai.platform.service;

import com.prepai.platform.entity.Subject;
import com.prepai.platform.entity.Topic;
import com.prepai.platform.repository.SubjectRepository;
import com.prepai.platform.repository.TopicRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final TopicRepository topicRepository;

    public SubjectService(SubjectRepository subjectRepository, TopicRepository topicRepository) {
        this.subjectRepository = subjectRepository;
        this.topicRepository = topicRepository;
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Optional<Subject> getSubjectById(String id) {
        return subjectRepository.findById(id);
    }

    public List<Topic> getTopicsBySubject(String subjectId) {
        return topicRepository.findBySubjectIdOrderBySortOrderAsc(subjectId);
    }
}
