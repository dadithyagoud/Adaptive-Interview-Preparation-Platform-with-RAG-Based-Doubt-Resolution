package com.prepai.platform.service;

import com.prepai.platform.dto.ChatRequest;
import com.prepai.platform.dto.ChatResponse;
import com.prepai.platform.entity.KnowledgeChunk;
import com.prepai.platform.repository.KnowledgeChunkRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final KnowledgeChunkRepository knowledgeChunkRepository;

    private static final Set<String> STOP_WORDS = new HashSet<>(Arrays.asList(
            "a", "an", "the", "and", "or", "but", "if", "then", "else", "when", "at", "from",
            "by", "for", "with", "about", "against", "between", "into", "through", "during",
            "before", "after", "above", "below", "to", "of", "in", "on", "what", "is", "are",
            "how", "why", "can", "could", "should", "would", "does", "explain", "tell", "me",
            "i", "am", "currently", "studying", "diagnosed", "weak", "areas", "area", "please",
            "provide", "clear", "step", "strategy", "foundational", "conceptual", "principles",
            "outline", "key", "must", "practice", "just", "completed", "diagnostic", "assessment",
            "interconnect", "traps", "avoid", "question", "questions", "missed", "study", "mod",
            "module", "modules", "os", "system", "systems", "operating", "give", "breakdown"
    ));

    private static final Pattern NON_CS_PATTERN = Pattern.compile(
            "\\b(recipe|cook|food|restaurant|movie|actor|cricket|football|weather|horoscope|celebrity|song|sing|dance)\\b",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern MODULE_ID_PATTERN = Pattern.compile(
            "\\b(?:os[-_]?mod[-_]?|os[-_]|mod[-_]?|module\\s*)(\\d+)\\b",
            Pattern.CASE_INSENSITIVE
    );

    // Curated high-yield interview questions for all 20 OS modules
    private static final Map<Integer, List<String>> OS_INTERVIEW_QUESTIONS = new HashMap<>();
    static {
        OS_INTERVIEW_QUESTIONS.put(1, Arrays.asList(
                "Explain dual-mode CPU execution: why does the hardware mode bit (0 vs 1) protect system integrity?",
                "Compare Monolithic vs Microkernel architectures: explain execution speed vs fault isolation trade-offs."
        ));
        OS_INTERVIEW_QUESTIONS.put(2, Arrays.asList(
                "Why does fork() return twice in a single program execution?",
                "What is Copy-on-Write (COW) and how does it optimize fork() followed by execve()?"
        ));
        OS_INTERVIEW_QUESTIONS.put(3, Arrays.asList(
                "What is the precise difference between a Zombie process and an Orphan process?",
                "Trace the 5-state process lifecycle: when does a process transition from Running to Waiting vs Ready?"
        ));
        OS_INTERVIEW_QUESTIONS.put(4, Arrays.asList(
                "Why is context switching between threads of the same process faster than between processes?",
                "What hardware structures are saved and flushed during a process context switch (CR3, registers, TLB)?"
        ));
        OS_INTERVIEW_QUESTIONS.put(5, Arrays.asList(
                "What resources are shared between threads of a process, and what is strictly thread-private?",
                "Compare User-Level Threads (ULT) vs Kernel-Level Threads (KLT) regarding blocking system calls."
        ));
        OS_INTERVIEW_QUESTIONS.put(6, Arrays.asList(
                "Why is Shared Memory the fastest IPC mechanism, and what synchronization is required?",
                "What is the difference between Anonymous Pipes and Named Pipes (FIFOs)?"
        ));
        OS_INTERVIEW_QUESTIONS.put(7, Arrays.asList(
                "Explain the Convoy Effect in FCFS scheduling and how it degrades I/O and CPU utilization.",
                "Differentiate Preemptive vs Non-Preemptive scheduling with respect to turnaround time and overhead."
        ));
        OS_INTERVIEW_QUESTIONS.put(8, Arrays.asList(
                "Why is Shortest Remaining Time First (SRTF) provably optimal for minimizing average waiting time?",
                "How does the choice of time quantum in Round Robin prevent thrashing context switches?",
                "How does Multilevel Feedback Queue (MLFQ) dynamically prevent starvation using aging?"
        ));
        OS_INTERVIEW_QUESTIONS.put(9, Arrays.asList(
                "What is a Race Condition and how does Compare-and-Swap (CAS) enable lock-free concurrency?",
                "Why are compiler memory barriers and hardware atomic primitives necessary on multi-core CPUs?"
        ));
        OS_INTERVIEW_QUESTIONS.put(10, Arrays.asList(
                "What are the 3 mandatory criteria for solving the Critical Section problem (Mutual Exclusion, Progress, Bounded Waiting)?",
                "Why does Peterson's algorithm fail on modern superscalar CPUs without explicit memory fences?"
        ));
        OS_INTERVIEW_QUESTIONS.put(11, Arrays.asList(
                "What is the key difference between a Mutex (ownership) and a Counting Semaphore (signaling)?",
                "What is Priority Inversion, and how does the Priority Inheritance protocol resolve it?"
        ));
        OS_INTERVIEW_QUESTIONS.put(12, Arrays.asList(
                "State the 4 Coffman conditions. Which condition is most commonly broken in deadlock prevention?",
                "In a Resource Allocation Graph (RAG), why is a cycle necessary and sufficient for single-instance, but only necessary for multi-instance resources?"
        ));
        OS_INTERVIEW_QUESTIONS.put(13, Arrays.asList(
                "How does Banker's Algorithm determine if a resource allocation state is Safe or Unsafe?",
                "Why do mainstream production operating systems use the Ostrich algorithm instead of dynamic deadlock avoidance?"
        ));
        OS_INTERVIEW_QUESTIONS.put(14, Arrays.asList(
                "Differentiate Internal vs External Fragmentation. How does Paging eliminate external fragmentation?",
                "Compare First-Fit, Best-Fit, and Worst-Fit dynamic memory allocation placement strategies."
        ));
        OS_INTERVIEW_QUESTIONS.put(15, Arrays.asList(
                "Explain the role of the TLB and derive the formula for Effective Memory Access Time (EMAT).",
                "Why is hierarchical Multi-Level Paging necessary for 64-bit virtual address spaces?"
        ));
        OS_INTERVIEW_QUESTIONS.put(16, Arrays.asList(
                "What is Belady's Anomaly and why does it occur in FIFO but never in Stack algorithms (LRU, Optimal)?",
                "How does the Clock (Second-Chance) page replacement algorithm approximate LRU with minimal hardware overhead?"
        ));
        OS_INTERVIEW_QUESTIONS.put(17, Arrays.asList(
                "Walk through the complete lifecycle of a Page Fault from hardware trap to instruction restart.",
                "What is Thrashing, and how does the Working Set Model prevent it?"
        ));
        OS_INTERVIEW_QUESTIONS.put(18, Arrays.asList(
                "What is stored in a UNIX Inode, and why is the filename specifically NOT stored in the Inode?",
                "Explain the difference between a Hard Link and a Soft (Symbolic) Link."
        ));
        OS_INTERVIEW_QUESTIONS.put(19, Arrays.asList(
                "Why does Shortest Seek Time First (SSTF) cause arm starvation, and how does C-LOOK solve it?",
                "Break down Disk Access Time: Seek Time vs Rotational Latency vs Transfer Time."
        ));
        OS_INTERVIEW_QUESTIONS.put(20, Arrays.asList(
                "How does Direct Memory Access (DMA) reduce CPU overhead during heavy block I/O transfers?",
                "What is the difference between Top Half and Bottom Half (SoftIRQ) interrupt handling?"
        ));
    }

    public ChatService(KnowledgeChunkRepository knowledgeChunkRepository) {
        this.knowledgeChunkRepository = knowledgeChunkRepository;
    }

    public ChatResponse processQuery(ChatRequest request) {
        String query = request.getMessage().trim();

        // 1. Guardrail Check: Reject non-CS domain inquiries
        if (NON_CS_PATTERN.matcher(query).find()) {
            return new ChatResponse(
                    "I am PrepAI's specialized CS interview doubt resolution engine. I am strictly constrained to core Computer Science topics: Operating Systems, Database Management Systems, Computer Networks, and Object-Oriented Programming. Please ask a technical or engineering question!",
                    false,
                    Collections.emptyList()
            );
        }

        // 2. Retrieve available candidate chunks
        List<KnowledgeChunk> candidateChunks;
        if (request.getSubjectId() != null && !request.getSubjectId().isBlank()) {
            candidateChunks = knowledgeChunkRepository.findBySubjectId(request.getSubjectId().toLowerCase());
        } else {
            candidateChunks = knowledgeChunkRepository.findAll();
        }

        if (candidateChunks.isEmpty()) {
            candidateChunks = knowledgeChunkRepository.findAll();
        }

        String fullQueryLower = query.toLowerCase();

        // 3. Extract explicit module IDs from query (e.g. os-mod-6, os-mod-7, os-mod-8, module 15)
        Set<Integer> explicitModuleNumbers = extractModuleNumbers(query);

        List<KnowledgeChunk> selectedChunks = new ArrayList<>();

        if (!explicitModuleNumbers.isEmpty()) {
            // Find chunks matching the extracted module numbers in order
            Map<Integer, KnowledgeChunk> chunkByModNum = new HashMap<>();
            for (KnowledgeChunk chunk : candidateChunks) {
                int modNum = getModuleNumber(chunk);
                if (modNum > 0) {
                    chunkByModNum.put(modNum, chunk);
                }
            }

            for (Integer modNum : explicitModuleNumbers.stream().sorted().collect(Collectors.toList())) {
                KnowledgeChunk matched = chunkByModNum.get(modNum);
                if (matched != null) {
                    selectedChunks.add(matched);
                }
            }
        }

        // 4. If no explicit module numbers were found, rank by semantic token & title resonance
        if (selectedChunks.isEmpty()) {
            List<String> queryTokens = Arrays.stream(query.toLowerCase().split("[^a-zA-Z0-9]+"))
                    .filter(t -> t.length() > 2 && !STOP_WORDS.contains(t))
                    .collect(Collectors.toList());

            if (queryTokens.isEmpty() && !candidateChunks.isEmpty()) {
                selectedChunks = candidateChunks.stream().limit(2).collect(Collectors.toList());
            } else {
                List<ScoredChunk> scoredChunks = new ArrayList<>();
                for (KnowledgeChunk chunk : candidateChunks) {
                    double score = computeRelevanceScore(fullQueryLower, queryTokens, chunk);
                    if (score >= 2.0) {
                        scoredChunks.add(new ScoredChunk(chunk, score));
                    }
                }
                scoredChunks.sort((a, b) -> Double.compare(b.score, a.score));

                boolean isMultiQuery = fullQueryLower.contains("weak") || fullQueryLower.contains("strategy")
                        || fullQueryLower.contains("breakdown") || fullQueryLower.contains("revision");
                int limit = isMultiQuery ? 6 : 3;

                selectedChunks = scoredChunks.stream()
                        .limit(limit)
                        .map(sc -> sc.chunk)
                        .collect(Collectors.toList());
            }
        }

        if (selectedChunks.isEmpty()) {
            return new ChatResponse(
                    "I am PrepAI's specialized technical interview mentor for Computer Science. Please ask any conceptual or interview question about Operating Systems, DBMS, Computer Networks, or OOPs.",
                    false,
                    Collections.emptyList()
            );
        }

        // 5. Generate Citations for all selected chunks
        List<ChatResponse.Citation> citations = new ArrayList<>();
        for (KnowledgeChunk chunk : selectedChunks) {
            String sourceRef = "PrepAI Curated Technical Standard | Sec " + chunk.getSection();
            citations.add(new ChatResponse.Citation(
                    chunk.getId(),
                    chunk.getTitle(),
                    sourceRef,
                    96
            ));
        }

        // 6. Check if this is a Multi-Module or Weak-Area Revision Strategy query
        boolean isRevisionStrategy = selectedChunks.size() > 1
                || fullQueryLower.contains("weak")
                || fullQueryLower.contains("revision")
                || fullQueryLower.contains("strategy")
                || fullQueryLower.contains("diagnosed")
                || fullQueryLower.contains("breakdown")
                || fullQueryLower.contains("interconnect");

        String groundedAnswer;
        if (isRevisionStrategy && selectedChunks.size() > 1) {
            groundedAnswer = synthesizeRevisionStrategy(query, selectedChunks);
        } else {
            KnowledgeChunk primaryChunk = selectedChunks.get(0);
            KnowledgeChunk secondaryChunk = selectedChunks.size() > 1 ? selectedChunks.get(1) : null;
            groundedAnswer = synthesizeSingleModuleWalkthrough(query, primaryChunk, secondaryChunk);
        }

        return new ChatResponse(groundedAnswer, true, citations);
    }

    private Set<Integer> extractModuleNumbers(String text) {
        Set<Integer> moduleNumbers = new LinkedHashSet<>();
        Matcher matcher = MODULE_ID_PATTERN.matcher(text);
        while (matcher.find()) {
            try {
                int num = Integer.parseInt(matcher.group(1));
                if (num >= 1 && num <= 20) {
                    moduleNumbers.add(num);
                }
            } catch (NumberFormatException ignored) {}
        }
        return moduleNumbers;
    }

    private int getModuleNumber(KnowledgeChunk chunk) {
        if (chunk == null) return -1;
        // Check ID format (os-mod-6, os-6)
        Matcher matcher = Pattern.compile("(\\d+)").matcher(chunk.getId());
        if (matcher.find()) {
            try {
                return Integer.parseInt(matcher.group(1));
            } catch (NumberFormatException ignored) {}
        }
        // Check Section format ("OS Module 6")
        if (chunk.getSection() != null) {
            Matcher secMatcher = Pattern.compile("(\\d+)").matcher(chunk.getSection());
            if (secMatcher.find()) {
                try {
                    return Integer.parseInt(secMatcher.group(1));
                } catch (NumberFormatException ignored) {}
            }
        }
        return -1;
    }

    private double computeRelevanceScore(String fullQueryLower, List<String> queryTokens, KnowledgeChunk chunk) {
        String titleLower = chunk.getTitle().toLowerCase();
        String idLower = chunk.getId().toLowerCase();
        double score = 0;

        // Exact ID or full title matches
        if (fullQueryLower.contains(idLower)) score += 50.0;
        if (fullQueryLower.contains(titleLower)) score += 30.0;

        // Tokenized word-boundary checks
        Set<String> titleWords = new HashSet<>(Arrays.asList(titleLower.split("[^a-zA-Z0-9]+")));
        Set<String> conceptWords = chunk.getKeyConcepts() != null
                ? new HashSet<>(Arrays.asList(chunk.getKeyConcepts().toLowerCase().split("[^a-zA-Z0-9]+")))
                : Collections.emptySet();
        Set<String> contentWords = chunk.getContent() != null
                ? new HashSet<>(Arrays.asList(chunk.getContent().toLowerCase().split("[^a-zA-Z0-9]+")))
                : Collections.emptySet();

        for (String token : queryTokens) {
            if (titleWords.contains(token)) score += 8.0;
            if (conceptWords.contains(token)) score += 4.0;
            if (contentWords.contains(token)) score += 1.0;
        }

        return score;
    }

    private String synthesizeRevisionStrategy(String query, List<KnowledgeChunk> chunks) {
        StringBuilder sb = new StringBuilder();
        sb.append("### 🎯 Targeted Weak-Area Mastery & Revision Strategy\n\n");
        sb.append("Based on your diagnostic assessment, here is your customized, step-by-step revision strategy covering your **")
          .append(chunks.size()).append(" diagnosed focus modules** in Operating Systems. Follow this sequenced roadmap to systematically eliminate conceptual gaps and prepare for technical interviews:\n\n");

        sb.append("---\n\n");
        sb.append("#### 🗺️ Sequenced Learning Roadmap\n\n");

        // Group chunks by architectural phase
        List<KnowledgeChunk> phase1 = new ArrayList<>(); // Scheduling & Process Coord (mod 1-8)
        List<KnowledgeChunk> phase2 = new ArrayList<>(); // Concurrency & Synchronization (mod 9-11)
        List<KnowledgeChunk> phase3 = new ArrayList<>(); // Deadlocks (mod 12-13)
        List<KnowledgeChunk> phase4 = new ArrayList<>(); // Memory Management & Paging (mod 14-17)
        List<KnowledgeChunk> phase5 = new ArrayList<>(); // Storage & Hardware (mod 18-20)

        for (KnowledgeChunk c : chunks) {
            int num = getModuleNumber(c);
            if (num >= 1 && num <= 8) phase1.add(c);
            else if (num >= 9 && num <= 11) phase2.add(c);
            else if (num >= 12 && num <= 13) phase3.add(c);
            else if (num >= 14 && num <= 17) phase4.add(c);
            else phase5.add(c);
        }

        int stepNum = 1;
        if (!phase1.isEmpty()) {
            sb.append(stepNum++).append(". **Phase 1: Process Coordination & CPU Scheduling** (")
              .append(phase1.stream().map(KnowledgeChunk::getTitle).collect(Collectors.joining(", "))).append(")\n");
        }
        if (!phase2.isEmpty()) {
            sb.append(stepNum++).append(". **Phase 2: Concurrency & Synchronization Primitives** (")
              .append(phase2.stream().map(KnowledgeChunk::getTitle).collect(Collectors.joining(", "))).append(")\n");
        }
        if (!phase3.isEmpty()) {
            sb.append(stepNum++).append(". **Phase 3: System Deadlocks & Resource Allocation** (")
              .append(phase3.stream().map(KnowledgeChunk::getTitle).collect(Collectors.joining(", "))).append(")\n");
        }
        if (!phase4.isEmpty()) {
            sb.append(stepNum++).append(". **Phase 4: Virtual Memory & Address Translation** (")
              .append(phase4.stream().map(KnowledgeChunk::getTitle).collect(Collectors.joining(", "))).append(")\n");
        }
        if (!phase5.isEmpty()) {
            sb.append(stepNum++).append(". **Phase 5: Storage & Hardware Subsystems** (")
              .append(phase5.stream().map(KnowledgeChunk::getTitle).collect(Collectors.joining(", "))).append(")\n");
        }

        sb.append("\n---\n\n");
        sb.append("### 📚 Foundational Walkthrough & High-Yield Practice per Module\n\n");

        for (int i = 0; i < chunks.size(); i++) {
            KnowledgeChunk chunk = chunks.get(i);
            int modNum = getModuleNumber(chunk);

            sb.append("#### 📌 ").append(i + 1).append(". ").append(chunk.getTitle())
              .append(" (").append(chunk.getSection()).append(")\n");
            sb.append("• **Foundational Principle:** ").append(chunk.getContent()).append("\n\n");

            List<String> keyPoints = parseKeyPoints(chunk.getKeyConcepts());
            if (!keyPoints.isEmpty()) {
                sb.append("• **Core Architectural Mechanics:**\n");
                for (String kp : keyPoints) {
                    sb.append("  - ").append(kp).append("\n");
                }
                sb.append("\n");
            }

            List<String> interviewQs = OS_INTERVIEW_QUESTIONS.get(modNum);
            if (interviewQs != null && !interviewQs.isEmpty()) {
                sb.append("💡 **Key Interview Questions to Practice:**\n");
                for (String q : interviewQs) {
                    sb.append("  - ").append(q).append("\n");
                }
                sb.append("\n");
            }
        }

        sb.append("---\n\n");
        sb.append("### 🔗 How These Concepts Interconnect in System Architecture\n");
        sb.append("• **IPC & Concurrency Coupling:** Shared memory is the fastest IPC mechanism because processes bypass the kernel during data transfers; however, it strictly relies on synchronization primitives (Mutexes, Semaphores) to guard against race conditions.\n");
        sb.append("• **Synchronization to Deadlocks:** Unordered or nested lock acquisitions across concurrent threads frequently satisfy Coffman's Circular Wait condition, causing system deadlocks. Always enforce a global lock acquisition hierarchy.\n");
        sb.append("• **Virtual Memory & Scheduling Integration:** When a thread touches an unmapped virtual page, the MMU raises a Page Fault trap. The OS transitions the thread to the Waiting/Blocked state while the disk driver services the page in secondary storage, prompting the CPU scheduler to dispatch another ready thread.\n\n");

        sb.append("💡 **Interview Takeaway:** In technical interviews, lead with theoretical correctness (e.g. mutual exclusion criteria, Coffman conditions), explain runtime trade-offs (context switch overhead, lock contention), and contrast edge cases (Belady's anomaly, priority inversion).");

        return sb.toString();
    }

    private String synthesizeSingleModuleWalkthrough(String query, KnowledgeChunk primary, KnowledgeChunk secondary) {
        StringBuilder sb = new StringBuilder();
        int primaryModNum = getModuleNumber(primary);

        sb.append("### Grounded Technical Walkthrough\n\n");
        sb.append("**Topic:** ").append(primary.getTitle()).append(" (Section ").append(primary.getSection()).append(")\n\n");
        sb.append(primary.getContent()).append("\n\n");

        List<String> keyPoints = parseKeyPoints(primary.getKeyConcepts());
        if (!keyPoints.isEmpty()) {
            sb.append("**Core Architectural Mechanics:**\n");
            for (String kp : keyPoints) {
                sb.append("• ").append(kp).append("\n");
            }
            sb.append("\n");
        }

        List<String> interviewQs = OS_INTERVIEW_QUESTIONS.get(primaryModNum);
        if (interviewQs != null && !interviewQs.isEmpty()) {
            sb.append("💡 **High-Yield Interview Questions & Traps:**\n");
            for (String q : interviewQs) {
                sb.append("• ").append(q).append("\n");
            }
            sb.append("\n");
        }

        if (secondary != null) {
            sb.append("#### Related Concept: ").append(secondary.getTitle()).append(" (").append(secondary.getSection()).append(")\n");
            sb.append(secondary.getContent()).append("\n\n");
        }

        sb.append("💡 **Interview Takeaway:** When explaining this in technical interviews, clearly highlight theoretical correctness, boundary conditions (such as race conditions or context switch overhead), and real-world implementation nuances.");

        return sb.toString();
    }

    private List<String> parseKeyPoints(String keyConcepts) {
        if (keyConcepts == null || keyConcepts.isBlank()) return Collections.emptyList();
        String cleaned = keyConcepts.trim();
        if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
            cleaned = cleaned.substring(1, cleaned.length() - 1);
        }
        List<String> points = new ArrayList<>();
        String[] parts = cleaned.split("\",\\s*\"|\",\"|',\\s*'|','");
        for (String part : parts) {
            String p = part.replaceAll("^[\"'\\[\\]\\s]+|[\"'\\[\\]\\s]+$", "").trim();
            if (!p.isBlank()) {
                points.add(p);
            }
        }
        return points;
    }

    private static class ScoredChunk {
        KnowledgeChunk chunk;
        double score;

        ScoredChunk(KnowledgeChunk chunk, double score) {
            this.chunk = chunk;
            this.score = score;
        }
    }
}

