import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../context/ProgressContext';
import { Button } from './Button';
import { Moon, Sun, LogOut, Terminal } from 'lucide-react';

export const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { companyDetails } = useProgress();

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          to={isLoggedIn ? "/dashboard" : "/"} 
          className="flex items-center gap-2 group focus:outline-none"
        >
          <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-zinc-50 dark:text-zinc-900 transition-opacity group-hover:opacity-90">
            <Terminal className="h-3.5 w-3.5 stroke-[2.5]" />
          </div>
          <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            PrepAI
          </span>
        </Link>
        
        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Company Target Badge (visible if logged in) */}
          {isLoggedIn && companyDetails && (
            <Link 
              to="/company" 
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-[11px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
              title="Click to switch target company track"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              <span>{companyDetails.name}</span>
            </Link>
          )}

          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          
          {isLoggedIn ? (
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-[11px] flex items-center justify-center">
                  {userInitial}
                </div>
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 hidden md:inline-block max-w-[120px] truncate">
                  {user?.name}
                </span>
              </div>

              <button 
                onClick={logout}
                className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
