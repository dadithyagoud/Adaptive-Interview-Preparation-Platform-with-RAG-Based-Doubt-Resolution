import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, Circle, MessageSquare, Clock, GraduationCap } from 'lucide-react';
import { topicContent } from '../../mockData/topicContent';
import { osModules } from '../../mockData/osCurriculum';
import { Button } from './Button';

export const TopicDetailModal = ({ topicId, isOpen, onClose, isCompleted, onToggleComplete, onAskChatbot }) => {
  const [showAnswers, setShowAnswers] = useState({});
  const navigate = useNavigate();

  if (!isOpen || !topicId) return null;

  const modData = osModules.find(m => m.id === topicId);
  const content = topicContent[topicId] || (modData ? {
    title: modData.title,
    subject: 'Operating Systems',
    duration: '15 min read',
    overview: modData.overview,
    diagram: modData.diagram,
    coreConcepts: (modData.keyPoints || []).map((kp, idx) => ({ name: `Key Takeaway ${idx + 1}`, desc: kp })),
    interviewQuestions: [],
    quickPrompt: `Explain ${modData.title} in Operating Systems with real job interview scenarios, edge cases, and architectural trade-offs.`
  } : {
    title: 'Topic Overview',
    subject: 'Core CS Subject',
    duration: '10 min read',
    overview: 'Curated technical interview notes for this module are actively being compiled. Please use the AI Assistant below to ask specific conceptual questions about this topic.',
    coreConcepts: [],
    interviewQuestions: [],
    quickPrompt: 'Explain the core principles of this topic for an interview.'
  });

  const toggleAnswer = (idx) => {
    setShowAnswers(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleAsk = () => {
    if (onAskChatbot && content.quickPrompt) {
      onAskChatbot(content.quickPrompt);
      onClose();
    }
  };

  const handleStartTopicTest = () => {
    onClose();
    navigate(`/subject/os/topic/${topicId}/assessment`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-zinc-400">
              <span>{content.subject}</span>
              <span>·</span>
              <span className="flex items-center gap-1 font-sans">
                <Clock className="w-3 h-3" /> {content.duration}
              </span>
            </div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
              {content.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleComplete(topicId)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isCompleted
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 border border-transparent'
              }`}
            >
              {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Circle className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
            </button>

            <button 
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs sm:text-sm">
          {/* Overview */}
          <div className="space-y-1.5">
            <h3 className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
              Overview
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-850 p-3.5 rounded-lg border border-zinc-100 dark:border-zinc-800">
              {content.overview}
            </p>
          </div>

          {/* Core Concepts */}
          {content.coreConcepts && content.coreConcepts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                Key Takeaways
              </h3>
              <div className="space-y-2">
                {content.coreConcepts.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-xs">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{item.name}: </span>
                    <span className="text-zinc-500 dark:text-zinc-400">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diagram / Code */}
          {content.diagram && (
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Structure</h3>
              <pre className="p-3 bg-zinc-900 text-zinc-100 dark:bg-zinc-950 rounded-lg text-[11px] font-mono overflow-x-auto border border-zinc-800">
                {content.diagram}
              </pre>
            </div>
          )}

          {/* Code Implementation / Minimal Example */}
          {content.codeSnippet && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                  Implementation / Code Pattern
                </h3>
                {content.codeLanguage && (
                  <span className="text-[10px] font-mono text-zinc-400">{content.codeLanguage}</span>
                )}
              </div>
              <pre className="p-3 bg-zinc-900 text-zinc-100 dark:bg-zinc-950 rounded-lg text-[11px] font-mono overflow-x-auto border border-zinc-800 leading-relaxed">
                <code>{content.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Interview Questions */}
          {content.interviewQuestions && content.interviewQuestions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                Interview Traps & Common Questions
              </h3>
              <div className="space-y-2">
                {content.interviewQuestions.map((qa, idx) => (
                  <div key={idx} className="border border-zinc-200/70 dark:border-zinc-800 rounded-lg overflow-hidden text-xs">
                    <button
                      onClick={() => toggleAnswer(idx)}
                      className="w-full text-left px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 flex items-center justify-between text-zinc-800 dark:text-zinc-200 transition-colors"
                    >
                      <span className="font-medium">{qa.q}</span>
                      <span className="text-zinc-400 text-[11px] ml-2 flex-shrink-0">
                        {showAnswers[idx] ? 'Hide' : 'Answer'}
                      </span>
                    </button>
                    {showAnswers[idx] && (
                      <div className="px-3.5 py-2.5 bg-white dark:bg-zinc-900 text-[11px] text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 leading-relaxed">
                        {qa.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deep-Dive Curated References */}
          {content.deepDiveLinks && content.deepDiveLinks.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                Academic & Authoritative References
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {content.deepDiveLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-all flex items-center justify-between text-xs group"
                  >
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <span className="font-medium text-zinc-800 dark:text-zinc-200 block truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {link.title}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono block">
                        {link.source}
                      </span>
                    </div>
                    <span className="text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 text-xs">↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleAsk}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
              <span>Ask PrepAI Assistant</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleStartTopicTest} className="gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Test This Topic</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetailModal;
