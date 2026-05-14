import React, { useState, useEffect } from 'react';
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
  FileBarChart,
  Plus,
  Filter,
  FileText,
  MapPin,
  Package2,
  Wallet,
  Users2,
  Activity,
  History,
  ClipboardCheck,
  Zap,
  TrendingDown,
  ChevronRight,
  MoreVertical,
  QrCode,
  Smartphone,
  Check
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { useSearchParams } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

// --- Types ---
interface Vehicle {
  id: string;
  immat: string;
  type: string;
  status: 'Opérationnel' | 'En panne' | 'Maintenance' | 'Immobilisé';
  health: number;
  last_check: string;
  km: number;
  next_maintenance: string;
  assigned_driver?: string;
  pannes?: Panne[];
}

interface Panne {
  id: string;
  vehicle_id: string;
  description: string;
  date: string;
  severity: 'Faible' | 'Moyenne' | 'Critique';
  status: 'Signalé' | 'En cours' | 'Réparé';
}

interface Technicien {
  id: string;
  name: string;
  specialty: string;
  status: 'Disponible' | 'Occupé' | 'Absent';
  performance: number;
  assigned_tasks: number;
}

interface Intervention {
  id: string;
  vehicle_id: string;
  type: 'Préventive' | 'Corrective';
  technician_id: string;
  status: 'Attente' | 'En cours' | 'Terminé';
  date: string;
  cost?: number;
}

// --- Mock Data ---
const MOCK_VEHICLES: Vehicle[] = [
  { id: 'DBS-001', immat: '1234 HJ 01', type: 'Grand Car', status: 'Opérationnel', health: 92, last_check: '05/07/2026', km: 125000, next_maintenance: '15,000 km', assigned_driver: 'Bamba S.' },
  { id: 'DBS-012', immat: '5678 KK 01', type: 'Moyen Car', status: 'Maintenance', health: 45, last_check: '07/07/2026', km: 89000, next_maintenance: '500 km' },
  { id: 'DBS-009', immat: '9012 AB 01', type: 'Grand Car', status: 'En panne', health: 15, last_check: '01/07/2026', km: 210000, next_maintenance: 'ÉCHU' },
  { id: 'DBS-015', immat: '3456 CD 01', type: 'Minibus', status: 'Opérationnel', health: 88, last_check: '06/07/2026', km: 45000, next_maintenance: '5,000 km' },
  { id: 'DBS-022', immat: '7890 EF 01', type: 'Grand Car', status: 'Immobilisé', health: 10, last_check: '20/06/2026', km: 320000, next_maintenance: 'Urgent' },
];

const MOCK_TECHNICIANS: Technicien[] = [
  { id: 'T1', name: 'Moussa K.', specialty: 'Mécanique Générale', status: 'Occupé', performance: 95, assigned_tasks: 3 },
  { id: 'T2', name: 'Ali D.', specialty: 'Électricité Auto', status: 'Disponible', performance: 88, assigned_tasks: 0 },
  { id: 'T3', name: 'Jean P.', specialty: 'Carrosserie', status: 'Occupé', performance: 92, assigned_tasks: 1 },
];

const MOCK_INTERVENTIONS: Intervention[] = [
  { id: 'INT-001', vehicle_id: 'DBS-012', type: 'Préventive', technician_id: 'T1', status: 'En cours', date: '12/05/2026' },
  { id: 'INT-002', vehicle_id: 'DBS-009', type: 'Corrective', technician_id: 'T3', status: 'Attente', date: '12/05/2026' },
];

const CHART_DATA_MAINTENANCE = [
  { name: 'Jan', count: 12 },
  { name: 'Fév', count: 18 },
  { name: 'Mar', count: 15 },
  { name: 'Avr', count: 25 },
  { name: 'Mai', count: 20 },
  { name: 'Jun', count: 14 },
];

export function ServiceTechniqueDashboard() {
  const [searchParams] = useSearchParams();
  const subSection = searchParams.get('sub') || 'vue-globale';
  const [searchQuery, setSearchQuery] = useState("");

  const formatFCFA = (value: number) => {
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-200">
              <Settings2 className="h-7 w-7" />
            </div>
            RESPONSABLE TECHNIQUE
          </h1>
          <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
            <Activity className="h-3 w-3 text-blue-500" />
            Maintenance & Performance du Parc Automobile
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="rounded-2xl h-12 px-6 gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-100 transition-all">
            <Plus className="h-4 w-4" /> Déclarer une Panne
          </Button>
          <Button variant="outline" className="rounded-2xl h-12 px-6 gap-2 border-2 border-slate-100 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">
            <QrCode className="h-4 w-4" /> Scanner Véhicule
          </Button>
        </div>
      </div>

      {/* Main Content Area based on subSection */}
      <div>
          {subSection === 'vue-globale' && <GlobalOverviewView />}
          {subSection === 'vehicules-panne' && <VehiclesInBreakdownView />}
          {subSection === 'liste-vehicules' && <VehiclesListView searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
          {subSection === 'stock-pieces' && <StockView />}
          {subSection === 'suivi-carburant' && <FuelView />}
          {subSection === 'rapport-mensuel-technique' && <ReportsView />}
          
          {/* Default/Placeholder for non-implemented sections */}
          {!['vue-globale', 'vehicules-panne', 'liste-vehicules', 'stock-pieces', 'suivi-carburant', 'rapport-mensuel-technique'].includes(subSection) && (
            <div className="bg-white rounded-[3rem] p-20 text-center space-y-6 shadow-sm border-2 border-slate-50 border-dashed">
              <div className="h-24 w-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mx-auto">
                <Wrench className="h-12 w-12" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase">Module en Construction</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">La section {subSection.replace(/-/g, ' ')} est en cours d'optimisation.</p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

// --- Sub-Views Components ---

function GlobalOverviewView() {
  return (
    <div className="space-y-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Véhicules" value="48" sub="Parc Automobile" icon={<Bus className="h-6 w-6" />} color="blue" />
        <StatCard label="En Panne / Arrêt" value="06" sub="Véhicules Immobilisés" icon={<AlertTriangle className="h-6 w-6" />} color="rose" />
        <StatCard label="Opérationnels" value="42" sub="Prêts pour service" icon={<CheckCircle2 className="h-6 w-6" />} color="emerald" />
        <StatCard label="Interventions" value="03" sub="En cours ce jour" icon={<Wrench className="h-6 w-6" />} color="amber" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Alerts Column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Alertes Techniques</h2>
            <Badge className="bg-rose-50 text-rose-600 border-none font-black text-[9px] uppercase">Haute Priorité</Badge>
          </div>
          <div className="space-y-4">
            <AlertItem title="Vidange proche (DBS-015)" desc="Dans 250 km / Prévu demain" type="warning" />
            <AlertItem title="Contrôle technique expiré" desc="Véhicule DBS-022 immobilisé" type="critical" />
            <AlertItem title="Stock Pièces Faible" desc="Plaquettes de frein (Rupture)" type="info" />
          </div>
        </div>

        {/* Chart Card */}
        <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[3rem] overflow-hidden">
          <CardHeader className="p-10 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900">Activité Maintenance</CardTitle>
                <CardDescription className="font-bold text-[10px] uppercase tracking-widest text-slate-400 mt-2">Volume d'interventions par mois</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase text-blue-600">6 mois</Button>
                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase text-slate-400">1 an</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA_MAINTENANCE}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px', fontWeight: 'bold'}}
                  cursor={{ stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function VehiclesInBreakdownView() {
  const pannes = MOCK_VEHICLES.filter(v => v.status === 'En panne' || v.status === 'Immobilisé' || v.status === 'Maintenance');

  return (
    <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[3rem] overflow-hidden">
      <CardHeader className="p-10 border-b border-slate-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900">Véhicules Immobilisés</CardTitle>
            <CardDescription className="font-bold text-[10px] uppercase tracking-widest text-slate-400 mt-2">Suivi des réparations et délais</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-10">
          {pannes.map(v => (
            <Card key={v.id} className="border-none shadow-sm bg-slate-50/50 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-14 w-14 rounded-3xl bg-white shadow-sm flex items-center justify-center text-slate-900">
                  <Bus className="h-7 w-7" />
                </div>
                <Badge className={cn(
                  "px-3 py-1 rounded-xl text-[9px] font-black tracking-widest uppercase",
                  v.status === 'En panne' ? 'bg-rose-100 text-rose-600' : 
                  v.status === 'Maintenance' ? 'bg-amber-100 text-amber-600' : 'bg-slate-900 text-white'
                )}>
                  {v.status}
                </Badge>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 leading-tight">{v.id}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{v.immat} • {v.type}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Problème: Moteur (Température)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: '85%' }} />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[8px] font-bold bg-blue-100 text-blue-600">MK</AvatarFallback>
                  </Avatar>
                  <span className="text-[10px] font-bold text-slate-600">Technicien: Moussa K.</span>
                </div>
                <Button variant="ghost" className="h-8 text-[10px] font-black uppercase text-blue-600 p-0">
                  Détails <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function VehiclesListView({ searchQuery, setSearchQuery }: any) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Rechercher par immat, N° parc..." 
            className="pl-12 h-14 rounded-2xl bg-white border-none shadow-sm text-sm font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl h-12 px-6 border-none shadow-sm bg-white font-black uppercase text-[10px] tracking-widest">
            <Filter className="h-4 w-4 mr-2" /> Filtres
          </Button>
          <Button className="rounded-2xl h-12 px-6 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest shadow-xl">
            Ajouter Véhicule
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {MOCK_VEHICLES.map(v => (
          <div
            key={v.id}
            className="group bg-white rounded-[3rem] p-8 shadow-sm border border-slate-50 flex items-start gap-8 relative overflow-hidden"
          >
             <div className="h-24 w-24 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shrink-0">
               <Bus className="h-10 w-10" />
             </div>
             <div className="flex-1 space-y-4">
               <div className="flex items-start justify-between">
                 <div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">{v.id}</h3>
                   <div className="flex items-center gap-2 mt-1">
                     <Badge className="bg-slate-100 text-slate-500 border-none rounded-lg text-[9px] font-black tracking-widest">{v.immat}</Badge>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.type}</span>
                   </div>
                 </div>
                 <Badge className={cn(
                    "px-3 py-1 rounded-xl text-[9px] font-black tracking-widest uppercase",
                    v.status === 'Opérationnel' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  )}>
                    {v.status}
                  </Badge>
               </div>
               
               <div className="grid grid-cols-2 gap-6 pt-2">
                 <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Kilométrage</p>
                   <p className="text-sm font-black text-slate-900 font-mono">{v.km.toLocaleString()} KM</p>
                 </div>
                 <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Dernière Maintenance</p>
                   <p className="text-sm font-black text-slate-900">{v.last_check}</p>
                 </div>
               </div>

               <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                 <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest">
                   <Wrench className="h-3 w-3" /> État technique: {v.health}%
                 </div>
                 <Button variant="ghost" className="h-8 gap-2 text-slate-400 hover:text-blue-600 text-[10px] font-black uppercase tracking-widest">
                   Fiche Technique <ChevronRight className="h-4 w-4" />
                 </Button>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StockView() {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[3rem] p-10 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 h-24 w-24 bg-blue-50 rounded-full opacity-50" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6">
              <Package2 className="h-8 w-8" />
            </div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Valeur Stock Actuel</p>
            <p className="text-3xl font-black text-slate-900 mt-2">12,450,000 <span className="text-xs">F</span></p>
          </div>
        </Card>
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[3rem] p-10 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 h-24 w-24 bg-rose-50 rounded-full opacity-50" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="h-16 w-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-6">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ruptures de Stock</p>
            <p className="text-3xl font-black text-rose-600 mt-2">08 <span className="text-xs">Pièces</span></p>
          </div>
        </Card>
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[3rem] p-10 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 h-24 w-24 bg-emerald-50 rounded-full opacity-50" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6">
              <Plus className="h-8 w-8" />
            </div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Entrées Récentes</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">15 <span className="text-xs">U</span></p>
          </div>
        </Card>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[3rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-slate-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-black uppercase text-slate-900">Catalogue des Pièces</CardTitle>
            <div className="flex gap-2">
               <Button className="rounded-xl font-black uppercase text-[10px] bg-blue-600">Commander</Button>
               <Button variant="outline" className="rounded-xl font-black uppercase text-[10px]">Inventaire</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-10">
           <p className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs italic">Affichage détaillé du stock en cours de chargement...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function FuelView() {
  return (
    <div className="space-y-10">
      <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[3rem] p-12 overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-blue-50/50 skew-x-12 translate-x-20 border-l border-blue-100" />
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <Badge className="bg-blue-600 text-white border-none rounded-lg px-3 py-1 mb-4 font-black uppercase tracking-widest text-[9px]">Analyse Carburant</Badge>
              <h2 className="text-4xl font-black text-slate-900 leading-none">CONSOMMATION MENSUELLE</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-4">Période: Juillet 2026</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-3xl font-black text-blue-600 leading-none">12,500 L</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Volume Total</p>
              </div>
              <div>
                <p className="text-3xl font-black text-rose-600 leading-none">8.2M F</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Coût Éstimé</p>
              </div>
            </div>
            <Button className="rounded-2xl h-14 px-10 bg-slate-900 text-white font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-105 transition-all">
              Saisir Consommation <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Top Consommateurs
            </h3>
            {[
              { id: 'DBS-001', value: '1,200 L', pct: 85 },
              { id: 'DBS-009', value: '1,050 L', pct: 72 },
              { id: 'DBS-012', value: '980 L', pct: 65 },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-900">
                  <span>{item.id}</span>
                  <span className="text-blue-600">{item.value}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function ReportsView() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
       <ReportCard title="Rapport Journalier" date="12/05/2026" status="Généré" />
       <ReportCard title="Bilan Technique Hebdo" date="Semaine 22" status="En cours" />
       <ReportCard title="Analyse des Pannes" date="Avril 2026" status="Clôturé" />
    </div>
  );
}

// --- Helper Components ---

function StatCard({ label, value, sub, icon, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <Card className="border-none shadow-xl shadow-slate-200/40 bg-white rounded-[2.5rem] p-8 group hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
      <div className="absolute -right-8 -top-8 h-24 w-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className={cn("h-16 w-16 rounded-3xl flex items-center justify-center mb-6 shadow-sm border group-hover:scale-110 transition-transform duration-500", colorMap[color])}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{label}</p>
          <p className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{value}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
             <MapPin className="h-3 w-3" /> {sub}
          </p>
        </div>
      </div>
    </Card>
  );
}

function AlertItem({ title, desc, type }: any) {
  const iconMap: any = {
    warning: <Clock className="h-5 w-5 text-amber-500" />,
    critical: <AlertTriangle className="h-5 w-5 text-rose-500" />,
    info: <TrendingUp className="h-5 w-5 text-blue-500" />,
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-50 flex items-start gap-4 transition-all hover:shadow-md cursor-pointer group">
      <div className="mt-1">{iconMap[type]}</div>
      <div className="flex-1">
        <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase">{title}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{desc}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-blue-600 self-center" />
    </div>
  );
}

function ReportCard({ title, date, status }: any) {
  return (
    <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8 group hover:bg-slate-900 transition-all duration-500">
      <div className="flex flex-col h-full space-y-8">
        <div className="flex items-center justify-between">
          <div className="h-14 w-14 bg-slate-50 group-hover:bg-white/10 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-white transition-all">
            <FileText className="h-7 w-7" />
          </div>
          <Badge className="bg-blue-50 text-blue-600 border-none rounded-lg text-[9px] font-black px-2">{status}</Badge>
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 group-hover:text-white tracking-tight uppercase leading-tight">{title}</h3>
          <p className="text-[10px] font-bold text-slate-400 group-hover:text-white/40 uppercase tracking-widest mt-2">{date}</p>
        </div>
        <div className="pt-6 border-t border-slate-50 group-hover:border-white/10 flex items-center justify-between">
           <Button variant="ghost" className="h-8 text-[10px] font-black uppercase text-blue-500 group-hover:text-white p-0">Télécharger PDF</Button>
           <div className="h-8 w-8 rounded-full bg-slate-50 group-hover:bg-white/10 flex items-center justify-center text-slate-300 group-hover:text-white transition-all">
             <ChevronRight className="h-4 w-4" />
           </div>
        </div>
      </div>
    </Card>
  );
}
