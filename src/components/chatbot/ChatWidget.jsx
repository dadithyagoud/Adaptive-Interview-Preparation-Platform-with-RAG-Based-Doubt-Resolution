import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  X, Send, BookOpen, Key, Check, 
  ChevronDown, ChevronUp, RefreshCw, Terminal, ArrowUp
} from 'lucide-react';
import { askRagChatbot } from '../../services/ragService';

export const ChatWidget = () => {
  const location = useLocation();
  const [isSuppressed, setIsSuppressed] = useState(() => Boolean(window.__prepAiChatSuppressed));
  const [isOpen, setIsOpen] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      isBot: true,
      text: "Hello! I am PrepAI. Ask me any conceptual question on **Operating Systems, DBMS, Computer Networks, or OOPs**. Responses are grounded in verified course notes to eliminate hallucination.",
      grounded: true,
      sources: []
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState({});
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => localStorage.getItem('prep_ai_gemini_key') || '');
  const [apiKeySaved, setApiKeySaved] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Listen for suppression toggles (e.g. while taking active assessment tests)
  useEffect(() => {
    const handleToggle = (e) => {
      const { visible } = e.detail || {};
      const shouldSuppress = !visible;
      setIsSuppressed(shouldSuppress);
      if (shouldSuppress) {
        setIsOpen(false);
      }
    };
    window.addEventListener('prep-ai-toggle-chat-visibility', handleToggle);
    return () => window.removeEventListener('prep-ai-toggle-chat-visibility', handleToggle);
  }, []);

  // Failsafe: Reset suppression when navigating away from assessment routes
  useEffect(() => {
    if (!location.pathname.includes('/assessment')) {
      setIsSuppressed(false);
      window.__prepAiChatSuppressed = false;
    }
  }, [location.pathname]);

  const executeSend = async (questionText, filter) => {
    const textToSend = (questionText !== undefined ? questionText : input).trim();
    if (!textToSend || isLoading) return;

    const activeFilter = filter || subjectFilter;
    const userMsgId = Date.now().toString();

    setMessages(prev => [
      ...prev,
      { id: userMsgId, text: textToSend, isBot: false }
    ]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await askRagChatbot(textToSend, activeFilter);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: result.text,
          isBot: true,
          grounded: result.grounded,
          sources: result.sources || [],
          model: result.model
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "An error occurred while retrieving course context. Please try again.",
          isBot: true,
          grounded: false,
          sources: []
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    executeSend();
  };

  useEffect(() => {
    const handleOpenChatWithPrompt = (event) => {
      if (isSuppressed || window.__prepAiChatSuppressed) return;
      const { prompt, subject, autoSend } = event.detail || {};
      setIsOpen(true);
      const targetSubject = subject || subjectFilter;
      if (subject) setSubjectFilter(subject);
      if (prompt) {
        if (autoSend) {
          executeSend(prompt, targetSubject);
        } else {
          setInput(prompt);
        }
      }
    };
    window.addEventListener('prep-ai-open-chat', handleOpenChatWithPrompt);
    return () => window.removeEventListener('prep-ai-open-chat', handleOpenChatWithPrompt);
  }, [subjectFilter, isLoading, isSuppressed]);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('prep_ai_gemini_key', apiKeyInput.trim());
    } else {
      localStorage.removeItem('prep_ai_gemini_key');
    }
    setApiKeySaved(true);
    setTimeout(() => {
      setApiKeySaved(false);
      setShowApiKeyModal(false);
    }, 600);
  };

  const toggleSources = (msgId) => {
    setExpandedSources(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const suggestionChips = [
    { label: 'Paging vs Segmentation', query: 'What is the difference between Paging and Segmentation in OS?', sub: 'os' },
    { label: 'ACID in DBMS', query: 'Explain ACID properties in database systems with an example', sub: 'dbms' },
    { label: 'TCP 3-Way Handshake', query: 'How does the TCP 3-way handshake work?', sub: 'cn' },
    { label: 'SOLID Principles', query: 'Explain the 5 SOLID principles in OOP with examples', sub: 'oops' }
  ];

  if (isSuppressed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Trigger Capsule */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 shadow-md hover:opacity-90 transition-all active:scale-[0.98] text-xs font-medium"
          aria-label="Open PrepAI Assistant"
        >
          <Terminal className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Ask PrepAI</span>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">RAG</span>
        </button>
      )}

      {/* Main Chat Interface Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[390px] h-[520px] max-h-[82vh] bg-white dark:bg-zinc-950 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="px-3.5 py-2.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                PrepAI Assistant
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-850 text-zinc-500 border border-zinc-200/60 dark:border-zinc-800">
                Grounded
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowApiKeyModal(!showApiKeyModal)}
                title="Optional: Gemini API Key"
                className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded transition-colors"
              >
                <Key className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setMessages([messages[0]])}
                title="Clear chat"
                className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Optional API Key Panel */}
          {showApiKeyModal && (
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5 animate-in slide-in-from-top-1 duration-150">
              <span className="font-medium text-zinc-800 dark:text-zinc-200 text-[11px]">Optional: Live Gemini Key</span>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                By default, the RAG engine uses local grounded retrieval. Provide a free Gemini API key to enable live LLM generation:
              </p>
              <div className="flex gap-1.5 pt-0.5">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 px-2.5 py-1 text-xs rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-2.5 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded text-xs font-medium"
                >
                  {apiKeySaved ? <Check className="w-3.5 h-3.5" /> : 'Save'}
                </button>
              </div>
            </div>
          )}

          {/* Scope Filters */}
          <div className="px-3 py-1.5 bg-zinc-50/50 dark:bg-zinc-900/40 border-b border-zinc-100 dark:border-zinc-850 flex items-center gap-1 text-[11px] overflow-x-auto">
            <span className="text-zinc-400 mr-1 text-[10px] font-mono uppercase">Scope:</span>
            {['all', 'os', 'dbms', 'cn', 'oops'].map(sub => (
              <button
                key={sub}
                onClick={() => setSubjectFilter(sub)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase transition-colors ${
                  subjectFilter === sub
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.isBot ? 'items-start' : 'items-end'}`}>
                <div
                  className={`max-w-[88%] leading-relaxed ${
                    msg.isBot
                      ? 'text-zinc-800 dark:text-zinc-200 space-y-1'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2'
                  }`}
                >
                  <div className="whitespace-pre-line">
                    {msg.text}
                  </div>

                  {msg.model && (
                    <div className="text-[10px] text-zinc-400 font-mono pt-1">
                      via {msg.model}
                    </div>
                  )}
                </div>

                {/* Grounded Citations Chip */}
                {msg.isBot && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-1">
                    <button
                      onClick={() => toggleSources(msg.id)}
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-mono py-0.5 transition-colors"
                    >
                      <BookOpen className="w-3 h-3 text-zinc-400" />
                      <span>{msg.sources.length} Grounded {msg.sources.length === 1 ? 'Chunk' : 'Chunks'}</span>
                      {expandedSources[msg.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {expandedSources[msg.id] && (
                      <div className="mt-1 p-2 rounded border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 space-y-1.5 text-[10px]">
                        {msg.sources.map((src, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-2">
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">
                              [{src.subject.toUpperCase()}] {src.title}
                            </span>
                            <span className="font-mono text-zinc-400">{src.confidence}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="text-zinc-400 text-xs font-mono flex items-center gap-1.5 py-1">
                <span className="w-1 h-1 bg-zinc-400 rounded-full animate-pulse" />
                <span>Retrieving course chunks...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          {messages.length <= 2 && (
            <div className="px-3 py-1.5 border-t border-zinc-100 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/30 flex gap-1.5 overflow-x-auto">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSubjectFilter(chip.sub);
                    setInput(chip.query);
                  }}
                  className="flex-shrink-0 px-2 py-0.5 rounded border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[10px] text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 transition-colors whitespace-nowrap"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <form 
            onSubmit={handleSend}
            className="p-2.5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center gap-1.5"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Ask on ${subjectFilter === 'all' ? 'OS, DBMS, CN, or OOPs' : subjectFilter.toUpperCase()}...`}
              className="flex-1 px-3 py-2 text-xs rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-8 w-8 rounded-md bg-zinc-900 dark:bg-zinc-100 disabled:opacity-30 text-white dark:text-zinc-900 flex items-center justify-center transition-opacity flex-shrink-0"
            >
              <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
