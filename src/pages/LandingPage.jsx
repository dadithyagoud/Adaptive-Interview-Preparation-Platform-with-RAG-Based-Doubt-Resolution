import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ArrowRight, Terminal } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full px-6 py-4 flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-850">
        <div className="flex items-center gap-2.5 min-w-0" title="Adaptive Interview Preparation Platform with RAG-Based Doubt Resolution">
          <div className="w-6 h-6 flex-shrink-0 rounded-md bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-zinc-50 dark:text-zinc-900">
            <Terminal className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span className="font-semibold text-xs sm:text-sm tracking-tight text-zinc-900 dark:text-zinc-100 truncate max-w-[240px] sm:max-w-none">
            Adaptive Interview Preparation Platform with RAG-Based Doubt Resolution
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col justify-center px-4 py-16 sm:py-24 max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-600 dark:text-zinc-400 mx-auto shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Core CS Interview Platform</span>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            Adaptive interview preparation, grounded in core CS fundamentals.
          </h1>

          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl mx-auto">
            Diagnostic level classification, company-type specific topic weighting, and a grounded RAG chatbot for Operating Systems, DBMS, CN, and OOPs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Link to="/signup">
            <Button size="md" className="w-full sm:w-auto shadow-xs">
              <span>Start Diagnostic</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="md" className="w-full sm:w-auto">
              Open Dashboard
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-left pt-14">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">01</span>
            <h3 className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
              Diagnostic Assessment
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Automated rule-based assessment that routes you to Beginner, Intermediate, or Advanced tracks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">02</span>
            <h3 className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
              Company Reweighting
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Prioritizes topics based on target roles across Product, Mass Recruiter, Cloud, and Data categories.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">03</span>
            <h3 className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
              RAG Doubt Resolution
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Curated course knowledge base with source citations and strict domain guardrails to prevent hallucination.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">04</span>
            <h3 className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
              Interactive Syllabi
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Comprehensive interview notes, architecture diagrams, and question sets across 4 core CS subjects.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/60 dark:border-zinc-850 py-5 text-center text-xs text-zinc-400">
        <p>B.Tech Computer Science Capstone Project</p>
      </footer>
    </div>
  );
};

export default LandingPage;
