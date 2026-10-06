import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <span className="text-xs font-mono text-zinc-400">404 Error</span>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Page Not Found</h1>
      <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="pt-2">
        <Link to="/dashboard">
          <Button size="sm">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
