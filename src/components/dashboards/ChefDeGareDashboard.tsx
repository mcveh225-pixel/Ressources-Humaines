import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Bus, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Users, 
  Ticket, 
  Plus,
  ArrowRight
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const departures = [
  { id: 'DP-102', car: 'DBS-001', destination: 'Abidjan', time: '14:30', status: 'Embarquement', passengers: 42, max: 70 },
  { id: 'DP-103', car: 'DBS-022', destination: 'Man', time: '16:00', status: 'Programmé', passengers: 15, max: 70 },
  { id: 'DP-101', car: 'DBS-015', destination: 'Duekoué', time: '12:00', status: 'Terminé', passengers: 68, max: 70 },
];

export function ChefDeGareDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Gestion de Gare - <span className="text-primary">Adjamé</span></h1>
          <p className="text-muted-foreground mt-2">Supervision des départs, ventes et personnel local.</p>
        </div>
        <Button className="gap-2 shadow-lg">
          <Plus className="h-4 w-4" /> Programmer un Départ
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Départs (Jour)" value="12" icon={Navigation} />
        <SummaryCard title="Passagers" value="482" icon={Users} />
        <SummaryCard title="Ventes (Tickets)" value="650,000 FCFA" icon={Ticket} />
        <SummaryCard title="Cars en Gare" value="5" icon={Bus} color="text-primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Prochains Départs</CardTitle>
            <CardDescription>Suivi des voyages programmés pour aujourd'hui</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {departures.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center h-16 w-16 rounded-xl bg-card border shadow-sm group-hover:border-primary transition-colors">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Départ</span>
                    <span className="text-xl font-black text-slate-900">{d.time}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <p className="font-bold text-slate-900">Destination: {d.destination}</p>
                       <ArrowRight className="h-3 w-3 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">Voyage {d.id} • {d.car}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-100 italic">
                        <Users className="h-3 w-3" /> {d.passengers}/{d.max} passagers
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <Badge className={
                    d.status === 'Embarquement' ? 'bg-amber-500 text-white border-none' :
                    d.status === 'Programmé' ? 'bg-blue-500 text-white border-none' :
                    'bg-slate-200 text-slate-600 border-none'
                  }>
                    {d.status}
                  </Badge>
                  <Button variant="outline" size="sm" className="h-8 text-xs font-bold px-4">
                    Gérer
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Statut Quai</CardTitle>
            <CardDescription>Flux actuel des passagers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Remplissage Global</span>
                <span>72%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full">
                <div className="h-full bg-primary rounded-full" style={{ width: '72%' }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-bold text-primary">Contrôle de Sécurité</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tous les passagers du vol DP-101 ont été enregistrés et les bagages sont chargés. Départ imminent.
              </p>
            </div>
            
            <Button variant="outline" className="w-full border-dashed">
              Signaler un Incident
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-sm group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Icon className={cn("h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors", color)} />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
