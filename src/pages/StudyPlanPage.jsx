import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { osModules } from '../mockData/osCurriculum';
import { subjects } from '../mockData/subjects';
import { Button } from '../components/common/Button';
import { TopicDetailModal } from '../components/common/TopicDetailModal';
import { 
  CheckCircle2, Circle, ArrowLeft, ChevronRight, GraduationCap, 
  BookOpen, Sparkles, Layers, Check, Search, Filter, Target, AlertTriangle, ArrowRight
} from 'lucide-react';
import apiService from '../services/apiService';

const StudyPlanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');

  const { levels, completedTopics, toggleTopic, isTopicCompanyPriority, companyDetails, weakTopicIds } = useProgress();
  const currentSubjectWeakIds = (weakTopicIds && weakTopicIds[id || 'os']) || [];
  
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [modulesList, setModulesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTrackFilter, setActiveTrackFilter] = useState(() => (filterParam === 'weak' ? 'weak' : 'all')); // 'all', 'weak', 'arch', 'sync', 'memory'
  const [searchQuery, setSearchQuery] = useState('');

  // Sync track filter when URL param changes
  useEffect(() => {
    if (filterParam === 'weak') {
      setActiveTrackFilter('weak');
    } else if (!filterParam && activeTrackFilter === 'weak') {
      setActiveTrackFilter('all');
    }
  }, [filterParam]);

  const handleFilterChange = (filterKey) => {
    setActiveTrackFilter(filterKey);
    if (filterKey === 'weak') {
      setSearchParams({ filter: 'weak' });
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('filter');
      setSearchParams(newParams);
    }
  };

  const currentLevel = levels[id];
  const subject = subjects.find(s => s.id === id) || { name: 'Operating Systems', id: 'os' };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    apiService.getStudyPlan(id || 'os')
      .then(data => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setModulesList(data);
        } else {
          loadFallback();
        }
      })
      .catch(() => {
        if (isMounted) loadFallback();
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    function loadFallback() {
      if (id === 'os' || !id) {
        setModulesList(osModules.map((m, idx) => ({
          ...m,
          sortOrder: idx + 1,
          durationMinutes: 15,
          questionCount: 16,
          levelTier: idx < 6 ? 'beginner' : (idx < 13 ? 'intermediate' : 'advanced')
        })));
      }
    }

    return () => { isMounted = false; };
  }, [id]);

  const completedCount = modulesList.filter(t => completedTopics[t.id]).length;
  const progressPercentage = modulesList.length > 0 ? Math.round((completedCount / modulesList.length) * 100) : 0;

  const handleAskChatbot = (promptText) => {
    window.dispatchEvent(
      new CustomEvent('prep-ai-open-chat', {
        detail: { prompt: promptText, subject: id || 'os', autoSend: true }
      })
    );
  };

  // Filter modules by track & search query
  const filteredModules = modulesList.filter((m, idx) => {
    const order = m.sortOrder || idx + 1;
    if (activeTrackFilter === 'weak') {
      if (!currentSubjectWeakIds.includes(m.id)) return false;
    } else if (activeTrackFilter === 'arch' && (order < 1 || order > 6)) return false;
    else if (activeTrackFilter === 'sync' && (order < 7 || order > 13)) return false;
    else if (activeTrackFilter === 'memory' && (order < 14 || order > 20)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title?.toLowerCase().includes(q);
      const matchOverview = m.overview?.toLowerCase().includes(q);
      return matchTitle || matchOverview;
    }

    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Breadcrumb & Target Company */}
      <div className="flex items-center justify-between">
        <Link 
          to={`/subject/${id}`} 
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to {subject.name}
        </Link>

        {companyDetails && (
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-200/60 dark:border-zinc-700/60">
            Targeting: {companyDetails.name}
          </span>
        )}
      </div>

      {/* Curriculum Header Card */}
      <div className="p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/50 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 20 Curated Modules
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                320 FAANG & GATE Questions
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {subject.name} Mastery Curriculum
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
              Master one topic at a time. Take a dedicated 16-question topic quiz, identify weak points instantly, and revise targeted key principles without repetitive filler.
            </p>
          </div>

          <div className="flex flex-col gap-2 min-w-[150px]">
            <Link to={`/subject/${id}/assessment`}>
              <Button variant="outline" size="sm" className="w-full text-xs">
                Take Full Diagnostic
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Metric Bar */}
        <div className="space-y-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500 text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{completedCount} of {modulesList.length} modules completed</span>
            </span>
            <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Track Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-zinc-100/80 dark:bg-zinc-850/80 border border-zinc-200/80 dark:border-zinc-800 text-xs">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTrackFilter === 'all'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            All Modules ({modulesList.length})
          </button>

          {currentSubjectWeakIds.length > 0 && (
            <button
              onClick={() => handleFilterChange('weak')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                activeTrackFilter === 'weak'
                  ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                  : 'text-amber-800 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-300/80 dark:border-amber-800/80'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Weak Modules Only ({currentSubjectWeakIds.length})</span>
            </button>
          )}

          <button
            onClick={() => handleFilterChange('arch')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTrackFilter === 'arch'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            1. Architecture (1-6)
          </button>
          <button
            onClick={() => handleFilterChange('sync')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTrackFilter === 'sync'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            2. Scheduling (7-13)
          </button>
          <button
            onClick={() => handleFilterChange('memory')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTrackFilter === 'memory'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            3. Memory (14-20)
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search topic or concept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-zinc-400"
          />
        </div>
      </div>

      {/* Adaptive Weak-Area Mode Banner */}
      {activeTrackFilter === 'weak' && (
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-300 dark:border-amber-800/80 space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Target className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Adaptive Weak-Area Mode Active
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 font-bold">
                    {currentSubjectWeakIds.length} Flagged
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Showing only the modules you missed during your diagnostic assessment. Master each topic note and pass the 16-question quiz to automatically clear it from this weak list.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
              <Button 
                size="sm" 
                onClick={() => {
                  const formattedWeakList = currentSubjectWeakIds.map(wId => {
                    const found = osModules.find(m => m.id === wId);
                    return found ? `${found.title} (${wId})` : wId;
                  }).join(', ');
                  handleAskChatbot(
                    `I am currently studying my diagnosed weak areas in Operating Systems (${formattedWeakList}). Please provide a clear, step-by-step revision strategy, explain the foundational conceptual principles, and outline the key interview questions I must practice.`,
                    id || 'os'
                  );
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white border-none text-xs gap-1.5 shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Tutor: Remediation Plan</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleFilterChange('all')}
                className="text-xs border-amber-300 dark:border-amber-800 hover:bg-amber-100/50 dark:hover:bg-amber-950/40"
              >
                Show All 20 Modules
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lightweight Prompt Banner when in 'all' mode but weak topics exist */}
      {activeTrackFilter !== 'weak' && currentSubjectWeakIds.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span>
              Diagnostic Alert: You have <strong>{currentSubjectWeakIds.length} diagnosed weak modules</strong> based on missed assessment questions.
            </span>
          </div>
          <button
            onClick={() => handleFilterChange('weak')}
            className="inline-flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:underline flex-shrink-0 cursor-pointer text-xs"
          >
            <span>Study Only Weak Modules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modules List */}
      <div className="space-y-2.5">
        {filteredModules.length === 0 ? (
          activeTrackFilter === 'weak' ? (
            <div className="text-center py-12 p-6 rounded-xl border border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">All Weak Modules Cleared!</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  You have reviewed and mastered all modules flagged in your diagnostic assessment.
                </p>
              </div>
              <Button size="sm" onClick={() => handleFilterChange('all')}>
                Return to Full Curriculum
              </Button>
            </div>
          ) : (
            <div className="text-center py-12 p-6 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">No modules match your search filter.</p>
            </div>
          )
        ) : (
          filteredModules.map((topic, index) => {
            const isCompleted = completedTopics[topic.id] || topic.completed;
            const isPriority = isTopicCompanyPriority(topic.id);
            const isWeak = currentSubjectWeakIds.includes(topic.id);
            const orderNum = topic.sortOrder || index + 1;
            const displayNum = orderNum < 10 ? `0${orderNum}` : `${orderNum}`;

            return (
              <div
                key={topic.id}
                className={`group rounded-xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-zinc-50/60 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-850'
                    : isWeak
                    ? 'bg-amber-50/20 dark:bg-amber-950/15 border-amber-300 dark:border-amber-800/80 hover:border-amber-400 dark:hover:border-amber-700 shadow-2xs'
                    : 'bg-white dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  {/* Completion check button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTopic(topic.id);
                      apiService.toggleTopic(topic.id).catch(() => {});
                    }}
                    className="mt-0.5 sm:mt-0 flex-shrink-0 text-zinc-300 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors focus:outline-hidden"
                    title={isCompleted ? "Mark as uncompleted" : "Mark as completed"}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0 space-y-1 cursor-pointer" onClick={() => setSelectedTopicId(topic.id)}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono text-zinc-400 font-semibold">{displayNum}</span>
                      <h3 className={`text-sm font-semibold tracking-tight ${
                        isCompleted ? 'text-zinc-400 line-through' : 'text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors'
                      }`}>
                        {topic.title}
                      </h3>

                      {/* Tier Badge */}
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded capitalize bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60">
                        {topic.levelTier || 'Core'}
                      </span>

                      {isPriority && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          Interview Priority
                        </span>
                      )}

                      {isWeak && !isCompleted && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          Diagnosed Weak Area
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 max-w-xl">
                      {topic.overview}
                    </p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                  {/* View Notes Button */}
                  <button
                    onClick={() => setSelectedTopicId(topic.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Notes</span>
                  </button>

                  {/* Ask AI Tutor Button */}
                  <button
                    onClick={() => handleAskChatbot(
                      `Explain ${topic.title} with a simple real-world analogy, the top 2 architectural trade-offs, and common interview questions.`,
                      id || 'os'
                    )}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors cursor-pointer"
                    title="Ask AI Tutor to explain this module"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Ask AI</span>
                  </button>

                  {/* Direct Test Topic Button */}
                  <Link to={`/subject/${id || 'os'}/topic/${topic.id}/assessment`}>
                    <Button 
                      size="sm" 
                      variant={isCompleted ? 'outline' : 'primary'} 
                      className={`gap-1.5 text-xs py-1.5 ${isWeak && !isCompleted ? 'bg-amber-600 hover:bg-amber-700 text-white border-none shadow-xs' : ''}`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>{isCompleted ? 'Retake Quiz' : isWeak ? 'Retest Weak Area' : 'Take Quiz'}</span>
                      <span className="text-[10px] font-mono opacity-80">(16 Qs)</span>
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Notes Drawer Modal */}
      <TopicDetailModal
        topicId={selectedTopicId}
        isOpen={Boolean(selectedTopicId)}
        onClose={() => setSelectedTopicId(null)}
        isCompleted={Boolean(completedTopics[selectedTopicId])}
        onToggleComplete={(tId) => {
          toggleTopic(tId);
          apiService.toggleTopic(tId).catch(() => {});
        }}
        onAskChatbot={handleAskChatbot}
      />
    </div>
  );
};

export default StudyPlanPage;
