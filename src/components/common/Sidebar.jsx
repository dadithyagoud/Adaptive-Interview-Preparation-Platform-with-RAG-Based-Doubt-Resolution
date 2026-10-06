import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, BookOpen, LineChart } from 'lucide-react';
import { subjects } from '../../mockData/subjects';
import { useProgress } from '../../context/ProgressContext';
import { cn } from './Button';

export const Sidebar = () => {
  const { levels, overallReadiness, companyDetails } = useProgress();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Target Track', path: '/company', icon: Target },
    { name: 'Analytics', path: '/progress', icon: LineChart },
  ];

  return (
    <aside className="w-56 flex-shrink-0 hidden md:flex flex-col justify-between border-r border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="p-3 space-y-6">
        <div>
          <div className="px-2.5 py-1 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Platform
          </div>
          <nav className="mt-1 space-y-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-lg transition-colors",
                  isActive 
                    ? "bg-zinc-200/70 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 font-semibold" 
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-850/50"
                )}
              >
                <item.icon className="h-3.5 w-3.5 stroke-[2]" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          <div className="px-2.5 py-1 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Curriculum
          </div>
          <nav className="mt-1 space-y-0.5">
            {subjects.map((subject) => {
              const level = levels[subject.id];

              return (
                <NavLink
                  key={subject.id}
                  to={`/subject/${subject.id}`}
                  className={({ isActive }) => cn(
                    "flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-lg transition-colors",
                    isActive 
                      ? "bg-zinc-200/70 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 font-semibold" 
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-850/50"
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <BookOpen className="h-3.5 w-3.5 stroke-[1.8] flex-shrink-0" />
                    <span className="truncate">{subject.name}</span>
                  </div>

                  {level && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 capitalize">
                      {level.charAt(0)}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Minimal Footer Status */}
      <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-500">Readiness</span>
          <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{overallReadiness}%</span>
        </div>
        <div className="w-full bg-zinc-200/70 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
          <div 
            className="bg-zinc-900 dark:bg-zinc-100 h-full rounded-full transition-all duration-300"
            style={{ width: `${overallReadiness}%` }}
          />
        </div>
        <div className="text-[10px] text-zinc-400 truncate">
          {companyDetails?.name || 'Standard Track'}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
