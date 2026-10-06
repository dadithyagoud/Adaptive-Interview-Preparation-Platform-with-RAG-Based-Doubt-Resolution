import { cn } from './Button';

export const Card = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "bg-white dark:bg-zinc-900/70 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs overflow-hidden transition-all duration-150",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => (
  <div className={cn("px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/80", className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn("text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100", className)} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={cn("p-5", className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div className={cn("px-5 py-3.5 bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center", className)} {...props}>
    {children}
  </div>
);
