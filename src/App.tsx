/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { DashboardLayout } from './components/DashboardLayout';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import EmployeeRegistration from './pages/EmployeeRegistration';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { supabase } from '@/lib/supabase';
import { GARES } from '@/constants';

function GareSync() {
  useEffect(() => {
    const syncGares = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session) return;

        const garesToSync = GARES.map(g => ({
          id: g.id,
          name: g.name,
          location: g.location || g.name
        }));
        
        await supabase.from('gares').upsert(garesToSync, { onConflict: 'id' });
        console.log('Global Gare Sync completed');
      } catch (err) {
        console.warn('Global Gare Sync failed:', err);
      }
    };
    syncGares();
  }, []);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <GareSync />
      <TooltipProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register-employee" element={<EmployeeRegistration />} />
            
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/personnel" element={<DashboardPage />} />
              <Route path="/finances" element={<DashboardPage />} />
              <Route path="/technique" element={<DashboardPage />} />
              <Route path="/absences" element={<DashboardPage />} />
              <Route path="/services/gares" element={<DashboardPage />} />
              <Route path="/services/technique" element={<DashboardPage />} />
              <Route path="/services/administration" element={<DashboardPage />} />
              <Route path="/notes" element={<DashboardPage />} />
              <Route path="/gare" element={<DashboardPage />} />
              <Route path="/voyages" element={<DashboardPage />} />
              <Route path="/checking" element={<DashboardPage />} />
              <Route path="/mon-vehicule" element={<DashboardPage />} />
              <Route path="/pannes" element={<DashboardPage />} />
              <Route path="/carburant" element={<DashboardPage />} />
              <Route path="/trajet" element={<DashboardPage />} />
              <Route path="/messages" element={<DashboardPage />} />
              <Route path="/notifications" element={<DashboardPage />} />
              <Route path="/profile" element={<DashboardPage />} />
              <Route path="/admin/accounts" element={<DashboardPage />} />
              <Route path="/maintenance" element={<DashboardPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster position="top-right" closeButton richColors />
      </TooltipProvider>
    </AuthProvider>
  );
}
