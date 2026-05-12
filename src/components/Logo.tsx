import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-20 w-20',
    xl: 'h-32 w-32'
  };

  const [imageError, setImageError] = React.useState(false);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className={cn("relative rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden", sizeClasses[size])}>
        {!imageError ? (
          <img 
            src="/logo.png" 
            alt="DBS-BAN" 
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#004B93]">
            <span className="text-white font-black text-[40%] tracking-tighter italic">BAN</span>
          </div>
        )}
      </div>
      
      {showText && size !== 'sm' && (
        <div className="flex flex-col items-center">
          <h1 className={cn("font-black tracking-tighter leading-none text-[#00408B]", 
            size === 'lg' ? 'text-2xl' : size === 'xl' ? 'text-4xl' : 'text-lg'
          )}>DBS-BAN</h1>
          <p className={cn("font-bold text-slate-400 uppercase tracking-widest", 
            size === 'lg' ? 'text-[8px]' : size === 'xl' ? 'text-[10px]' : 'text-[6px]'
          )}>Transport & Logistique</p>
        </div>
      )}
    </div>
  );
}
