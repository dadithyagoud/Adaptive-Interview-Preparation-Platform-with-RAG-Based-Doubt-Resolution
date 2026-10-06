import { Link } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { subjects } from '../mockData/subjects';
import { Button } from '../components/common/Button';
import { ArrowRight, ChevronRight, BookOpen, Target, CheckCircle2, Sparkles, Clock, Lock, Zap } from 'lucide-react';

const DashboardPage = () => {
  const { 
    levels, 
    completedTopics,
    companyDetails, 
    getSubjectEmphasis, 
    overallReadiness 
  } = useProgress();
  const { user } = useAuth();

  const completedCount = Object.keys(completedTopics || {}).length;

  // Active track recommendations
  const osSubject = subjects.find(s => s.id === 'os') || subjects[0];
  const osLevel = levels['os'];
  const recommendedSubject = osSubject;
  const recommendationReason = osLevel 
    ? `Continue your ${osLevel} track across the 20 curated Operating Systems modules.`
    : `Operating Systems is live with 20 curated modules and 320 authentic interview questions. Explore topics or take a diagnostic.`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 animate-in fade-in duration-150">
      {/* Header & Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Overview
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Welcome back, {user?.name || 'Student'}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link 
            to={`/subject/os/assessment?mode=company&company=${companyDetails?.id || 'product'}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium hover:opacity-90 transition-all shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 dark:text-amber-500" />
            <span>Company Mock Test</span>
          </Link>

          <Link 
            to="/company" 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs"
          >
            <Target className="w-3.5 h-3.5 text-zinc-400" />
            <span>Target: {companyDetails?.name || 'Product-Based'}</span>
            <ChevronRight className="w-3 h-3 text-zinc-400 ml-0.5" />
          </Link>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1">
          <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Placement Readiness
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">{overallReadiness}%</span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1 rounded-full overflow-hidden mt-1.5">
            <div 
              className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${overallReadiness}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1">
          <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Modules Mastered
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {completedCount} <span className="text-xs font-normal text-zinc-400">/ 20</span>
          </div>
          <span className="text-[10px] text-zinc-400 block truncate">
            {completedCount === 20 ? 'All mastered' : `${20 - completedCount} remaining`}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1">
          <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Question Bank
          </span>
          <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            320 <span className="text-xs font-normal text-zinc-400">Qs</span>
          </div>
          <span className="text-[10px] text-zinc-400 block truncate">
            FAANG & GATE verified
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1">
          <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Target Track
          </span>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate mt-1">
            {companyDetails?.badge || 'Tier 1'}
          </div>
          <span className="text-[10px] text-zinc-400 block truncate">
            Weighted syllabus
          </span>
        </div>
      </div>

      {/* Recommended Next Step Hero */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Curriculum Focus</span>
          </div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Operating Systems (20 Modular Topics)
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {recommendationReason}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link to="/subject/os/plan">
            <Button size="sm">
              <span>Explore 20 Modules</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Subject Tracks Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Subject Tracks
          </h2>
          <span className="text-[11px] text-zinc-400 font-mono">
            1 Live • 3 Coming Soon
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {subjects.map((subject) => {
            const isLive = subject.id === 'os';
            const level = levels[subject.id];
            const emphasis = getSubjectEmphasis(subject.id);

            if (isLive) {
              return (
                <div 
                  key={subject.id}
                  className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-emerald-500/30 dark:border-emerald-500/30 flex flex-col justify-between space-y-4 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all shadow-2xs ring-1 ring-emerald-500/10"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 uppercase">
                        {subject.id}
                      </span>

                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Live (20 Mods)
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {subject.name}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {subject.description}
                      </p>
                    </div>

                    <div>
                      {level ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium capitalize">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{level} level</span>
                        </span>
                      ) : (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          Ready for practice
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                    <Link to={`/subject/${subject.id}`}>
                      <Button size="sm" className="w-full justify-between">
                        <span>Open Course</span>
                        <ChevronRight className="w-3 h-3 text-zinc-400" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            }

            // Disabled "Coming Soon" card for other subjects with no click response
            return (
              <div 
                key={subject.id}
                className="p-4 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col justify-between space-y-4 opacity-70 select-none cursor-default"
                onClick={(e) => e.preventDefault()}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500 uppercase">
                      {subject.id}
                    </span>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>Coming Soon</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                      {subject.name}
                    </h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {subject.description}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      In active curation
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                  <button 
                    disabled 
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-medium border border-zinc-200/60 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 bg-zinc-100/50 dark:bg-zinc-800/30 cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3 h-3 text-zinc-400" />
                    <span>Coming Soon</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
