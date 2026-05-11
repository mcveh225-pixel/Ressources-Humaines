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
      <div className={cn("relative rounded-full bg-white shadow-md border-2 border-slate-100 flex items-center justify-center overflow-hidden", sizeClasses[size])}>
        {!imageError ? (
          <img 
            src="/logo.png" 
            alt="DBS-BAN" 
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <>
            {/* Background Sunset - Gradient reconstruction fallback */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-orange-300 to-blue-600 opacity-80" />
            
            {/* The Sun */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-yellow-200 rounded-full blur-sm opacity-90 shadow-[0_0_10px_white]" />
            
            {/* Circular Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-between p-1 z-10">
              <span className="text-[6px] font-black text-[#00408B] uppercase tracking-tighter leading-none mt-0.5">DIOMANDE</span>
              
              <div className="flex flex-col items-center justify-center -space-y-1">
                <span className="text-sm font-black text-[#00408B] drop-shadow-sm scale-x-125">DBS</span>
              </div>
              
              <span className="text-[5px] font-black text-[#00408B] uppercase tracking-tighter leading-none mb-0.5 text-center">BAN SERVICE</span>
            </div>

            {/* Stars */}
            <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[4px] text-yellow-500">â˜…</div>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[4px] text-yellow-500">â˜…</div>
            
            {/* Glass effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </>
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
