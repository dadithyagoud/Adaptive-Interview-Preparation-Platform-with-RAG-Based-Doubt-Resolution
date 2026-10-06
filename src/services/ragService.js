import { knowledgeBase } from '../data/knowledgeBase.js';
import { topicContent } from '../mockData/topicContent.js';

// Dynamically generate knowledge chunks from the 20 curated OS modules
const osCurriculumChunks = Object.entries(topicContent).map(([modId, mod]) => ({
  id: modId,
  subject: 'os',
  topic: mod.title,
  section: `OS Module ${modId.replace('os-mod-', '')}`,
  title: mod.title,
  content: `${mod.overview}\n\nCore Architectural Principles:\n${(mod.coreConcepts || []).map(c => `• ${c.name}: ${c.desc}`).join('\n')}`,
  keyConcepts: (mod.coreConcepts || []).map(c => c.name.toLowerCase()).concat([mod.title.toLowerCase()]),
  interviewQuestions: (mod.interviewQuestions || []).map(q => typeof q === 'string' ? q : q.q)
}));

// Unified knowledge base containing both standard reference chunks and the 20 curriculum modules
const combinedKnowledgeBase = [...knowledgeBase, ...osCurriculumChunks];

/**
 * Common English stop words to filter out during tokenization
 */
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'her',
  'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'its',
  'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on',
  'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she',
  'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
  'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
  'we', 'were', 'weren\'t', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'won\'t', 'would',
  'wouldn\'t', 'you', 'your', 'yours', 'yourself', 'yourselves', 'explain', 'tell', 'difference', 'between', 'vs',
  'mod', 'module', 'modules', 'os', 'system', 'systems', 'operating', 'diagnosed', 'weak', 'areas', 'strategy',
  'revision', 'foundational', 'principles', 'practice', 'outline', 'key', 'clear', 'step'
]);

/**
 * Tokenize text into normalized tokens, eliminating stop words and punctuation
 */
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

/**
 * Extracts integer module numbers from text (e.g. os-mod-6, os-mod-7 -> [6, 7])
 */
function extractModuleNumbers(text) {
  const matches = Array.from(text.matchAll(/\b(?:os[-_]?mod[-_]?|os[-_]|mod[-_]?|module\s*)(\d+)\b/gi));
  return Array.from(new Set(matches.map(m => parseInt(m[1], 10)))).sort((a, b) => a - b);
}

function getChunkModuleNumber(chunk) {
  const m = String(chunk.id || '').match(/(\d+)/) || String(chunk.section || '').match(/(\d+)/);
  return m ? parseInt(m[1], 10) : -1;
}

/**
 * Similarity and Retrieval Engine:
 * Performs hybrid vector-like scoring combining TF-IDF heuristics, keyword density,
 * and key concept matching against the curated technical knowledge base.
 */
export function retrieveChunks(query, subjectFilter = 'all', topK = 3) {
  const lowerQuery = query.toLowerCase();

  // Filter by subject if specified
  const pool = subjectFilter && subjectFilter !== 'all'
    ? combinedKnowledgeBase.filter(chunk => chunk.subject.toLowerCase() === subjectFilter.toLowerCase())
    : combinedKnowledgeBase;

  // 1. Check for explicit module numbers (e.g. os-mod-6, os-mod-7, os-mod-8, ...)
  const explicitModNumbers = extractModuleNumbers(query);
  if (explicitModNumbers.length > 0) {
    const matchedExplicit = [];
    explicitModNumbers.forEach(modNum => {
      const found = pool.find(c => getChunkModuleNumber(c) === modNum);
      if (found) {
        matchedExplicit.push({ chunk: found, score: 100, confidence: 98 });
      }
    });
    if (matchedExplicit.length > 0) {
      return matchedExplicit;
    }
  }

  // 2. Keyword & concept scoring
  const queryTokens = tokenize(query);
  const isMultiTopic = lowerQuery.includes('weak') || lowerQuery.includes('modules') || lowerQuery.includes('breakdown') || lowerQuery.includes('revision');
  const effectiveTopK = isMultiTopic ? Math.max(topK, 8) : topK;

  const scoredChunks = pool.map(chunk => {
    let score = 0;
    const titleTokens = tokenize(chunk.title);
    const conceptTokens = (chunk.keyConcepts || []).flatMap(c => tokenize(c));
    const contentTokens = tokenize(chunk.content);
    const questionTokens = (chunk.interviewQuestions || []).flatMap(q => tokenize(typeof q === 'string' ? q : q.q));

    // Direct Module ID hit (e.g. os-mod-2, os-mod-8, os-1)
    if (lowerQuery.includes(chunk.id.toLowerCase())) {
      score += 40;
    }

    // Direct Title phrase hit (e.g. "Operating System Basics", "Critical Section", "Paging")
    if (lowerQuery.includes(chunk.title.toLowerCase())) {
      score += 30;
    }

    // Check each query token against different chunk fields
    queryTokens.forEach(token => {
      if (conceptTokens.includes(token)) score += 8;
      if (titleTokens.includes(token)) score += 6;
      if (questionTokens.includes(token)) score += 4;
      const occurrences = contentTokens.filter(t => t === token).length;
      if (occurrences > 0) score += Math.min(occurrences * 1.5, 6);
    });

    // Check for exact phrase concept matches
    (chunk.keyConcepts || []).forEach(concept => {
      if (concept.includes(' ') && lowerQuery.includes(concept)) {
        score += 12;
      }
    });

    const confidence = Math.min(Math.round(Math.min(1.0, score / 12.0) * 100), 98);
    return { chunk, score, confidence };
  });

  scoredChunks.sort((a, b) => b.score - a.score);

  const matched = scoredChunks
    .filter(item => item.score >= 2)
    .slice(0, effectiveTopK);

  if (matched.length === 0 && pool.length > 0) {
    return pool.slice(0, 1).map(c => ({ chunk: c, score: 3, confidence: 75 }));
  }

  return matched;
}

/**
 * Formats retrieved chunks into context text for LLM grounding
 */
function buildContextString(retrievedItems) {
  return retrievedItems
    .map((item, idx) => {
      const { chunk, confidence } = item;
      return `--- CHUNK ${idx + 1} [Source: ${chunk.subject.toUpperCase()} - ${chunk.section}: ${chunk.title} (Relevance: ${confidence}%)] ---
${chunk.content}`;
    })
    .join('\n\n');
}

/**
 * Intelligent Grounded Synthesizer:
 * Generates an interview-ready answer purely from the retrieved knowledge chunks.
 * Handles both single-topic questions and multi-topic weak-area diagnostic breakdowns.
 */
function synthesizeGroundedAnswer(query, retrievedItems) {
  if (retrievedItems.length === 0) {
    return {
      text: "I am PrepAI's specialized technical interview mentor for Computer Science. Please ask any conceptual or interview question about Operating Systems, DBMS, Computer Networks, or OOPs.",
      grounded: false,
      sources: []
    };
  }

  const isMultiTopic = retrievedItems.length > 1;
  let answerText = '';

  if (isMultiTopic) {
    answerText += `### 🎯 Targeted Weak-Area Mastery & Revision Strategy\n\n`;
    answerText += `Based on your diagnostic assessment, here is your customized, step-by-step revision strategy covering your **${retrievedItems.length} diagnosed focus modules** in Operating Systems. Follow this sequenced roadmap to systematically eliminate conceptual gaps and prepare for technical interviews:\n\n`;

    answerText += `---\n\n`;
    answerText += `#### 🗺️ Sequenced Learning Roadmap\n\n`;

    const phase1 = [];
    const phase2 = [];
    const phase3 = [];
    const phase4 = [];
    const phase5 = [];

    retrievedItems.forEach(item => {
      const num = getChunkModuleNumber(item.chunk);
      if (num >= 1 && num <= 8) phase1.push(item.chunk);
      else if (num >= 9 && num <= 11) phase2.push(item.chunk);
      else if (num >= 12 && num <= 13) phase3.push(item.chunk);
      else if (num >= 14 && num <= 17) phase4.push(item.chunk);
      else phase5.push(item.chunk);
    });

    let step = 1;
    if (phase1.length > 0) answerText += `${step++}. **Phase 1: Process Coordination & CPU Scheduling** (${phase1.map(c => c.title).join(', ')})\n`;
    if (phase2.length > 0) answerText += `${step++}. **Phase 2: Concurrency & Synchronization Primitives** (${phase2.map(c => c.title).join(', ')})\n`;
    if (phase3.length > 0) answerText += `${step++}. **Phase 3: System Deadlocks & Resource Allocation** (${phase3.map(c => c.title).join(', ')})\n`;
    if (phase4.length > 0) answerText += `${step++}. **Phase 4: Virtual Memory & Address Translation** (${phase4.map(c => c.title).join(', ')})\n`;
    if (phase5.length > 0) answerText += `${step++}. **Phase 5: Storage & Hardware Subsystems** (${phase5.map(c => c.title).join(', ')})\n`;

    answerText += `\n---\n\n### 📚 Foundational Walkthrough & High-Yield Practice per Module\n\n`;

    retrievedItems.forEach((item, index) => {
      const c = item.chunk;
      answerText += `#### 📌 ${index + 1}. ${c.title} (${c.section})\n`;
      answerText += `• **Foundational Principle:** ${c.content}\n\n`;

      if (c.interviewQuestions && c.interviewQuestions.length > 0) {
        answerText += `💡 **Key Interview Questions to Practice:**\n`;
        c.interviewQuestions.slice(0, 2).forEach(q => {
          answerText += `  - ${typeof q === 'string' ? q : q.q}\n`;
        });
        answerText += `\n`;
      }
    });

    answerText += `---\n### 🔗 How These Concepts Interconnect in System Architecture:\n`;
    answerText += `• **IPC & Concurrency Coupling:** Shared memory is the fastest IPC mechanism because processes bypass the kernel during data transfers; however, it strictly relies on synchronization primitives (Mutexes, Semaphores) to guard against race conditions.\n`;
    answerText += `• **Synchronization to Deadlocks:** Unordered or nested lock acquisitions across concurrent threads frequently satisfy Coffman's Circular Wait condition, causing system deadlocks. Always enforce a global lock acquisition hierarchy.\n`;
    answerText += `• **Virtual Memory & Scheduling Integration:** When a thread touches an unmapped virtual page, the MMU raises a Page Fault trap. The OS transitions the thread to the Waiting/Blocked state while the disk driver services the page in secondary storage, prompting the CPU scheduler to dispatch another ready thread.\n\n`;
    answerText += `💡 **Interview Takeaway:** In technical interviews, lead with theoretical correctness (e.g. mutual exclusion criteria, Coffman conditions), explain runtime trade-offs (context switch overhead, lock contention), and contrast edge cases (Belady's anomaly, priority inversion).`;
  } else {
    const topMatch = retrievedItems[0];
    const chunk = topMatch.chunk;

    answerText += `### Grounded Conceptual Walkthrough\n\n`;
    answerText += `**Topic:** ${chunk.title} (${chunk.section})\n\n`;
    answerText += `${chunk.content}\n\n`;

    if (chunk.interviewQuestions && chunk.interviewQuestions.length > 0) {
      answerText += `💡 **High-Yield Interview Questions & Traps:**\n`;
      chunk.interviewQuestions.slice(0, 3).forEach(q => {
        answerText += `• ${typeof q === 'string' ? q : q.q}\n`;
      });
      answerText += `\n`;
    }

    answerText += `💡 **Interview Takeaway:** When explaining this in technical interviews, clearly highlight theoretical correctness, runtime trade-offs (CPU cycles vs memory footprint), and how the underlying hardware primitives enforce safety.`;
  }

  return {
    text: answerText,
    grounded: true,
    sources: retrievedItems.map(item => ({
      id: item.chunk.id,
      title: item.chunk.title,
      section: item.chunk.section,
      subject: item.chunk.subject,
      confidence: item.confidence
    }))
  };
}

/**
 * Main RAG Doubt Resolution function:
 * 1. Checks Spring Boot backend; if grounded response available, returns it.
 * 2. If backend is ungrounded or misses the chunks, falls back to rich unified client corpus.
 * 3. If Gemini API key is configured, calls Gemini 1.5 Flash grounded in the retrieved chunks.
 * 4. Otherwise, generates rich structured grounded synthesis.
 */
export async function askRagChatbot(query, subjectFilter = 'all') {
  // Step 0: Try Spring Boot Backend RAG first
  try {
    const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:8080/api';
    const backendRes = await fetch(`${API_BASE_URL}/chat/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: query,
        subjectId: subjectFilter === 'all' ? 'os' : subjectFilter.toLowerCase()
      })
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      // CRITICAL: Only accept if the backend actually found chunks and gave a grounded answer!
      // If grounded is false or contains a rejection message, fall through to the rich client pipeline!
      if (data && data.reply && data.grounded === true && !data.reply.includes("I couldn't locate")) {
        return {
          text: data.reply,
          grounded: data.grounded,
          sources: (data.citations || []).map(c => ({
            id: c.chunkId,
            title: c.title,
            section: c.source,
            subject: subjectFilter === 'all' ? 'OS' : subjectFilter.toUpperCase(),
            confidence: (c.matchPercentage || 95) / 100
          })),
          model: 'Spring Boot 3 + PostgreSQL RAG Engine'
        };
      }
    }
  } catch (err) {
    // If backend is unreachable or fails, proceed seamlessly to client RAG engine
  }

  // Step 1: Retrieval across all 20 curriculum modules + knowledge chunks
  const retrievedItems = retrieveChunks(query, subjectFilter, 3);

  // Step 2: Check for Gemini API key
  const apiKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) 
    || (typeof localStorage !== 'undefined' ? localStorage.getItem('prep_ai_gemini_key') : null);

  if (apiKey) {
    try {
      const contextString = buildContextString(retrievedItems);
      const prompt = `You are PrepAI, an expert technical interview mentor for Computer Science students.
Ground your response in the curated curriculum chunks provided below. Provide a crystal-clear, articulate, interview-ready explanation with simple analogies, key trade-offs, and interview traps to avoid.

Curated Course Context:
${contextString}

Student Question:
"${query}"

Instructions:
1. Provide a direct, structured, interview-ready explanation.
2. If the student asked about weak modules, give a comprehensive walkthrough explaining how the concepts interconnect and how to answer them in an interview.
3. Highlight key trade-offs and edge cases.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 900
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return {
            text: candidateText,
            grounded: true,
            sources: retrievedItems.map(item => ({
              id: item.chunk.id,
              title: item.chunk.title,
              section: item.chunk.section,
              subject: item.chunk.subject,
              confidence: item.confidence
            })),
            model: 'Gemini 1.5 Flash (RAG Grounded)'
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local grounded synthesis:', err);
    }
  }

  // Step 3 (Fallback): Intelligent grounded multi-chunk synthesis
  const synthesized = synthesizeGroundedAnswer(query, retrievedItems);
  return {
    ...synthesized,
    model: 'Grounded Retrieval Engine (Curated 20 Modules)'
  };
}
