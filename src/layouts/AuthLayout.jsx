import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
