package com.prepai.platform.seeder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prepai.platform.entity.KnowledgeChunk;
import com.prepai.platform.entity.Question;
import com.prepai.platform.entity.Subject;
import com.prepai.platform.entity.Topic;
import com.prepai.platform.repository.KnowledgeChunkRepository;
import com.prepai.platform.repository.QuestionRepository;
import com.prepai.platform.repository.SubjectRepository;
import com.prepai.platform.repository.TopicRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final SubjectRepository subjectRepository;
    private final TopicRepository topicRepository;
    private final QuestionRepository questionRepository;
    private final KnowledgeChunkRepository knowledgeChunkRepository;
    private final ObjectMapper objectMapper;

    public DatabaseSeeder(SubjectRepository subjectRepository,
                          TopicRepository topicRepository,
                          QuestionRepository questionRepository,
                          KnowledgeChunkRepository knowledgeChunkRepository,
                          ObjectMapper objectMapper) {
        this.subjectRepository = subjectRepository;
        this.topicRepository = topicRepository;
        this.questionRepository = questionRepository;
        this.knowledgeChunkRepository = knowledgeChunkRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        seedSubjects();
        seedTopics();
        seedOsQuestions();
        seedKnowledgeChunks();
    }

    private void seedSubjects() {
        if (subjectRepository.count() == 0) {
            log.info("Seeding core CS subjects into PostgreSQL...");
            subjectRepository.save(new Subject("os", "Operating Systems", "Process lifecycle, memory management, virtual memory, scheduling, and concurrency.", "Cpu"));
            subjectRepository.save(new Subject("dbms", "Database Management Systems", "Relational algebra, SQL, normalization, indexing internals, and transaction isolation.", "Database"));
            subjectRepository.save(new Subject("cn", "Computer Networks", "OSI & TCP/IP models, routing protocols, flow control, transport protocols, and socket programming.", "Network"));
            subjectRepository.save(new Subject("oops", "Object-Oriented Programming", "Classes, inheritance, polymorphism, encapsulation, abstraction, and SOLID design principles.", "Code2"));
            log.info("Successfully seeded 4 subjects.");
        }
    }

    private void seedTopics() {
        if (!topicRepository.existsById("os-mod-1")) {
            log.info("Seeding/updating curated 20 OS curriculum modules into PostgreSQL...");
            List<Topic> oldOsTopics = topicRepository.findBySubjectIdOrderBySortOrderAsc("os");
            if (!oldOsTopics.isEmpty()) {
                topicRepository.deleteAll(oldOsTopics);
            }

            try {
                ClassPathResource resource = new ClassPathResource("data/os_modules.json");
                try (InputStream is = resource.getInputStream()) {
                    List<Map<String, Object>> rawModules = objectMapper.readValue(is, new TypeReference<>() {});
                    List<Topic> osTopics = new ArrayList<>();
                    int order = 1;
                    for (Map<String, Object> mod : rawModules) {
                        String id = (String) mod.get("id");
                        String title = (String) mod.get("title");
                        String overview = (String) mod.get("overview");
                        String diagram = (String) mod.get("diagram");
                        Object keyPointsObj = mod.get("keyPoints");
                        String keyPointsJson = keyPointsObj != null ? objectMapper.writeValueAsString(keyPointsObj) : "";
                        String levelTier = (order <= 6) ? "beginner" : (order <= 13 ? "intermediate" : "advanced");

                        Topic topic = new Topic(id, "os", levelTier, title, overview, diagram, keyPointsJson, 15, order);
                        osTopics.add(topic);
                        order++;
                    }
                    topicRepository.saveAll(osTopics);
                    log.info("Successfully seeded 20 modular OS topics.");
                }
            } catch (Exception e) {
                log.error("Failed to seed OS modules: {}", e.getMessage(), e);
            }
        }

        if (topicRepository.findBySubjectIdOrderBySortOrderAsc("dbms").isEmpty()) {
            List<Topic> otherTopics = new ArrayList<>();
            // DBMS Topics
            otherTopics.add(new Topic("db-b1", "dbms", "beginner", "Introduction to Databases", "Relational models, schemas, and relational DBMS architecture.", 10, 1));
            otherTopics.add(new Topic("db-b2", "dbms", "beginner", "ER Model and Relational Design", "Entities, relationships, cardinalities, and normalization mapping.", 12, 2));
            otherTopics.add(new Topic("db-b3", "dbms", "beginner", "Basic SQL Queries", "SELECT, WHERE, aggregate functions, GROUP BY, and HAVING.", 15, 3));
            otherTopics.add(new Topic("db-i1", "dbms", "intermediate", "Relational Algebra", "Select, project, join, set difference, and cartesian product.", 15, 4));
            otherTopics.add(new Topic("db-i2", "dbms", "intermediate", "Advanced SQL (Joins, Subqueries)", "INNER, LEFT, RIGHT, FULL OUTER joins, and practical subqueries.", 18, 5));
            otherTopics.add(new Topic("db-i3", "dbms", "intermediate", "Database Normalization", "1NF, 2NF, 3NF, BCNF, functional dependencies, and lossless decomposition.", 20, 6));
            otherTopics.add(new Topic("db-a1", "dbms", "advanced", "Transaction Processing", "ACID properties, states, commit, rollback, and Write-Ahead Logging (WAL).", 18, 7));
            otherTopics.add(new Topic("db-a2", "dbms", "advanced", "Concurrency Control", "Two-Phase Locking (2PL), MVCC, isolation levels, and phantom reads.", 20, 8));
            otherTopics.add(new Topic("db-a3", "dbms", "advanced", "Indexing (B/B+ Trees)", "B+ tree storage engine, clustered vs non-clustered, and index scans.", 22, 9));

            // CN Topics
            otherTopics.add(new Topic("cn-b1", "cn", "beginner", "Introduction to Computer Networks", "Network types, packet switching, and physical topologies.", 10, 1));
            otherTopics.add(new Topic("cn-b2", "cn", "beginner", "Network Topologies and Hardware", "Hubs, switches, routers, and broadcast domains.", 12, 2));
            otherTopics.add(new Topic("cn-b3", "cn", "beginner", "OSI and TCP/IP Models", "7-layer OSI stack vs 4-layer TCP/IP protocol suite.", 15, 3));
            otherTopics.add(new Topic("cn-i1", "cn", "intermediate", "Data Link Layer (Framing, CRC)", "Framing delimiters, error detection, CRC polynomial division.", 15, 4));
            otherTopics.add(new Topic("cn-i2", "cn", "intermediate", "MAC Protocols (CSMA/CD)", "Ethernet collision detection and binary exponential backoff.", 15, 5));
            otherTopics.add(new Topic("cn-i3", "cn", "intermediate", "Network Layer and IP Addressing", "IPv4 header, CIDR notation, subnet masks, and NAT.", 18, 6));
            otherTopics.add(new Topic("cn-a1", "cn", "advanced", "Routing Algorithms", "Dijkstra Link-State (OSPF) vs Bellman-Ford Distance Vector (RIP).", 20, 7));
            otherTopics.add(new Topic("cn-a2", "cn", "advanced", "Transport Layer (TCP, UDP)", "3-way handshake, 4-way teardown, sliding window, and AIMD congestion control.", 22, 8));
            otherTopics.add(new Topic("cn-a3", "cn", "advanced", "Application Layer (DNS, HTTP/HTTPS)", "DNS recursive resolution, TLS handshake, and HTTP/2 multiplexing.", 18, 9));

            // OOPs Topics
            otherTopics.add(new Topic("oop-b1", "oops", "beginner", "Introduction to OOP Concepts", "Procedural vs Object-Oriented programming paradigms.", 10, 1));
            otherTopics.add(new Topic("oop-b2", "oops", "beginner", "Classes and Objects", "Object instantiation, heap vs stack memory, static vs instance members.", 12, 2));
            otherTopics.add(new Topic("oop-b3", "oops", "beginner", "Constructors and Destructors", "Default, parameterized, copy constructors, and memory reclamation.", 12, 3));
            otherTopics.add(new Topic("oop-i1", "oops", "intermediate", "Encapsulation and Access Modifiers", "Data hiding, access control (private, protected, public), and invariants.", 15, 4));
            otherTopics.add(new Topic("oop-i2", "oops", "intermediate", "Inheritance Types and Hierarchy", "Single, multilevel, hierarchical, and the Diamond Problem.", 15, 5));
            otherTopics.add(new Topic("oop-i3", "oops", "intermediate", "Polymorphism (Overloading, Overriding)", "Compile-time vs Runtime polymorphism and vtable dispatch.", 18, 6));
            otherTopics.add(new Topic("oop-a1", "oops", "advanced", "Abstraction (Abstract Classes vs Interfaces)", "Identity vs contract, default methods, and multiple inheritance of type.", 18, 7));
            otherTopics.add(new Topic("oop-a2", "oops", "advanced", "Exception Handling", "Checked vs unchecked exceptions, call stack unwinding, and try-with-resources.", 15, 8));
            otherTopics.add(new Topic("oop-a3", "oops", "advanced", "SOLID Principles & Design Patterns", "SRP, OCP, LSP, ISP, DIP, Singleton, Factory, and Observer patterns.", 22, 9));

            topicRepository.saveAll(otherTopics);
            log.info("Successfully seeded core syllabus modules for other subjects.");
        }
    }

    private void seedOsQuestions() {
        long currentMod1Count = questionRepository.countByTopicId("os-mod-1");
        if (currentMod1Count < 16) {
            log.info("Seeding/updating curated 320 OS questions with modular topic mapping into PostgreSQL...");
            try {
                List<Question> oldQuestions = questionRepository.findBySubjectId("os");
                if (!oldQuestions.isEmpty()) {
                    questionRepository.deleteAll(oldQuestions);
                }

                ClassPathResource resource = new ClassPathResource("data/os_questions.json");
                try (InputStream is = resource.getInputStream()) {
                    List<Map<String, Object>> rawQuestions = objectMapper.readValue(is, new TypeReference<>() {});
                    List<Question> questionEntities = new ArrayList<>();

                    for (Map<String, Object> map : rawQuestions) {
                        Question q = new Question(
                                (String) map.get("subjectId"),
                                (String) map.get("topicId"),
                                (String) map.get("topic"),
                                (String) map.get("difficulty"),
                                (String) map.get("questionText"),
                                (String) map.get("optionA"),
                                (String) map.get("optionB"),
                                (String) map.get("optionC"),
                                (String) map.get("optionD"),
                                ((Number) map.get("correctIndex")).intValue(),
                                (String) map.get("explanation"),
                                (String) map.get("sourceCitation")
                        );
                        questionEntities.add(q);
                    }

                    questionRepository.saveAll(questionEntities);
                    log.info("Successfully seeded {} curated Operating Systems questions across 20 modules into PostgreSQL!", questionEntities.size());
                }
            } catch (Exception e) {
                log.error("Failed to seed OS questions: {}", e.getMessage(), e);
            }
        } else {
            log.info("Operating Systems question bank already contains {} questions across 20 modules.", questionRepository.countBySubjectId("os"));
        }
    }

    private void seedKnowledgeChunks() {
        if (knowledgeChunkRepository.count() < 20) {
            log.info("Seeding all 20 modular OS RAG knowledge chunks into PostgreSQL...");
            try {
                ClassPathResource resource = new ClassPathResource("data/os_modules.json");
                try (InputStream is = resource.getInputStream()) {
                    List<Map<String, Object>> rawModules = objectMapper.readValue(is, new TypeReference<>() {});
                    List<KnowledgeChunk> chunks = new ArrayList<>();
                    int order = 1;
                    for (Map<String, Object> mod : rawModules) {
                        String id = (String) mod.get("id");
                        String title = (String) mod.get("title");
                        String overview = (String) mod.get("overview");
                        Object keyPointsObj = mod.get("keyPoints");
                        String keyPointsStr = keyPointsObj != null ? keyPointsObj.toString() : title;
                        String section = "OS Module " + order;

                        chunks.add(new KnowledgeChunk(id, "os", title, section, title, overview, keyPointsStr));
                        order++;
                    }
                    knowledgeChunkRepository.saveAll(chunks);
                    log.info("Successfully seeded {} modular RAG knowledge chunks into PostgreSQL.", chunks.size());
                }
            } catch (Exception e) {
                log.error("Failed to seed knowledge chunks: {}", e.getMessage());
            }
        }
    }
}
