import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  Bus, 
  CreditCard, 
  MapPin, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';

import { GARES } from '@/constants';

const data = [
  { name: 'Lun', recettes: 4000, depenses: 2400 },
  { name: 'Mar', recettes: 3000, depenses: 1398 },
  { name: 'Mer', recettes: 2000, depenses: 9800 },
  { name: 'Jeu', recettes: 2780, depenses: 3908 },
  { name: 'Ven', recettes: 1890, depenses: 4800 },
  { name: 'Sam', recettes: 2390, depenses: 3800 },
  { name: 'Dim', recettes: 3490, depenses: 4300 },
];

export function PDGDashboard() {
  const topGares = [
    { name: 'Adjamé', value: 85 },
    { name: 'San Pedro', value: 72 },
    { name: 'Yopougon', value: 64 },
  ].map(item => {
    const gareInfo = GARES.find(g => g.name === item.name);
    return {
      ...item,
      color: gareInfo?.color || '#3b82f6'
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Tableau de Bord Stratégique</h1>
        <p className="text-muted-foreground mt-2 font-medium">Vue d'ensemble de la performance globale de DBS-BAN.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Recettes Totales" 
          value="12,450,000" 
          unit="FCFA"
          change="+12.5%" 
          trend="up" 
          icon={TrendingUp} 
          description="Ce mois-ci"
        />
        <StatCard 
          title="Dépenses Totales" 
          value="4,230,000" 
          unit="FCFA"
          change="-2.4%" 
          trend="down" 
          icon={CreditCard} 
          description="Audit technique inclus"
        />
        <StatCard 
          title="Personnel Actif" 
          value="156" 
          change="+4" 
          trend="up" 
          icon={Users} 
          description="Toutes gares confondues"
        />
        <StatCard 
          title="Alertes Flotte" 
          value="3" 
          change="Critique" 
          trend="up" 
          icon={AlertCircle} 
          description="Véhicules en maintenance"
          variant="destructive"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-xl shadow-slate-200/50 border-none bg-white rounded-[2rem] overflow-hidden">
          <CardHeader className="p-8">
            <CardTitle className="text-lg font-black uppercase tracking-tight">Flux de Trésorerie</CardTitle>
            <CardDescription className="font-medium">Comparaison des recettes et dépenses hebdomadaires</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] p-8 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: 'oklch(var(--secondary) / 0.5)'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                />
                <Bar dataKey="recettes" fill="oklch(var(--primary))" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="depenses" fill="oklch(var(--muted-foreground) / 0.3)" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-xl shadow-slate-200/50 border-none bg-white rounded-[2rem]">
          <CardHeader className="p-8">
            <CardTitle className="text-lg font-black uppercase tracking-tight">Performance des Gares</CardTitle>
            <CardDescription className="font-medium">Top 3 des gares les plus rentables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8 pt-0">
            {topGares.map((gare) => (
              <div key={gare.name} className="space-y-3">
                <div className="flex items-center justify-between text-xs pr-1">
                  <span className="font-black text-slate-800 uppercase tracking-wider">{gare.name}</span>
                  <span className="text-slate-400 font-bold">{gare.value}%</span>
                </div>
                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden p-0.5 ring-1 ring-slate-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${gare.value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full shadow-sm" 
                    style={{ 
                      backgroundColor: gare.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, unit, change, trend, icon: Icon, description, variant }: any) {
  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 transition-all hover:scale-[1.02] rounded-[2rem] bg-white overflow-hidden group">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className={cn(
            "p-3 rounded-2xl transition-colors",
            variant === 'destructive' 
              ? 'bg-rose-50 text-rose-600' 
              : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
          )}>
            <Icon className="h-6 w-6" />
          </div>
          <Badge className={cn(
            "border-none px-2 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase",
            trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          )}>
            {trend === 'up' ? '▲' : '▼'} {change}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{title}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-black tracking-tighter text-slate-900">{value}</p>
            {unit && <span className="text-[10px] font-black text-slate-300">{unit}</span>}
          </div>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 tracking-widest flex items-center gap-1">
          <div className="h-1 w-1 rounded-full bg-slate-300" /> {description}
        </p>
      </CardContent>
    </Card>
  );
}
