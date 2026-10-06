import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { questions as mockQuestions } from '../mockData/questions';
import { subjects } from '../mockData/subjects';
import { osModules } from '../mockData/osCurriculum';
import { companies } from '../mockData/companies';
import { useProgress } from '../context/ProgressContext';
import { Button } from '../components/common/Button';
import { 
  CheckCircle2, XCircle, ArrowRight, RotateCcw, ArrowLeft, BookOpen, 
  Loader2, GraduationCap, AlertTriangle, Sparkles, ChevronRight, Check, Target,
  Zap, Building2, ShieldCheck, Award
} from 'lucide-react';
import apiService from '../services/apiService';
import { TopicDetailModal } from '../components/common/TopicDetailModal';

const companyCutoffs = {
  product: { cutoff: 85, name: 'Product-Based (FAANG / Tier-1)', focus: 'Concurrency, Synchronization, Deadlocks & Virtual Memory' },
  service: { cutoff: 60, name: 'Service-Based (Mass Recruiters)', focus: 'OS Fundamentals, System Calls, Processes & Threads' },
  data: { cutoff: 80, name: 'Data & Backend (FinTech)', focus: 'Locking, Mutex/Semaphores, Disk I/O & Memory Consistency' },
  cloud: { cutoff: 75, name: 'Networking, Cloud & DevOps', focus: 'System Calls, Dual-Mode Execution, Sockets & IPC' }
};

const AssessmentPage = () => {
  const { id, topicId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryMode = searchParams.get('mode');
  const queryCompany = searchParams.get('company');

  const { 
    levels, updateLevel, toggleTopic, completedTopics, 
    weakTopicIds, setSubjectWeakTopics, addAssessmentResult,
    selectedCompanyType, setSelectedCompanyType 
  } = useProgress();
  
  const subject = subjects.find(s => s.id === id) || { name: 'Operating Systems', id: 'os' };
  const currentModule = topicId ? osModules.find(m => m.id === topicId) : null;

  // Test mode: 'standard' (15 Qs), 'deep' (30 Qs), or 'company' (15 company-specific Qs)
  const [testMode, setTestMode] = useState(() => {
    if (queryMode === 'company') return 'company';
    return 'standard';
  });

  const [companyTrack, setCompanyTrack] = useState(() => {
    return queryCompany || selectedCompanyType || 'product';
  });

  const activeCompany = companies.find(c => c.id === companyTrack) || companies[0];
  const activeBenchmark = companyCutoffs[companyTrack] || companyCutoffs.product;

  const [questionsList, setQuestionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // questionId -> optionIndex
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedModalTopicId, setSelectedModalTopicId] = useState(null);

  const [showConfigScreen, setShowConfigScreen] = useState(!topicId);

  // Suppress Ask AI floating widget while actively configuring or taking the assessment
  useEffect(() => {
    const isTakingAssessment = !submissionResult;
    window.__prepAiChatSuppressed = isTakingAssessment;
    window.dispatchEvent(
      new CustomEvent('prep-ai-toggle-chat-visibility', {
        detail: { visible: !isTakingAssessment }
      })
    );

    return () => {
      window.__prepAiChatSuppressed = false;
      window.dispatchEvent(
        new CustomEvent('prep-ai-toggle-chat-visibility', {
          detail: { visible: true }
        })
      );
    };
  }, [submissionResult]);

  useEffect(() => {
    // If not showing config screen, load questions
    if (!showConfigScreen) {
      loadAssessmentQuestions();
    }
  }, [id, topicId, showConfigScreen, testMode, companyTrack]);

  const loadAssessmentQuestions = () => {
    let isMounted = true;
    setLoading(true);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmissionResult(null);

    if (topicId) {
      // Topic-specific modular assessment
      apiService.getTopicQuestions(topicId, 16)
        .then(data => {
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setQuestionsList(data);
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
    } else {
      // Diagnostic or Company-Specific Assessment
      const count = testMode === 'deep' ? 30 : 15;
      const companyArg = testMode === 'company' ? companyTrack : null;

      apiService.getQuestions(id || 'os', count, companyArg)
        .then(data => {
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setQuestionsList(data);
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
    }

    function loadFallback() {
      const fallback = mockQuestions[id || 'os'] || [];
      setQuestionsList(fallback.map((q, idx) => ({
        id: q.id || idx + 1,
        questionText: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation || 'Refer to standard operating system textbooks.',
        sourceCitation: 'Silberschatz OS Concepts 10th Ed.'
      })));
    }
  };

  const handleSelectOption = async (optionIndex) => {
    const currentQ = questionsList[currentIndex];
    const qId = currentQ.id;
    const updatedAnswers = {
      ...selectedAnswers,
      [qId]: optionIndex
    };
    setSelectedAnswers(updatedAnswers);

    if (currentIndex + 1 < questionsList.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Test finished, submit for evaluation
      setSubmitting(true);
      try {
        if (topicId) {
          const result = await apiService.submitTopicAssessment(topicId, updatedAnswers, 120);
          setSubmissionResult(result);
          if (result.passed && !completedTopics[topicId]) {
            toggleTopic(topicId);
          }
          if (addAssessmentResult) {
            addAssessmentResult({
              subjectId: id || 'os',
              subjectName: subject.name,
              topicId,
              topicTitle: currentModule?.title || topicId,
              isTopicTest: true,
              score: result.score,
              totalQuestions: result.totalQuestions,
              percentage: result.percentage,
              passed: result.passed,
              diagnosedLevel: result.diagnosedLevel || (result.passed ? 'advanced' : 'intermediate'),
              weakCount: (result.weakTopicIds || []).length
            });
          }
        } else {
          const companyArg = testMode === 'company' ? companyTrack : null;
          const result = await apiService.submitAssessment(id || 'os', updatedAnswers, 120, companyArg);
          
          let diagnosedWeakIds = result.weakTopicIds || [];
          if (!diagnosedWeakIds.length && result.answersReview) {
            const idSet = new Set();
            result.answersReview.forEach(r => {
              if (!r.correct) {
                if (r.topicId) idSet.add(r.topicId);
                else if (r.topic) {
                  const m = osModules.find(mod => mod.title === r.topic || mod.id === r.topic);
                  if (m) idSet.add(m.id);
                }
              }
            });
            diagnosedWeakIds = Array.from(idSet);
          }

          if (diagnosedWeakIds.length > 0) {
            setSubjectWeakTopics(id || 'os', diagnosedWeakIds);
          }

          setSubmissionResult({
            ...result,
            weakTopicIds: diagnosedWeakIds,
            testMode,
            companyType: testMode === 'company' ? (result.companyType || companyTrack) : null,
            companyName: result.companyName || activeCompany.name,
            companyCutoff: result.companyCutoff || activeBenchmark.cutoff,
            companyQualified: result.companyQualified !== undefined ? result.companyQualified : (result.percentage >= activeBenchmark.cutoff),
            companyFeedback: result.companyFeedback
          });

          if (result.diagnosedLevel) {
            updateLevel(id || 'os', result.diagnosedLevel);
          }

          if (addAssessmentResult) {
            addAssessmentResult({
              subjectId: id || 'os',
              subjectName: subject.name,
              topicId: null,
              topicTitle: testMode === 'company'
                ? `${activeCompany.name} Mock Assessment (${questionsList.length} Qs)`
                : `${subject.name} ${testMode === 'deep' ? 'Deep' : 'Standard'} Diagnostic (${questionsList.length} Qs)`,
              isTopicTest: false,
              isCompanyMock: testMode === 'company',
              companyType: testMode === 'company' ? companyTrack : null,
              companyQualified: result.companyQualified,
              score: result.score,
              totalQuestions: result.totalQuestions,
              percentage: result.percentage,
              passed: result.passed,
              diagnosedLevel: result.diagnosedLevel,
              weakCount: diagnosedWeakIds.length
            });
          }
        }
      } catch (err) {
        // Local grading fallback
        let score = 0;
        questionsList.forEach(q => {
          if (updatedAnswers[q.id] === q.correctIndex) score++;
        });
        const pct = Math.round((score / questionsList.length) * 100);
        const level = pct >= 75 ? 'advanced' : pct >= 50 ? 'intermediate' : 'beginner';
        const passed = pct >= 70;
        const isQualified = pct >= activeBenchmark.cutoff;

        if (topicId && passed && !completedTopics[topicId]) {
          toggleTopic(topicId);
        } else if (!topicId) {
          updateLevel(id || 'os', level);
        }

        const missed = questionsList.filter(q => updatedAnswers[q.id] !== q.correctIndex);
        const fallbackWeakIds = Array.from(new Set(
          missed.map(q => q.topicId || (osModules.find(m => m.title === q.topic)?.id)).filter(Boolean)
        ));

        if (!topicId && fallbackWeakIds.length > 0) {
          setSubjectWeakTopics(id || 'os', fallbackWeakIds);
        }

        if (addAssessmentResult) {
          addAssessmentResult({
            subjectId: id || 'os',
            subjectName: subject.name,
            topicId: topicId || null,
            topicTitle: topicId 
              ? (currentModule?.title || topicId) 
              : testMode === 'company'
              ? `${activeCompany.name} Mock Assessment (${questionsList.length} Qs)`
              : `${subject.name} Diagnostic (${questionsList.length} Qs)`,
            isTopicTest: Boolean(topicId),
            isCompanyMock: testMode === 'company',
            companyType: testMode === 'company' ? companyTrack : null,
            companyQualified: isQualified,
            score,
            totalQuestions: questionsList.length,
            percentage: pct,
            passed,
            diagnosedLevel: level,
            weakCount: fallbackWeakIds.length
          });
        }

        setSubmissionResult({
          score,
          totalQuestions: questionsList.length,
          percentage: pct,
          passed,
          diagnosedLevel: level,
          weakTopicIds: fallbackWeakIds,
          topicId,
          topicTitle: currentModule?.title || topicId,
          testMode,
          companyType: testMode === 'company' ? companyTrack : null,
          companyName: activeCompany.name,
          companyCutoff: activeBenchmark.cutoff,
          companyQualified: isQualified,
          companyFeedback: isQualified 
            ? `Congratulations! You cleared the ${activeBenchmark.cutoff}% cutoff for ${activeCompany.name}.` 
            : `Your score of ${pct}% is below the ${activeBenchmark.cutoff}% cutoff for ${activeCompany.name}. Focus on your missed topics below.`,
          targetedKeyPoints: currentModule?.keyPoints ? JSON.stringify(currentModule.keyPoints) : '',
          targetedDiagram: currentModule?.diagram || '',
          targetedOverview: currentModule?.overview || '',
          weakConcepts: missed.map(m => m.explanation || m.questionText),
          answersReview: questionsList.map(q => ({
            questionId: q.id,
            questionText: q.questionText,
            options: q.options,
            selectedOption: updatedAnswers[q.id],
            correctOption: q.correctIndex,
            correct: updatedAnswers[q.id] === q.correctIndex,
            explanation: q.explanation,
            sourceCitation: q.sourceCitation || 'Academic Standard',
            topicId: q.topicId,
            topic: q.topic
          }))
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleAskChatbot = (promptText) => {
    window.dispatchEvent(
      new CustomEvent('prep-ai-open-chat', {
        detail: { prompt: promptText, subject: id || 'os', autoSend: true }
      })
    );
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmissionResult(null);
    loadAssessmentQuestions();
  };

  // Find next module if in topic assessment
  const getNextModule = () => {
    if (!topicId) return null;
    const currentIndex = osModules.findIndex(m => m.id === topicId);
    if (currentIndex >= 0 && currentIndex + 1 < osModules.length) {
      return osModules[currentIndex + 1];
    }
    return null;
  };

  const nextModule = getNextModule();

  // Screen 1: Diagnostic & Company Mock Test Configuration (Only for general subject assessment)
  if (showConfigScreen && !topicId) {
    return (
      <div className="max-w-xl mx-auto py-10 space-y-6 animate-in fade-in duration-150">
        <div className="flex items-center justify-between">
          <Link to={`/subject/${id || 'os'}`} className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Subject
          </Link>
          <span className="text-[11px] font-mono text-zinc-400">PostgreSQL Bank: 320 Questions</span>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-5">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Assessment Configuration
            </span>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Choose Your Assessment Mode
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Select between a balanced diagnostic assessment or a company-specific technical interview simulation.
            </p>
          </div>

          <div className="space-y-3">
            {/* Mode 1: Standard Diagnostic */}
            <button
              onClick={() => setTestMode('standard')}
              className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                testMode === 'standard' 
                  ? 'border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-2xs' 
                  : 'border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">Standard Diagnostic</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">Recommended</span>
                </div>
                <p className="text-[11px] text-zinc-500">15 high-yield questions sampled evenly across all 20 OS topics (~10 mins)</p>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                testMode === 'standard' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-zinc-300'
              }`}>
                {testMode === 'standard' && <Check className="w-2.5 h-2.5" />}
              </div>
            </button>

            {/* Mode 2: Deep Diagnostic */}
            <button
              onClick={() => setTestMode('deep')}
              className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                testMode === 'deep' 
                  ? 'border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-2xs' 
                  : 'border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">Deep Diagnostic</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">Exhaustive</span>
                </div>
                <p className="text-[11px] text-zinc-500">30 rigorous interview questions with complete weak-area mapping (~20 mins)</p>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                testMode === 'deep' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-zinc-300'
              }`}>
                {testMode === 'deep' && <Check className="w-2.5 h-2.5" />}
              </div>
            </button>

            {/* Mode 3: Target Company Mock Assessment */}
            <button
              onClick={() => setTestMode('company')}
              className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                testMode === 'company' 
                  ? 'border-amber-600 dark:border-amber-500 bg-amber-50/25 dark:bg-amber-950/25 shadow-2xs' 
                  : 'border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">Target Company Mock Assessment</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-semibold">
                    {activeCompany.badge}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">15 questions skewed to company interview patterns with live hiring bar evaluation</p>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                testMode === 'company' ? 'border-amber-600 bg-amber-600 text-white' : 'border-zinc-300'
              }`}>
                {testMode === 'company' && <Check className="w-2.5 h-2.5" />}
              </div>
            </button>
          </div>

          {/* Company Profile Sub-Selector (Expanded if Company Mode is Active) */}
          {testMode === 'company' && (
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-white dark:bg-zinc-900 space-y-3.5 animate-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400 font-semibold">
                  Select Target Company Track:
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Cutoff: {activeBenchmark.cutoff}%
                </span>
              </div>

              {/* Company Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {companies.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCompanyTrack(c.id);
                      if (setSelectedCompanyType) setSelectedCompanyType(c.id);
                    }}
                    className={`p-2 rounded-lg text-left text-xs font-medium border transition-all ${
                      companyTrack === c.id 
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200' 
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                    }`}
                  >
                    <div className="text-[9px] font-mono uppercase text-zinc-400">{c.badge}</div>
                    <div className="text-[11px] font-semibold truncate">{c.name.split(' ')[0]}</div>
                  </button>
                ))}
              </div>

              {/* Active Company Target Details */}
              <div className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-[11px] space-y-1">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-600" />
                  <span>{activeCompany.name}</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  <strong className="font-semibold text-zinc-700 dark:text-zinc-200">Emphasized Topics:</strong> {activeBenchmark.focus}
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 italic text-[10px]">
                  💡 {activeCompany.targetRoleTips}
                </p>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <Link to={`/subject/${id || 'os'}/plan`} className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200">
              Or learn topic-by-topic
            </Link>
            <Button size="sm" onClick={() => setShowConfigScreen(false)}>
              <span>Start {testMode === 'company' ? `${activeCompany.name.split(' ')[0]} Mock` : 'Assessment'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (loading) {
    return (
      <div className="max-w-md mx-auto text-center py-24 space-y-3">
        <Loader2 className="w-5 h-5 animate-spin mx-auto text-zinc-400" />
        <p className="text-xs text-zinc-500 font-mono">
          Loading {topicId ? 'curated topic questions' : testMode === 'company' ? `${activeCompany.name} mock questions` : 'diagnostic questions'} from PostgreSQL...
        </p>
      </div>
    );
  }

  if (!questionsList.length) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-3">
        <h2 className="text-sm font-semibold">No questions available for this module.</h2>
        <Button onClick={() => navigate(`/subject/${id || 'os'}/plan`)} size="sm">
          Return to Curriculum
        </Button>
      </div>
    );
  }

  const currentQ = questionsList[currentIndex];

  // Screen 3: Result & Targeted Weak Area Remediation
  if (submissionResult) {
    const { 
      score, totalQuestions, percentage, diagnosedLevel: activeLevel, 
      passed, answersReview, targetedKeyPoints, targetedDiagram, targetedOverview,
      weakTopicIds: resultWeakTopicIds,
      companyType: resCompanyType,
      companyName: resCompanyName,
      companyCutoff: resCompanyCutoff,
      companyQualified: resCompanyQualified,
      companyFeedback: resCompanyFeedback
    } = submissionResult;

    // Filter only the questions that were missed
    const missedQuestions = answersReview?.filter(q => !q.correct) || [];

    // Determine weak module objects
    let weakModuleIds = resultWeakTopicIds || [];
    if (!weakModuleIds.length && answersReview) {
      const idSet = new Set();
      answersReview.filter(r => !r.correct).forEach(r => {
        if (r.topicId) idSet.add(r.topicId);
        else if (r.topic) {
          const m = osModules.find(mod => mod.title === r.topic || mod.id === r.topic);
          if (m) idSet.add(m.id);
        }
      });
      weakModuleIds = Array.from(idSet);
    }
    const weakModules = osModules.filter(m => weakModuleIds.includes(m.id));

    let parsedKeyPoints = [];
    if (targetedKeyPoints) {
      try {
        parsedKeyPoints = JSON.parse(targetedKeyPoints);
      } catch {
        parsedKeyPoints = [targetedKeyPoints];
      }
    } else if (currentModule?.keyPoints) {
      parsedKeyPoints = currentModule.keyPoints;
    }

    const isCompanyEval = Boolean(resCompanyType || testMode === 'company');
    const evalCutoff = resCompanyCutoff || activeBenchmark.cutoff;
    const isQualified = resCompanyQualified !== undefined ? resCompanyQualified : (percentage >= evalCutoff);

    return (
      <div className="max-w-3xl mx-auto space-y-6 py-6 animate-in fade-in duration-150">
        {/* Score & Mastery Banner */}
        <div className="p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 text-center space-y-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              {topicId 
                ? `${currentModule?.title || 'Topic'} Quiz Evaluation` 
                : isCompanyEval 
                ? `${resCompanyName || activeCompany.name} Technical Mock Evaluation` 
                : `${subject.name} Diagnostic Result`}
            </span>

            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Score: {score} / {totalQuestions}
              </h1>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                percentage >= 70 
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800' 
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
              }`}>
                {percentage}% {percentage >= 70 ? '• Mastered' : '• Review Recommended'}
              </span>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
              {percentage >= 70 
                ? 'Congratulations! You have demonstrated strong conceptual mastery in this test. Your progress has been updated in your roadmap.'
                : 'Good effort! Review the targeted concepts and explanations below to eliminate weaknesses before proceeding.'
              }
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            {topicId && nextModule && (
              <Button size="sm" onClick={() => navigate(`/subject/os/topic/${nextModule.id}/assessment`)}>
                <span>Next Module: {nextModule.title}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}

            {!topicId && weakModules.length > 0 && (
              <Link to={`/subject/${id || 'os'}/plan?filter=weak`}>
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white border-none shadow-sm gap-1.5 font-medium">
                  <Target className="w-3.5 h-3.5" />
                  <span>Study Only Weak Modules ({weakModules.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            )}

            <Button variant="outline" size="sm" onClick={handleRetake}>
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Retake Test
            </Button>

            <Link to={`/subject/${id || 'os'}/plan`}>
              <Button variant="outline" size="sm">
                <span>View Full Curriculum (20 Modules)</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* COMPANY HIRING BAR EVALUATION HERO (For Company Mock Assessment) */}
        {isCompanyEval && (
          <div className={`p-6 rounded-xl border space-y-3.5 shadow-sm animate-in fade-in duration-200 ${
            isQualified 
              ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-300 dark:border-emerald-800' 
              : 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-300 dark:border-amber-800'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {isQualified ? (
                  <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                )}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-zinc-500">
                      {resCompanyName || activeCompany.name} Hiring Benchmark
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isQualified 
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    }`}>
                      {isQualified ? '✓ PASSED BENCHMARK' : 'BENCHMARK GAP'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {isQualified 
                      ? 'Recommended for Technical Interview Rounds' 
                      : `Target Gap: ${evalCutoff - percentage}% Below Selection Bar`}
                  </h3>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-zinc-200 dark:sm:border-zinc-800 sm:pl-4">
                <div className="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  {percentage}% / {evalCutoff}%
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">Hiring Cutoff</span>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
              {resCompanyFeedback || (isQualified 
                ? `Excellent work! Your accuracy across core ${activeCompany.name} topics meets the hiring bar. Continue to reinforce edge-case concepts to maintain consistency.`
                : `Your accuracy is currently below the ${evalCutoff}% hiring threshold. ${activeCompany.name} technical interviewers focus heavily on ${activeBenchmark.focus}. Review the missed concepts below.`
              )}
            </p>
          </div>
        )}

        {/* PERSONALIZED WEAK-AREA REMEDIATION CALLOUT */}
        {!topicId && weakModules.length > 0 && (
          <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-800/80 space-y-4 shadow-sm animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[10px] font-mono uppercase tracking-wider font-semibold">
                  <Target className="w-3 h-3" />
                  <span>Adaptive Remediation Track Ready</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Targeted Learning: Focus on Your {weakModules.length} Weak Modules
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
                  Instead of repeating the entire 20-topic curriculum, click below to review only the specific modules you missed during this assessment.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link to={`/subject/${id || 'os'}/plan?filter=weak`}>
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs shadow-sm gap-1.5 whitespace-nowrap">
                    <Target className="w-3.5 h-3.5" />
                    <span>Open Filtered Plan</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* List of diagnosed weak modules */}
            <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/60">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-900 dark:text-amber-400 font-semibold block mb-2">
                Diagnosed Weak Modules to Review:
              </span>
              <div className="flex flex-wrap gap-2">
                {weakModules.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModalTopicId(m.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-amber-300 dark:border-amber-700 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:border-amber-500 transition-colors shadow-2xs group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{m.title}</span>
                    <ChevronRight className="w-3 h-3 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* Ask AI Tutor for Targeted Remediation Action */}
            <div className="pt-3 border-t border-amber-200/60 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-[11px] text-zinc-600 dark:text-zinc-300">
                Want a personalized walkthrough of these weak concepts?
              </div>
              <button
                onClick={() => handleAskChatbot(
                  `I just completed a diagnostic assessment on ${subject.name} and was diagnosed weak in these modules: ${weakModules.map(m => m.title).join(', ')}. Please provide a clear, grounded conceptual walkthrough explaining how these concepts interconnect, the top 3 architectural principles I need to understand, and key interview traps to avoid.`
                )}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs shadow-sm transition-all active:scale-[0.98] w-fit"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Tutor: Comprehensive Weak Area Breakdown</span>
              </button>
            </div>
          </div>
        )}

        {/* ANSWERS REVIEW SECTION */}
        {missedQuestions.length > 0 ? (
          <div className="p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Detailed Question Review ({missedQuestions.length} Missed)
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Review the correct technical explanations and textbook references for each missed question.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {missedQuestions.map((q, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                      {idx + 1}. {q.questionText}
                    </span>
                    {q.topic && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex-shrink-0">
                        {q.topic}
                      </span>
                    )}
                  </div>

                  {/* Options Comparison */}
                  <div className="grid sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-800 dark:text-red-300">
                      <span className="font-semibold block text-[10px] uppercase font-mono text-red-600 dark:text-red-400">Your Answer:</span>
                      <span>{q.options && q.selectedOption !== undefined ? q.options[q.selectedOption] : 'Not Answered'}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                      <span className="font-semibold block text-[10px] uppercase font-mono text-emerald-600 dark:text-emerald-400">Correct Answer:</span>
                      <span>{q.options ? q.options[q.correctOption] : ''}</span>
                    </div>
                  </div>

                  {/* Technical Remediation Note */}
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-2 space-y-1">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">Technical Concept & Why:</span>
                    <p>{q.explanation}</p>
                  </div>

                  {/* Source Citation & Ask AI Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    {q.sourceCitation ? (
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
                        <BookOpen className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                        <span>Academic Reference: {q.sourceCitation}</span>
                      </div>
                    ) : <div />}

                    <button
                      onClick={() => handleAskChatbot(
                        `I missed this interview question on ${q.topic || 'Operating Systems'}: "${q.questionText}". The correct technical answer is "${q.options[q.correctOption]}". Can you explain the core mechanism, why the alternatives fail, and provide a concrete real-world analogy?`
                      )}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline cursor-pointer bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded border border-emerald-200/80 dark:border-emerald-800/80 transition-colors w-fit"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Ask AI Tutor to Explain This Concept</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
              Flawless performance! Zero questions missed. You have complete mastery of this module.
            </p>
          </div>
        )}

        {/* TOPIC ARCHITECTURE & KEY PRINCIPLES SUMMARY */}
        {(targetedDiagram || parsedKeyPoints.length > 0) && (
          <div className="p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Core Principles & Architecture Quick Review
              </h3>
            </div>

            {/* ASCII Architectural Diagram */}
            {targetedDiagram && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-zinc-400">System Flowchart</span>
                <pre className="p-3.5 bg-zinc-900 text-zinc-100 dark:bg-zinc-950 rounded-lg text-[11px] font-mono overflow-x-auto border border-zinc-800 leading-relaxed">
                  {targetedDiagram}
                </pre>
              </div>
            )}

            {/* Key Takeaways */}
            {parsedKeyPoints.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-zinc-400">Key Takeaway Rules</span>
                <div className="space-y-1.5">
                  {parsedKeyPoints.map((point, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-850 text-xs text-zinc-600 dark:text-zinc-300 flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
  }

  // Screen 4: Active Question Test
  return (
    <div className="max-w-xl mx-auto space-y-6 py-6 animate-in fade-in duration-150">
      {/* Header & Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <Link 
            to={topicId ? `/subject/${id || 'os'}/plan` : `/subject/${id || 'os'}`} 
            className="inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Exit Test
          </Link>
          <span className="font-mono text-[11px] font-semibold">
            Question {currentIndex + 1} of {questionsList.length}
          </span>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full bg-zinc-200/70 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-600 dark:bg-emerald-500 h-full transition-all duration-200"
            style={{ width: `${((currentIndex + 1) / questionsList.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
              {topicId 
                ? `${currentModule?.title || 'Topic'} Quiz` 
                : testMode === 'company' 
                ? `${activeCompany.name.split(' ')[0]} Mock Exam` 
                : `${subject.name} Diagnostic`}
            </span>
            <div className="flex items-center gap-1.5">
              {testMode === 'company' && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-semibold">
                  Cutoff: {activeBenchmark.cutoff}%
                </span>
              )}
              {currentQ.difficulty && (
                <span className="text-[10px] font-mono text-zinc-400 capitalize px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800">
                  {currentQ.difficulty}
                </span>
              )}
            </div>
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
            {currentQ.questionText}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            return (
              <button
                key={idx}
                disabled={submitting}
                onClick={() => handleSelectOption(idx)}
                className="w-full text-left p-3.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 hover:border-emerald-500/70 dark:hover:border-emerald-500/70 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all flex items-center gap-3 group text-xs sm:text-sm"
              >
                <span className="w-6 h-6 rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-500 font-mono text-xs flex items-center justify-center flex-shrink-0 group-hover:border-emerald-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {letter}
                </span>
                <span className="text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {currentQ.sourceCitation && (
          <div className="pt-2 text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
            <BookOpen className="w-3 h-3 text-zinc-400 flex-shrink-0" />
            <span>Curated Reference: {currentQ.sourceCitation}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;
