import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { subjects } from '../mockData/subjects';
import { osModules } from '../mockData/osCurriculum';
import { companies } from '../mockData/companies';
import { Button } from '../components/common/Button';
import { TopicDetailModal } from '../components/common/TopicDetailModal';
import { 
  CheckCircle2, Target, ArrowRight, ArrowLeft, RotateCcw, 
  AlertTriangle, Sparkles, BookOpen, Clock, Award, 
  TrendingUp, BarChart3, ShieldCheck, ChevronRight, 
  RefreshCw, Layers, Check, ExternalLink, Zap
} from 'lucide-react';

const moduleClusters = [
  {
    id: 'arch',
    title: 'System Architecture & Processes',
    subtitle: 'Dual-mode execution, syscalls, process lifecycle, PCBs, and threading models',
    moduleIds: ['os-mod-1', 'os-mod-2', 'os-mod-3', 'os-mod-4', 'os-mod-5']
  },
  {
    id: 'cpu-sync',
    title: 'CPU Scheduling & Concurrency',
    subtitle: 'Preemptive scheduling, critical section, mutex, semaphores, and classic sync',
    moduleIds: ['os-mod-6', 'os-mod-7', 'os-mod-8', 'os-mod-9', 'os-mod-10']
  },
  {
    id: 'mem-deadlock',
    title: 'Deadlocks & Virtual Memory',
    subtitle: "Deadlock prevention, Banker's algorithm, paging hardware, TLB, and page replacement",
    moduleIds: ['os-mod-11', 'os-mod-12', 'os-mod-13', 'os-mod-14', 'os-mod-15']
  },
  {
    id: 'storage-adv',
    title: 'Storage & Advanced Systems',
    subtitle: 'Thrashing, working set model, inode directory structures, disk scheduling, and security',
    moduleIds: ['os-mod-16', 'os-mod-17', 'os-mod-18', 'os-mod-19', 'os-mod-20']
  }
];

const companyBenchmarks = {
  product: { target: 85, label: 'FAANG / Tier-1 Product', req: 'Rigorous Concurrency, Paging & Scheduling' },
  fintech: { target: 80, label: 'FinTech & Low Latency', req: 'Kernel Internals, Multi-threading & Memory Model' },
  startup: { target: 75, label: 'High-Growth Tech Startup', req: 'Practical System Calls, Process Isolation & IPC' },
  service: { target: 60, label: 'Mass Recruiter / IT Services', req: 'Core CS Foundations & Basic OS Terminology' }
};

const ProgressPage = () => {
  const { 
    levels, 
    completedTopics, 
    toggleTopic,
    weakTopicIds,
    companyDetails, 
    selectedCompanyType,
    setSelectedCompanyType,
    overallReadiness, 
    getSubjectEmphasis,
    assessmentHistory,
    resetProgress
  } = useProgress();

  const navigate = useNavigate();
  const [selectedModalTopicId, setSelectedModalTopicId] = useState(null);

  // Completed modules count
  const completedCount = useMemo(() => {
    return osModules.filter(m => completedTopics[m.id]).length;
  }, [completedTopics]);

  // Active weak modules: diagnosed weak and not yet marked completed
  const rawWeakIds = weakTopicIds['os'] || [];
  const activeWeakIds = useMemo(() => {
    return rawWeakIds.filter(id => !completedTopics[id]);
  }, [rawWeakIds, completedTopics]);

  const activeWeakModules = useMemo(() => {
    return osModules.filter(m => activeWeakIds.includes(m.id));
  }, [activeWeakIds]);

  // Average test accuracy
  const testAccuracyAvg = useMemo(() => {
    if (!assessmentHistory || assessmentHistory.length === 0) return 0;
    const sum = assessmentHistory.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
    return Math.round(sum / assessmentHistory.length);
  }, [assessmentHistory]);

  const activeBenchmark = companyBenchmarks[selectedCompanyType] || companyBenchmarks.product;
  const readinessGap = Math.max(0, activeBenchmark.target - overallReadiness);

  const handleAskChatbot = (promptText) => {
    window.dispatchEvent(
      new CustomEvent('prep-ai-open-chat', {
        detail: { prompt: promptText, subject: 'os', autoSend: true }
      })
    );
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all diagnostic levels, completed topics, and assessment history?")) {
      resetProgress();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in duration-150">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-xs font-mono text-zinc-400">Deep Analytics</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Analytics & Interview Readiness
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
            Real-time diagnostic proficiency, syllabus mastery matrix, and placement benchmark analysis.
          </p>
        </div>

        {/* Target Track Pill */}
        <Link 
          to="/company" 
          className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-2xs group"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
            <Target className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 text-left pr-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Target Track</span>
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block group-hover:text-emerald-600 transition-colors">
              {companyDetails?.name || 'Product-Based'}
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Readiness */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Placement Readiness
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {overallReadiness}%
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              / {activeBenchmark.target}% Target
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                overallReadiness >= activeBenchmark.target 
                  ? 'bg-emerald-500' 
                  : overallReadiness >= 50 
                  ? 'bg-amber-500' 
                  : 'bg-zinc-400'
              }`}
              style={{ width: `${Math.min(overallReadiness, 100)}%` }}
            />
          </div>
        </div>

        {/* Syllabus Mastery */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Syllabus Mastery
            </span>
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {completedCount}
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              / {osModules.length} Modules
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / osModules.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Active Weak Areas */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Active Weak Areas
            </span>
            <AlertTriangle className={`w-3.5 h-3.5 ${activeWeakIds.length > 0 ? 'text-amber-500' : 'text-zinc-400'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${activeWeakIds.length > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
              {activeWeakIds.length}
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              Pending action
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 block truncate">
            {activeWeakIds.length > 0 ? 'Focus remediation needed' : 'All tested topics passed'}
          </span>
        </div>

        {/* Test Accuracy Avg */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Test Accuracy Avg
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {testAccuracyAvg}%
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              across {assessmentHistory?.length || 0} tests
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 block truncate">
            {levels['os'] ? `Tier: ${levels['os'].toUpperCase()}` : 'Awaiting diagnostic'}
          </span>
        </div>
      </div>

      {/* SECTION 1: ACTIVE WEAK AREA ACTION CENTER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Active Weak Area Action Center
            </h2>
            {activeWeakModules.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                {activeWeakModules.length} Requiring Review
              </span>
            )}
          </div>
          
          <Link 
            to="/subject/os/plan?filter=weak"
            className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium inline-flex items-center gap-1"
          >
            <span>Adaptive Study Plan</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {activeWeakModules.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-3.5">
            {activeWeakModules.map((mod) => (
              <div 
                key={mod.id}
                className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/40 via-white to-white dark:from-amber-950/20 dark:via-zinc-900/60 dark:to-zinc-900/60 flex flex-col justify-between space-y-3 shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-semibold uppercase">
                      {mod.id.replace('os-mod-', 'OS Module ')}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                      Diagnosed Weak
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                    {mod.title}
                  </h3>

                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {mod.overview}
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-100 dark:border-amber-950/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedModalTopicId(mod.id)}
                    className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3 text-zinc-400" />
                    <span>Study Notes</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAskChatbot(`Explain ${mod.title} in Operating Systems. I was diagnosed weak in this area during my diagnostic assessment. Give me a clear breakdown, core formulas or architectural principles, and key interview pitfalls.`)}
                      className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors"
                      title="Ask AI Tutor to explain this concept"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>

                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/subject/os/topic/${mod.id}/assessment`)}
                      className="text-xs py-1 h-7 bg-amber-600 hover:bg-amber-700 text-white border-none gap-1"
                    >
                      <span>Retake Quiz</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Zero Active Weak Areas Flagged
                </h3>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 max-w-lg leading-relaxed">
                  All diagnostic modules you have taken meet mastery benchmarks. Take a full 30-question diagnostic test to stress-test your knowledge across the entire curriculum.
                </p>
              </div>
            </div>

            <Link to="/subject/os/assessment">
              <Button size="sm" variant="outline" className="text-xs whitespace-nowrap">
                <span>Start New Diagnostic</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* SECTION 2: 20-MODULE CURRICULUM MASTERY MATRIX */}
      <div className="p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Operating Systems Curriculum Mastery Matrix
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Interactive 20-module cluster map. Click any module to view notes or take its modular quiz.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Mastered ({completedCount})
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Weak ({activeWeakIds.length})
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" /> Pending ({osModules.length - completedCount})
            </span>
          </div>
        </div>

        {/* 4 Category Clusters */}
        <div className="space-y-5">
          {moduleClusters.map((cluster, cIdx) => {
            const clusterMods = osModules.filter(m => cluster.moduleIds.includes(m.id));
            const clusterCompleted = clusterMods.filter(m => completedTopics[m.id]).length;
            const clusterPct = Math.round((clusterCompleted / clusterMods.length) * 100);

            return (
              <div 
                key={cluster.id}
                className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold">
                        Cluster {cIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {cluster.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {cluster.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-24 bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${clusterPct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300">
                      {clusterCompleted}/{clusterMods.length}
                    </span>
                  </div>
                </div>

                {/* Module Pill Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 pt-1">
                  {clusterMods.map((mod) => {
                    const isDone = completedTopics[mod.id];
                    const isWeak = activeWeakIds.includes(mod.id);

                    return (
                      <button
                        key={mod.id}
                        onClick={() => setSelectedModalTopicId(mod.id)}
                        className={`text-left p-2.5 rounded-lg border transition-all flex flex-col justify-between h-20 text-xs cursor-pointer group ${
                          isDone 
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-300' 
                            : isWeak 
                            ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 hover:border-amber-400' 
                            : 'bg-white dark:bg-zinc-850/60 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-zinc-400 uppercase">
                            {mod.id.replace('os-mod-', 'MOD ')}
                          </span>
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : isWeak ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          ) : (
                            <span className="w-2 h-2 rounded-full border border-zinc-300 dark:border-zinc-600" />
                          )}
                        </div>

                        <span className="text-[11px] font-medium text-zinc-800 dark:text-zinc-200 line-clamp-2 leading-tight group-hover:text-zinc-900 dark:group-hover:text-white">
                          {mod.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: TARGET COMPANY BENCHMARK COMPARISON */}
      <div className="p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-zinc-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Company Placement Benchmarks
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              How your current readiness aligns with typical selection thresholds across company tiers.
            </p>
          </div>

          <Link to="/company" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium inline-flex items-center gap-1">
            <span>Change Target Track</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(companyBenchmarks).map(([typeKey, bench]) => {
            const isSelected = selectedCompanyType === typeKey;
            const meetsCriteria = overallReadiness >= bench.target;

            return (
              <div 
                key={typeKey}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  isSelected 
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/15 dark:bg-emerald-950/20 shadow-2xs' 
                    : 'border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold">
                      {typeKey}
                    </span>
                    {isSelected && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-emerald-600 text-white">
                        Active Target
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {bench.label}
                  </h3>

                  <div className="flex items-baseline gap-1.5 pt-1">
                    <span className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">
                      {bench.target}%
                    </span>
                    <span className="text-[10px] text-zinc-400">Benchmark</span>
                  </div>

                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {bench.req}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">Status</span>
                    <span className={`font-semibold ${meetsCriteria ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {meetsCriteria ? '✓ Target Met' : `${bench.target - overallReadiness}% Gap`}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant={isSelected ? 'primary' : 'outline'}
                    className="w-full text-xs h-7 gap-1 justify-center"
                    onClick={() => {
                      if (setSelectedCompanyType) setSelectedCompanyType(typeKey);
                      navigate(`/subject/os/assessment?mode=company&company=${typeKey}`);
                    }}
                  >
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>Take {bench.label.split(' ')[0]} Mock</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: ASSESSMENT HISTORY & RECENT ATTEMPTS LOG */}
      <div className="p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Assessment History & Accuracy Log
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Chronological log of diagnostic tests and modular topic assessments.
            </p>
          </div>

          <Link to="/subject/os/assessment">
            <Button size="sm" className="text-xs gap-1.5">
              <span>Take Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {assessmentHistory && assessmentHistory.length > 0 ? (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {assessmentHistory.map((item, idx) => {
              const dateObj = new Date(item.timestamp || Date.now());
              const formattedDate = dateObj.toLocaleDateString(undefined, { 
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
              });

              return (
                <div key={item.id || idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.topicTitle || `${item.subjectName || 'Operating Systems'} Assessment`}
                      </span>
                      {item.isTopicTest && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                          Topic Quiz
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Completed on {formattedDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.score} / {item.totalQuestions}
                      </div>
                      <span className={`text-[10px] font-semibold ${item.percentage >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {item.percentage}% {item.percentage >= 70 ? '• Mastered' : '• Review'}
                      </span>
                    </div>

                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        if (item.topicId) {
                          navigate(`/subject/os/topic/${item.topicId}/assessment`);
                        } else {
                          navigate('/subject/os/assessment');
                        }
                      }}
                      className="text-xs h-7 px-2.5"
                    >
                      <span>Retake</span>
                      <RotateCcw className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-zinc-400 space-y-2">
            <p>No tests taken yet. Complete your first diagnostic assessment to generate your personalized analytics.</p>
            <Link to="/subject/os/assessment">
              <Button size="sm">Start Assessment</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Footer Controls: Reset & Quick Actions */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Link to="/subject/os/plan">
            <Button variant="outline" size="sm" className="text-xs">
              <BookOpen className="w-3.5 h-3.5 mr-1" /> View Full Curriculum
            </Button>
          </Link>
          <Link to="/subject/os/assessment">
            <Button size="sm" className="text-xs">
              <Zap className="w-3.5 h-3.5 mr-1" /> Retake Diagnostic
            </Button>
          </Link>
        </div>

        <button
          onClick={handleResetData}
          className="text-xs text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Diagnostic Data</span>
        </button>
      </div>

      {/* In-app Topic Study Modal */}
      <TopicDetailModal
        topicId={selectedModalTopicId}
        isOpen={!!selectedModalTopicId}
        onClose={() => setSelectedModalTopicId(null)}
        isCompleted={!!completedTopics[selectedModalTopicId]}
        onToggleComplete={toggleTopic}
        onAskChatbot={handleAskChatbot}
      />
    </div>
  );
};

export default ProgressPage;
