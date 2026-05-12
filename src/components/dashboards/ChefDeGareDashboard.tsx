import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Bus, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Users, 
  Ticket, 
  Plus,
  ArrowRight,
  Search,
  Phone,
  Mail,
  MoreVertical,
  ArrowLeft,
  User,
  Briefcase
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { GARES } from '@/constants';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Logo } from '@/components/Logo';

// --- Types ---
interface Employee {
  id: string;
  matricule: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  gare_id: string;
  service: string;
  status: string;
  phone: string;
  email: string;
  photo_url: string;
  date_embauche: string;
  adresse?: string;
}

const departures = [
  { id: 'DP-102', car: 'DBS-001', destination: 'Abidjan', time: '14:30', status: 'Embarquement', passengers: 42, max: 70 },
  { id: 'DP-103', car: 'DBS-022', destination: 'Man', time: '16:00', status: 'Programmé', passengers: 15, max: 70 },
  { id: 'DP-101', car: 'DBS-015', destination: 'Duekoué', time: '12:00', status: 'Terminé', passengers: 68, max: 70 },
];

export function ChefDeGareDashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSub = searchParams.get('sub') || 'vue-generale';
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isCardOpen, setIsCardOpen] = useState(false);

  const currentGareId = user?.gareId || 'adjame';
  const currentGareName = GARES.find(g => g.id === currentGareId)?.name || 'Adjamé';

  useEffect(() => {
    if (activeSub === 'personnel') {
      fetchPersonnel();
    }
  }, [activeSub, currentGareId]);

  const fetchPersonnel = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('employees')
        .select('*')
        .eq('gare_id', currentGareId);
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching personnel:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.matricule.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Gestion de Gare - <span className="text-primary">{currentGareName}</span></h1>
          <p className="text-muted-foreground mt-2">Supervision des départs, ventes et personnel local.</p>
        </div>
        <Button className="gap-2 shadow-lg">
          <Plus className="h-4 w-4" /> Programmer un Départ
        </Button>
      </div>

      <Tabs 
        value={activeSub} 
        onValueChange={(val) => setSearchParams({ sub: val })}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <TabsList className="bg-white border-none h-14 p-1.5 rounded-2xl shadow-sm">
            <TabsTrigger 
              value="vue-generale" 
              className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-black uppercase text-[10px] tracking-widest"
            >
              Vue Générale
            </TabsTrigger>
            <TabsTrigger 
              value="personnel" 
              className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-black uppercase text-[10px] tracking-widest"
            >
              Le Personnel
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="vue-generale" className="space-y-8 border-none p-0 outline-none">
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
        </TabsContent>

        <TabsContent value="personnel" className="space-y-8 border-none p-0 outline-none">
          <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Personnel de la Gare</CardTitle>
                  <CardDescription className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Liste des employés assignés à {currentGareName}</CardDescription>
                </div>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Rechercher personnel..." 
                    className="pl-10 h-11 rounded-xl bg-slate-50 border-none text-xs font-bold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-20 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-4">Chargement du personnel...</p>
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-slate-200" />
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Aucun employé trouvé</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                  {filteredEmployees.map((emp) => (
                    <Card key={emp.id} className="border-none shadow-sm bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all rounded-[2rem] p-6 group cursor-pointer" onClick={() => { setSelectedEmployee(emp); setIsCardOpen(true); }}>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                          <AvatarImage src={emp.photo_url} className="object-cover" />
                          <AvatarFallback className="bg-primary/10 text-primary font-black uppercase text-xs">{emp.last_name[0]}{emp.first_name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate">{emp.full_name}</p>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">{emp.role}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 text-slate-300">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-500">{emp.phone || 'N/A'}</span>
                        </div>
                        <Badge className="bg-white text-slate-400 border border-slate-100 text-[10px] font-black uppercase tracking-tighter px-2 h-6">
                          {emp.matricule}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ProfessionalCard 
        employee={selectedEmployee} 
        open={isCardOpen} 
        onOpenChange={setIsCardOpen} 
      />
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

const ProfessionalCard = ({ employee, open, onOpenChange }: { 
  employee: Employee | null, 
  open: boolean, 
  onOpenChange: (open: boolean) => void,
}) => {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[380px] p-0 overflow-hidden border-none bg-white rounded-none shadow-2xl max-h-[95vh]">
        <ScrollArea className="h-full max-h-[95vh]">
          <div className="relative w-full flex flex-col bg-white overflow-hidden border-4 border-slate-100 min-h-[600px]">
            {/* Header Section with Diagonal Split */}
            <div className="relative h-[140px] w-full overflow-hidden">
              <div 
                className="absolute inset-0 bg-[#00408B]" 
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 65%, 0 100%)' }}
              />
              
              <div className="relative z-10 p-5 flex items-start gap-4">
                <Logo size="md" showText={false} className="shadow-2xl border-white" />
                
                <div className="flex flex-col">
                  <h1 className="text-3xl font-black text-white tracking-tighter leading-none">DBS-BAN</h1>
                  <p className="text-white text-[10px] font-bold tracking-widest mt-2 opacity-90">DIOMANDÉ BAN SERVICE</p>
                </div>
              </div>
            </div>

            {/* Portrait Section */}
            <div className="relative h-[160px] flex items-center justify-center mt-[-35px]">
              <div className="absolute w-44 h-44 rounded-full border-[10px] border-[#00AEEF]/10 translate-x-1" />
              <div className="absolute w-36 h-36 rounded-full border-[8px] border-[#00AEEF]/20 -translate-x-1" />
              
              <div className="relative w-36 h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-50 z-10 ring-1 ring-slate-100">
                <Avatar className="h-full w-full rounded-none">
                  <AvatarImage src={employee.photo_url} className="object-cover" />
                  <AvatarFallback className="text-4xl font-black text-[#00408B] bg-slate-100">
                    {employee.last_name[0]}{employee.first_name[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

            </div>

            {/* Info Section */}
            <div className="px-10 py-5 space-y-3">
              <div className="grid grid-cols-[110px_1fr] items-baseline gap-2">
                <span className="text-xl font-bold text-[#00408B]">Nom</span>
                <span className="text-xl font-black text-[#00408B] leading-none uppercase truncate">: {employee.last_name}</span>
              </div>
              
              <div className="grid grid-cols-[110px_1fr] items-baseline gap-2">
                <span className="text-xl font-bold text-[#00408B]">Prénom</span>
                <span className="text-xl font-black text-[#00408B] leading-none uppercase truncate">: {employee.first_name}</span>
              </div>
              
              <div className="grid grid-cols-[110px_1fr] items-baseline gap-2">
                <span className="text-xl font-bold text-[#00408B]">Fonction</span>
                <span className="text-xl font-black text-red-600 leading-none uppercase truncate">: {employee.role}</span>
              </div>
              
              <div className="grid grid-cols-[110px_1fr] items-baseline gap-2">
                <span className="text-xl font-bold text-[#00408B]">Domicile</span>
                <span className="text-xl font-black text-[#00408B] leading-none capitalize truncate">: {employee.adresse || employee.gare_id || 'Abidjan'}</span>
              </div>
              
              <div className="grid grid-cols-[110px_1fr] items-baseline gap-2">
                <span className="text-xl font-bold text-[#00408B]">Contacte</span>
                <span className="text-xl font-black text-[#00408B] leading-none truncate">: {employee.phone || '00 00 00 00 00'}</span>
              </div>

              <div className="grid grid-cols-[110px_1fr] items-baseline gap-2">
                <span className="text-xl font-bold text-[#00408B]">Email</span>
                <span className="text-[13px] font-black text-[#00408B] leading-none truncate">: {employee.email || 'N/A'}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Matricule</span>
                  <span className="text-sm font-mono font-black text-[#00408B]">{employee.matricule}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Embauche</span>
                  <span className="text-sm font-black text-slate-600">{new Date(employee.date_embauche).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#E31E24] py-3 w-full shrink-0 mt-auto">
              <h3 className="text-center text-white text-2xl font-black tracking-[0.05em] uppercase">
                CARTE PROFESSIONNELLE
              </h3>
            </div>
          </div>
        </ScrollArea>

        <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-full shadow-lg bg-white/80 backdrop-blur-sm text-[#00408B] hover:bg-white h-9 w-9"
            onClick={() => onOpenChange(false)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
