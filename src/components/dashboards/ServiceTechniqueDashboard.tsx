import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Bus, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  UserCircle2, 
  Star,
  Search,
  Gauge,
  Fuel,
  Settings2,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileBarChart
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

// --- Types ---
interface Chauffeur {
  id: string;
  name: string;
  matricule: string;
  photo_url: string;
  rating: number;
  total_voyages: number;
  experience: string;
  status: 'En service' | 'En repos' | 'Congé';
  assigned_bus: string;
}

interface Vehicle {
  id: string;
  immat: string;
  type: string;
  status: 'Operationnel' | 'Maintenance' | 'Arêt technique';
  health: number;
  last_check: string;
}

// --- Mock Data ---
const MOCK_CHAUFFEURS: Chauffeur[] = [
  { id: '1', name: 'Bamba Souleymane', matricule: 'CH-2024-001', photo_url: '', rating: 4.8, total_voyages: 145, experience: '8 ans', status: 'En service', assigned_bus: 'DBS-001' },
  { id: '2', name: 'Kouassi Jean-Marc', matricule: 'CH-2024-015', photo_url: '', rating: 4.5, total_voyages: 89, experience: '5 ans', status: 'En repos', assigned_bus: 'DBS-012' },
  { id: '3', name: 'Traoré Bakary', matricule: 'CH-2024-022', photo_url: '', rating: 4.2, total_voyages: 210, experience: '12 ans', status: 'En service', assigned_bus: 'DBS-009' },
  { id: '4', name: 'Diallo Oumar', matricule: 'CH-2024-034', photo_url: '', rating: 4.9, total_voyages: 56, experience: '3 ans', status: 'En service', assigned_bus: 'DBS-015' },
];

const MOCK_VEHICLES: Vehicle[] = [
  { id: 'DBS-001', immat: '1234 HJ 01', type: 'Grand Car', status: 'Operationnel', health: 92, last_check: '05/07/2026' },
  { id: 'DBS-012', immat: '5678 KK 01', type: 'Moyen Car', status: 'Maintenance', health: 45, last_check: '07/07/2026' },
  { id: 'DBS-009', immat: '9012 AB 01', type: 'Grand Car', status: 'Arêt technique', health: 15, last_check: '01/07/2026' },
  { id: 'DBS-015', immat: '3456 CD 01', type: 'Minibus', status: 'Operationnel', health: 88, last_check: '06/07/2026' },
];

export function ServiceTechniqueDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChauffeurs = MOCK_CHAUFFEURS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.matricule.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <Settings2 className="h-8 w-8 text-blue-600" />
            SERVICE TECHNIQUE
          </h1>
          <p className="text-muted-foreground font-medium mt-1 uppercase text-xs tracking-widest bg-slate-100 w-fit px-2 py-0.5 rounded">
            Maintenance & Opérations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl border-2 font-bold h-10 px-4 text-xs uppercase tracking-widest">
            <Wrench className="h-4 w-4 mr-2" /> Planner Maintenance
          </Button>
        </div>
      </div>

      <Tabs defaultValue="chauffeurs" className="w-full">
        <TabsList className="bg-slate-100 p-1.5 rounded-2xl mb-8 w-full sm:w-auto h-14">
          <TabsTrigger value="chauffeurs" className="rounded-xl px-8 h-full data-[state=active]:bg-white data-[state=active]:shadow-sm font-black uppercase text-[10px] tracking-[0.1em]">
            Gestion des Chauffeurs
          </TabsTrigger>
          <TabsTrigger value="exploitation" className="rounded-xl px-8 h-full data-[state=active]:bg-white data-[state=active]:shadow-sm font-black uppercase text-[10px] tracking-[0.1em]">
            Exploitation / Flotte
          </TabsTrigger>
        </TabsList>

        {/* --- GESTION DES CHAUFFEURS --- */}
        <TabsContent value="chauffeurs" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 px-2 flex items-center gap-2">
              <UserCircle2 className="h-4 w-4" /> REGISTRE DES PRODUCTIVITÉS
            </h2>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Chercher un chauffeur..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-white border-none shadow-sm text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredChauffeurs.map((chauffeur) => (
              <motion.div
                key={chauffeur.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex items-start gap-6 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-16 -translate-y-16 group-hover:bg-blue-50 transition-colors" />
                
                <div className="relative">
                  <Avatar className="h-24 w-24 rounded-[2rem] border-4 border-slate-50 shadow-md">
                    <AvatarImage src={chauffeur.photo_url} />
                    <AvatarFallback className="bg-blue-50 text-blue-600 font-black text-2xl">
                      {chauffeur.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-white shadow-sm">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 leading-tight">{chauffeur.name}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{chauffeur.matricule}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-black text-lg">{chauffeur.rating}</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Avis clients</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expérience</p>
                      <p className="font-bold text-slate-700">{chauffeur.experience}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Voyages</p>
                      <p className="font-bold text-slate-700">{chauffeur.total_voyages}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2 w-2 rounded-full", chauffeur.status === 'En service' ? 'bg-emerald-500' : 'bg-slate-300')} />
                      <span className="text-xs font-bold text-slate-600">{chauffeur.status}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      <Bus className="h-3 w-3" />
                      <span className="text-xs font-black uppercase tracking-widest">Affecté: {chauffeur.assigned_bus}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* --- EXPLOITATION / FLOTTE --- */}
        <TabsContent value="exploitation" className="space-y-10">
          {/* Global Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <ExploitationStat 
              label="Taux d'Activité" 
              value="88%" 
              target="Objectif: 90%"
              icon={<TrendingUp className="h-5 w-5" />}
              progress={88}
            />
            <ExploitationStat 
              label="Buses en Route" 
              value="34" 
              target="/ 42 Total"
              icon={<Bus className="h-5 w-5" />}
              progress={80}
            />
            <ExploitationStat 
              label="Conso. Carburant" 
              value="2.4k L" 
              target="Conso/Jour"
              icon={<Fuel className="h-5 w-5" />}
              progress={65}
            />
            <ExploitationStat 
              label="Santé Flotte" 
              value="94%" 
              target="Indice Technique"
              icon={<Gauge className="h-5 w-5" />}
              progress={94}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Fleet Status List */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 px-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> ÉTAT CRITIQUE DE LA FLOTTE
              </h2>
              <div className="space-y-4">
                {MOCK_VEHICLES.map((bus) => (
                  <Card key={bus.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden group">
                    <CardContent className="p-0">
                      <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all">
                        <div className="flex items-center gap-5">
                          <div className={cn(
                            "h-14 w-14 rounded-3xl flex items-center justify-center transition-colors shadow-sm",
                            bus.status === 'Operationnel' ? 'bg-emerald-50 text-emerald-600' : 
                            bus.status === 'Maintenance' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                          )}>
                            <Bus className="h-7 w-7" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase">{bus.id}</h3>
                              <Badge className="bg-slate-100 text-slate-500 border-none rounded-lg text-[9px] font-black tracking-widest">{bus.immat}</Badge>
                            </div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{bus.type} • Dernier check: {bus.last_check}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-10">
                          <div className="hidden md:block w-32 space-y-1">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                              <span>Santé</span>
                              <span className={bus.health < 30 ? 'text-rose-500' : 'text-emerald-500'}>{bus.health}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className={cn("h-full transition-all duration-1000", bus.health > 70 ? 'bg-emerald-500' : bus.health > 40 ? 'bg-amber-500' : 'bg-rose-500')} style={{ width: `${bus.health}%` }} />
                            </div>
                          </div>
                          
                          <div className="text-right flex flex-col items-end gap-2">
                            <Badge className={cn(
                              "px-3 py-1 rounded-xl text-[10px] font-black tracking-widest",
                              bus.status === 'Operationnel' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                              bus.status === 'Maintenance' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                            )}>
                              {bus.status.toUpperCase()}
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] uppercase font-black tracking-widest group-hover:bg-blue-50 group-hover:text-blue-600">
                              Diagnostic <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Overall Technical Bilan */}
            <div className="space-y-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 px-2 flex items-center gap-2">
                <FileBarChart className="h-4 w-4" /> BILAN GLOBAL TECHNIQUE
              </h2>
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-slate-900 text-white p-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full translate-x-10 -translate-y-10 blur-3xl" />
                <div className="relative z-10 space-y-8">
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter">CONCLUSION</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Rapport Mensuel - Juillet 2026</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl"><CheckCircle2 className="h-5 w-5" /></div>
                        <p className="text-xs font-bold text-slate-300">Fiabilité Service</p>
                      </div>
                      <p className="text-xl font-black">EXCELLENT</p>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl"><Clock className="h-5 w-5" /></div>
                        <p className="text-xs font-bold text-slate-300">Taux de Ponctualité</p>
                      </div>
                      <p className="text-xl font-black">94.2%</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl"><AlertTriangle className="h-5 w-5" /></div>
                        <p className="text-xs font-bold text-slate-300">Défauts Critiques</p>
                      </div>
                      <p className="text-xl font-black">02</p>
                    </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-xs text-slate-400 font-medium italic leading-relaxed">
                      "La flotte est stable. Les interventions préventives ont permis de réduire les arrêts techniques de 15% par rapport au mois dernier. Focus recommandé sur la série DBS-009 à DBS-012."
                    </p>
                  </div>

                  <Button className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black uppercase text-[10px] tracking-widest border-none shadow-lg shadow-blue-500/20">
                    Générer Rapport Complet
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ExploitationStat({ label, value, target, icon, progress }: any) {
  return (
    <Card className="border-none shadow-sm rounded-[2.5rem] p-6 bg-white group hover:shadow-lg transition-all border border-transparent hover:border-blue-50">
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-2xl flex items-center justify-center transition-colors">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{label}</p>
        <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{value}</p>
        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 flex items-center justify-between">
          <span>{target}</span>
          <span className="text-blue-600">{progress}%</span>
        </p>
        <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden mt-3">
          <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </Card>
  );
}
