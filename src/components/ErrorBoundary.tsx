import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center space-y-6">
            <div className="h-20 w-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto">
              <AlertTriangle className="h-10 w-10" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Oups ! Une erreur est survenue</h1>
              <p className="text-slate-500 font-medium">
                L'application a rencontré un problème inattendu.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl text-left overflow-auto max-h-40">
              <p className="text-xs font-mono text-rose-600 font-bold">
                {this.state.error?.name}: {this.state.error?.message}
              </p>
            </div>

            <Button 
              onClick={() => window.location.reload()}
              className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest shadow-xl shadow-slate-100"
            >
              <RefreshCcw className="mr-2 h-5 w-5" /> Recharger l'application
            </Button>
            
            <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
              DIOMANDE BAN SERVICE
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
