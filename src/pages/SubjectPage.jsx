import { useParams, Link } from 'react-router-dom';
import { subjects } from '../mockData/subjects';
import { studyPlans } from '../mockData/studyPlans';
import { osModules } from '../mockData/osCurriculum';
import { useProgress } from '../context/ProgressContext';
import { Button } from '../components/common/Button';
import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Sparkles, BookOpen, Layers, Clock, Target, AlertTriangle } from 'lucide-react';

const SubjectPage = () => {
  const { id } = useParams();
  const { levels, getSubjectEmphasis, companyDetails, weakTopicIds } = useProgress();
  const currentSubjectWeakIds = (weakTopicIds && weakTopicIds[id || 'os']) || [];
  const subject = subjects.find(s => s.id === id) || { id: 'os', name: 'Operating Systems', description: 'Core system software, process scheduling, synchronization, memory management, and file systems.' };
  
  const currentLevel = levels[id];
  const emphasis = getSubjectEmphasis(id);
  const subjectPlan = studyPlans[id] || {};

  if (id && id !== 'os') {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4 animate-in fade-in duration-150">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
          <Clock className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {subject?.name || 'Subject'} - Coming Soon
          </h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            This domain is currently under active curation by the PrepAI technical team. Operating Systems is fully live with 20 modules and 320 interview questions.
          </p>
        </div>
        <div className="pt-2 flex items-center justify-center gap-2">
          <Link to="/subject/os">
            <Button size="sm">Go to Operating Systems</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="sm">Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Categorize 20 OS modules into 3 tracks
  const osTracks = [
    {
      tier: 'Architecture & Processes',
      badge: 'Modules 01 - 06',
      modules: osModules.slice(0, 6)
    },
    {
      tier: 'Scheduling & Concurrency',
      badge: 'Modules 07 - 13',
      modules: osModules.slice(6, 13)
    },
    {
      tier: 'Memory & Storage Systems',
      badge: 'Modules 14 - 20',
      modules: osModules.slice(13, 20)
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>

        <span className="text-[11px] font-mono text-zinc-400">
          {emphasis} Priority ({companyDetails?.name || 'Target'})
        </span>
      </div>

      {/* Subject Header Banner */}
      <div className="p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/50 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Core Technical Domain
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="text-[11px] font-mono text-zinc-500">
                20 Curated Modules • 320 Authentic Questions
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {subject.name}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {subject.description}
            </p>
          </div>

          <div className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-right min-w-[140px]">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">
              Diagnostic Status
            </span>
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 capitalize mt-0.5">
              {currentLevel ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {currentLevel}
                </span>
              ) : (
                <span className="text-zinc-400">Ready for Assessment</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          <Link to={`/subject/${id}/plan`}>
            <Button size="sm" className="gap-1.5 w-full sm:w-auto">
              <Layers className="w-3.5 h-3.5" />
              <span>Explore 20-Module Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </Button>
          </Link>

          {currentSubjectWeakIds.length > 0 && (
            <Link to={`/subject/${id}/plan?filter=weak`}>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white border-none shadow-sm gap-1.5 w-full sm:w-auto">
                <Target className="w-3.5 h-3.5" />
                <span>Study Only Weak Modules ({currentSubjectWeakIds.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          )}

          <Link to={`/subject/${id}/assessment`}>
            <Button variant="outline" size="sm" className="gap-1.5 w-full sm:w-auto">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{currentLevel ? 'Retake Full Diagnostic' : 'Start Full Diagnostic'}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Weak Area Remediation Card on Subject Page */}
      {currentSubjectWeakIds.length > 0 && (
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-300 dark:border-amber-800/80 space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Target className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {currentSubjectWeakIds.length} Weak Modules Diagnosed
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 font-bold">
                    Targeted Track Ready
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Based on your diagnostic assessment, you can skip what you already know and focus exclusively on the {currentSubjectWeakIds.length} modules that need reinforcement.
                </p>
              </div>
            </div>
            <Link to={`/subject/${id}/plan?filter=weak`} className="flex-shrink-0">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white border-none shadow-sm gap-1.5 w-full sm:w-auto">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Go to Weak Modules Track</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Curriculum Tracks / Syllabus Architecture */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <span>Curriculum Tracks & Topics</span>
          </h2>
          <Link to={`/subject/${id}/plan`} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium">
            <span>View All in Study Plan</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {id === 'os' ? (
          <div className="grid md:grid-cols-3 gap-3">
            {osTracks.map((track, trackIdx) => (
              <div 
                key={trackIdx}
                className="rounded-xl p-4 border bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                      {track.tier}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60">
                      {track.badge}
                    </span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    {track.modules.map((m) => (
                      <li key={m.id}>
                        <Link 
                          to={`/subject/os/topic/${m.id}/assessment`}
                          className="group flex items-center justify-between gap-1.5 py-1 px-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <span className="truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-medium">
                            {m.title}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 flex-shrink-0 group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
                            Quiz (16 Qs) →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-[10px] font-mono text-zinc-400">
                    {track.modules.length} topics • {track.modules.length * 16} interview questions
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-3">
            {['beginner', 'intermediate', 'advanced'].map((lvlTier) => {
              const modules = subjectPlan[lvlTier] || [];
              const isCurrent = currentLevel === lvlTier;

              return (
                <div 
                  key={lvlTier}
                  className={`rounded-xl p-4 border transition-all space-y-2.5 ${
                    isCurrent
                      ? 'bg-zinc-50 dark:bg-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-2xs'
                      : 'bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs capitalize text-zinc-900 dark:text-zinc-100">
                      {lvlTier} Track
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                        Assigned
                      </span>
                    )}
                  </div>

                  <ul className="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {modules.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-zinc-400">·</span>
                        <span className="truncate">{m.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectPage;
