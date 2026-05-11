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
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Tableau de Bord Stratégique</h1>
        <p className="text-muted-foreground mt-2">Vue d'ensemble de la performance globale de DBS-BAN.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Recettes Totales" 
          value="12,450,000 FCFA" 
          change="+12.5%" 
          trend="up" 
          icon={TrendingUp} 
          description="Ce mois-ci"
        />
        <StatCard 
          title="Dépenses Totales" 
          value="4,230,000 FCFA" 
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Flux de Trésorerie</CardTitle>
            <CardDescription>Comparaison des recettes et dépenses hebdomadaires</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="recettes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="depenses" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Performance des Gares</CardTitle>
            <CardDescription>Top 3 des gares les plus rentables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {topGares.map((gare) => (
              <div key={gare.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm pr-1">
                  <span className="font-medium text-slate-700">{gare.name}</span>
                  <span className="text-slate-500">{gare.value}% d'objectif</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full" 
                    style={{ 
                      width: `${gare.value}%`,
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

function StatCard({ title, value, change, trend, icon: Icon, description, variant }: any) {
  return (
    <Card className="border-none shadow-sm transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${variant === 'destructive' ? 'bg-red-50 text-red-600' : 'bg-primary/10 text-primary'}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className={`flex items-center text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {change}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-4 flex items-center">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
