import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Bus, 
  MapPin, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  History,
  Fuel,
  ArrowRight
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function ChauffeurDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Espace Chauffeur</h1>
          <p className="text-muted-foreground mt-2">Bonjour, <span className="font-bold text-primary">{user?.fullName || 'Utilisateur'}</span> {user?.id && `• ${user.id.slice(0, 7)}`}</p>
        </div>
        <Badge className="bg-emerald-500 text-white border-none py-1.5 px-4 shadow-sm animate-pulse">En Service</Badge>
      </div>

      <div className="grid gap-6">
        <Card className="border-none bg-primary text-primary-foreground shadow-xl overflow-hidden relative">
          <div className="absolute right-0 bottom-0 opacity-10">
            <Bus className="h-48 w-48 -mr-12 -mb-12" />
          </div>
          <CardHeader>
            <CardTitle className="text-white/90 text-sm font-medium flex items-center gap-2">
              <Navigation className="h-4 w-4" /> Mission Actuelle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-4xl font-black">ADJAMÉ</span>
                <span className="text-xs text-white/60 font-bold uppercase tracking-widest">Départ: 14:30</span>
              </div>
              <motion.div 
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <ArrowRight className="h-8 w-8 text-white/40" />
              </motion.div>
              <div className="flex flex-col text-right">
                <span className="text-4xl font-black">SAN PEDRO</span>
                <span className="text-xs text-white/60 font-bold uppercase tracking-widest">ETA: 20:30</span>
              </div>
            </div>

            <div className="h-2 w-full bg-white/20 rounded-full">
              <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: '35%' }} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-4">
                 <div className="flex flex-col">
                    <span className="text-[10px] text-white/50 uppercase font-black">Passagers</span>
                    <span className="text-xl font-bold">58/70</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] text-white/50 uppercase font-black">Voyage</span>
                    <span className="text-xl font-bold">DP-102</span>
                 </div>
              </div>
              <Button size="lg" className="bg-white text-primary hover:bg-slate-50 font-bold rounded-xl px-8 shadow-lg">
                DÉMARRER
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertTriangle className="h-7 w-7 text-amber-500" />
              </div>
              <div>
                <p className="font-black text-slate-900 uppercase tracking-tight">Signaler Incident</p>
                <p className="text-sm text-slate-500 font-medium">Panne, accident ou retard critique</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Fuel className="h-7 w-7 text-blue-500" />
              </div>
              <div>
                <p className="font-black text-slate-900 uppercase tracking-tight">Demande Carburant</p>
                <p className="text-sm text-slate-500 font-medium">Recharge ou problème de jauge</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-slate-400" /> Historique Récent
              </CardTitle>
              <Button variant="ghost" size="sm">Voir tout</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
               <div className="space-y-1">
                 <p className="text-sm font-bold text-slate-900">Adjamé → Man</p>
                 <p className="text-xs text-slate-500">07 Mai 2026 • 550km</p>
               </div>
               <div className="text-right">
                 <Badge className="bg-emerald-50 text-emerald-700 border-none">Terminé</Badge>
                 <p className="text-xs font-bold text-slate-700 mt-1">11:00h</p>
               </div>
             </div>
             
             <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
               <div className="space-y-1">
                 <p className="text-sm font-bold text-slate-900">Duekoué → Yamoussoukro</p>
                 <p className="text-xs text-slate-500">06 Mai 2026 • 240km</p>
               </div>
               <div className="text-right">
                 <Badge className="bg-emerald-50 text-emerald-700 border-none">Terminé</Badge>
                 <p className="text-xs font-bold text-slate-700 mt-1">04:30h</p>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
