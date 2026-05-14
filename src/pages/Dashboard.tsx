import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import { UserRole } from '@/types';
import { useLocation } from 'react-router-dom';
import { PDGDashboard } from '@/components/dashboards/PDGDashboard';
import { DRHDashboard } from '@/components/dashboards/DRHDashboard';
import { FinanceDashboard } from '@/components/dashboards/FinanceDashboard';
import { ServiceTechniqueDashboard } from '@/components/dashboards/ServiceTechniqueDashboard';
import { ChefDeGareDashboard } from '@/components/dashboards/ChefDeGareDashboard';
import { ChauffeurDashboard } from '@/components/dashboards/ChauffeurDashboard';
import { AccountsDashboard } from '@/components/dashboards/AccountsDashboard';
import { CheckingDashboard } from '@/components/dashboards/CheckingDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Bus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  console.log('Dashboard: Rendering for path:', path, 'User:', user?.email, 'Role:', user?.role);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Bus className="h-6 w-6 text-primary animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Synchronisation DBS-BAN</h2>
          <p className="text-muted-foreground animate-pulse max-w-xs mx-auto">Vérification de vos privilèges et accès au tableau de bord...</p>
        </div>
        <div className="pt-4">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="rounded-full text-xs">
            Actualiser si bloqué
          </Button>
        </div>
      </div>
    );
  }

  // Render the appropriate dashboard based on the user's role and current path
  const renderDashboard = () => {
    console.log('Dashboard: Rendering for path:', path, 'Role:', user.role);

    // 1. Check for specific functional routes FIRST
    // Using startsWith to be more resilient
    if (path.startsWith('/personnel')) {
      return <DRHDashboard initialTab="personnel" />;
    }
    if (path.startsWith('/absences')) {
      return <DRHDashboard initialTab="absences" />;
    }
    if (path.startsWith('/services/gares')) {
      return <DRHDashboard initialTab="gares" />;
    }
    if (path.startsWith('/services/technique')) {
      return <DRHDashboard initialTab="technique" />;
    }
    if (path.startsWith('/services/administration')) {
      return <DRHDashboard initialTab="administration" />;
    }
    if (path.startsWith('/finances')) {
      return <FinanceDashboard />;
    }
    if (path.startsWith('/technique')) {
      return <ServiceTechniqueDashboard />;
    }
    if (path.startsWith('/gare')) {
      return <ChefDeGareDashboard />;
    }
    if (path.startsWith('/absences')) {
      return <DRHDashboard />;
    }
    if (path.startsWith('/maintenance')) {
      return <ServiceTechniqueDashboard />;
    }
    if (path.startsWith('/voyages') || path.startsWith('/mon-vehicule') || 
        path.startsWith('/pannes') || path.startsWith('/carburant') || 
        path.startsWith('/trajet') || path.startsWith('/messages') || 
        path.startsWith('/notifications') || path.startsWith('/profile')) {
      return <ChauffeurDashboard />;
    }
    if (path.startsWith('/checking')) {
      return <CheckingDashboard />;
    }
    if (path.startsWith('/admin/accounts')) {
      return <AccountsDashboard />;
    }

    // 2. Default View based on role (Home / Dashboard)
    // We arrive here if the path is / or /dashboard or something unrecognized but authenticated
    switch (user.role) {
      case UserRole.PDG:
      case UserRole.DG:
        return <PDGDashboard />;
      
      case UserRole.DRH:
        return <DRHDashboard />;
      
      case UserRole.DAF:
      case UserRole.COMPTABLE:
        return <FinanceDashboard />;
      
      case UserRole.SERVICE_TECHNIQUE:
        return <ServiceTechniqueDashboard />;
      
      case UserRole.CHEF_DE_GARE:
        return <ChefDeGareDashboard />;
      
      case UserRole.CHAUFFEUR:
        return <ChauffeurDashboard />;
      
      default:
        console.warn('Dashboard: Unrecognized role:', user.role);
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 bg-white p-12 rounded-[2rem] shadow-sm">
            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200">
              <ShieldAlert className="h-16 w-16 text-amber-600 mx-auto" />
              <h2 className="text-2xl font-bold text-amber-900 mt-4">Accès Limité ({user.role})</h2>
              <p className="text-amber-700 mt-2 max-w-md mx-auto">
                Votre rôle n'est pas encore associé à un tableau de bord spécifique.
              </p>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Debug: Email={user.email} | ID={user.id}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderDashboard()}
    </div>
  );
}
