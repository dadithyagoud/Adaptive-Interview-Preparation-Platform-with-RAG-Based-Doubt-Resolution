import { useNavigate, Link } from 'react-router-dom';
import { companies } from '../mockData/companies';
import { useProgress } from '../context/ProgressContext';
import { Button } from '../components/common/Button';
import { Check, ArrowLeft, ArrowRight, Zap } from 'lucide-react';

const CompanySelectionPage = () => {
  const { selectedCompanyType, setSelectedCompanyType } = useProgress();
  const navigate = useNavigate();

  const handleSelect = (id) => {
    setSelectedCompanyType(id);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Navigation */}
      <div>
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Target Category Selection
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
          Select your target company profile. The platform will dynamically reweight topic importance and focus areas across all 4 subjects.
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-3.5 pt-1">
        {companies.map((company) => {
          const isSelected = selectedCompanyType === company.id;

          return (
            <div 
              key={company.id}
              onClick={() => handleSelect(company.id)}
              className={`cursor-pointer rounded-xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                isSelected 
                  ? 'bg-zinc-50 dark:bg-zinc-900/90 border-zinc-900 dark:border-zinc-100 shadow-2xs' 
                  : 'bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400">
                      {company.badge}
                    </span>
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {company.name}
                    </h2>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected 
                      ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900' 
                      : 'border-zinc-300 dark:border-zinc-700 text-transparent'
                  }`}>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {company.description}
                </p>

                {/* Example Companies */}
                {company.examples && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {company.examples.map((ex, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-600 dark:text-zinc-400 font-mono"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                )}

                {/* Subject Weights */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                    Weights
                  </span>
                  <div className="grid grid-cols-4 gap-1 text-[11px] text-center">
                    {Object.entries(company.emphasis).map(([sub, emp]) => (
                      <div key={sub} className="p-1.5 rounded bg-zinc-100/70 dark:bg-zinc-850">
                        <span className="uppercase text-[9px] font-mono text-zinc-400 block">{sub}</span>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">{emp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Button 
                  variant={isSelected ? 'primary' : 'outline'} 
                  size="sm"
                  className="flex-1 justify-between text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(company.id);
                  }}
                >
                  <span>{isSelected ? 'Active Track' : 'Select Track'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>

                <Button 
                  variant="outline"
                  size="sm"
                  className="text-xs px-2.5 bg-zinc-50 dark:bg-zinc-800/60 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 gap-1 flex-shrink-0"
                  title={`Take ${company.name} Mock Exam`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCompanyType(company.id);
                    navigate(`/subject/os/assessment?mode=company&company=${company.id}`);
                  }}
                >
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>Mock Exam</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompanySelectionPage;
