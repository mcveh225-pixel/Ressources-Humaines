import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp,
  TrendingDown,
  Building2,
  ArrowLeft,
  Calendar,
  Clock,
  Filter,
  Download,
  Ticket,
  Package,
  Truck,
  Receipt,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
  Loader2,
  LayoutDashboard,
  Coins,
  Bus,
  Package2,
  UserCheck,
  Fuel,
  Wrench,
  FileText,
  BarChart3,
  Banknote,
  Bell,
  Users2,
  Archive,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { GARES } from '@/constants';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// --- Types ---
interface ServiceBilan {
  daily: number;
  weekly: number;
  monthly: number;
}

interface GareFinance {
  id: string;
  name: string;
  services: {
    guichet: ServiceBilan;
    courrier: ServiceBilan;
    bagage: ServiceBilan;
  };
}

interface Gare {
  id: string;
  name: string;
  location: string;
}

// --- Mock Data ---
const MOCK_DEPENSES = [
  { id: '1', date: '08/07/2026', category: 'Carburant', description: 'Plein Gazoil DBS-004', amount: 45000, status: 'Validé' },
  { id: '2', date: '08/07/2026', category: 'Maintenance', description: 'Réparation pneu bus Adjamé', amount: 15000, status: 'Validé' },
  { id: '3', date: '07/07/2026', category: 'Logistique', description: 'Papier rame guichets Yopougon', amount: 25000, status: 'En attente' },
  { id: '4', date: '07/07/2026', category: 'Divers', description: 'Achat ampoules gare Man', amount: 8500, status: 'Validé' },
  { id: '5', date: '06/07/2026', category: 'Salaire', description: 'Avance sur salaire Chauffeur B.', amount: 50000, status: 'Validé' },
];

const menuConfig = [
  {
    id: 'dashboard',
    label: 'Tableau de Bord',
    icon: <LayoutDashboard className="h-4 w-4" />,
    subItems: [
      { id: 'vue-generale', label: 'Vue générale' },
      { id: 'resume-recettes-depenses', label: 'Résumé des recettes et dépenses' },
      { id: 'alertes-financieres', label: 'Alertes financières' },
      { id: 'activites-recentes', label: 'Activités récentes' },
    ]
  },
  {
    id: 'finances',
    label: 'Finances',
    icon: <Coins className="h-4 w-4" />,
    subItems: [
      { id: 'recettes-journalieres', label: 'Recettes journalières' },
      { id: 'depenses', label: 'Dépenses' },
      { id: 'tresorerie', label: 'Trésorerie' },
      { id: 'caisse-principale', label: 'Caisse principale' },
      { id: 'etat-comptes', label: 'État des comptes' },
    ]
  },
  {
    id: 'recettes-gares',
    label: 'Recettes des Gares',
    icon: <Bus className="h-4 w-4" />,
    subItems: [
      { id: 'saisie-recettes', label: 'Saisie des recettes par gare' },
      { id: 'validation-versements', label: 'Validation des versements' },
      { id: 'historique-recettes', label: 'Historique des recettes' },
      { id: 'comparaison-gares', label: 'Comparaison des performances des gares' },
    ]
  },
  {
    id: 'colis',
    label: 'Gestion des Colis',
    icon: <Package2 className="h-4 w-4" />,
    subItems: [
      { id: 'revenus-expeditions', label: 'Revenus des expéditions' },
      { id: 'paiements-clients', label: 'Paiements des clients' },
      { id: 'colis-impayes', label: 'Colis impayés' },
      { id: 'rapport-expeditions', label: 'Rapport des expéditions' },
    ]
  },
  {
    id: 'salaires',
    label: 'Salaires du Personnel',
    icon: <UserCheck className="h-4 w-4" />,
    subItems: [
      { id: 'gestion-salaires', label: 'Gestion des salaires' },
      { id: 'primes-bonus', label: 'Primes et bonus' },
      { id: 'avances-salaire', label: 'Avances sur salaire' },
      { id: 'historique-paiements', label: 'Historique des paiements' },
    ]
  },
  {
    id: 'carburant',
    label: 'Dépenses Carburant',
    icon: <Fuel className="h-4 w-4" />,
    subItems: [
      { id: 'achat-carburant', label: 'Achat carburant' },
      { id: 'consommation-vehicule', label: 'Consommation par véhicule' },
      { id: 'historique-carburant', label: 'Historique des dépenses' },
      { id: 'analyse-couts', label: 'Analyse des coûts' },
    ]
  },
  {
    id: 'maintenance',
    label: 'Maintenance des Véhicules',
    icon: <Wrench className="h-4 w-4" />,
    subItems: [
      { id: 'depenses-reparation', label: 'Dépenses de réparation' },
      { id: 'factures-maintenance', label: 'Factures de maintenance' },
      { id: 'suivi-pieces', label: 'Suivi des pièces changées' },
      { id: 'cout-vehicule', label: 'Coût par véhicule' },
    ]
  },
  {
    id: 'factures',
    label: 'Factures & Paiements',
    icon: <FileText className="h-4 w-4" />,
    subItems: [
      { id: 'emettre-facture', label: 'Émettre une facture' },
      { id: 'factures-clients', label: 'Factures clients' },
      { id: 'factures-fournisseurs', label: 'Factures fournisseurs' },
      { id: 'paiements-recus', label: 'Paiements reçus' },
      { id: 'paiements-attente', label: 'Paiements en attente' },
    ]
  },
  {
    id: 'rapports',
    label: 'Rapports Financiers',
    icon: <BarChart3 className="h-4 w-4" />,
    subItems: [
      { id: 'rapport-journalier', label: 'Rapport journalier' },
      { id: 'rapport-mensuel', label: 'Rapport mensuel' },
      { id: 'rapport-annuel', label: 'Rapport annuel' },
      { id: 'bilan-financier', label: 'Bilan financier' },
      { id: 'export-data', label: 'Export PDF / Excel' },
    ]
  },
  {
    id: 'banque',
    label: 'Banque & Transactions',
    icon: <Banknote className="h-4 w-4" />,
    subItems: [
      { id: 'depots-bancaires', label: 'Dépôts bancaires' },
      { id: 'retraits-bancaires', label: 'Retraits' },
      { id: 'historique-bancaire', label: 'Historique bancaire' },
      { id: 'rapprochement-bancaire', label: 'Rapprochement bancaire' },
    ]
  },
  {
    id: 'alertes',
    label: 'Alertes & Notifications',
    icon: <Bell className="h-4 w-4" />,
    subItems: [
      { id: 'paiements-retard', label: 'Paiements en retard' },
      { id: 'depenses-inhabituelles', label: 'Dépenses inhabituelles' },
      { id: 'solde-faible', label: 'Solde faible' },
      { id: 'alertes-validation', label: 'Alertes de validation' },
    ]
  },
  {
    id: 'fournisseurs',
    label: 'Gestion des Fournisseurs',
    icon: <Users2 className="h-4 w-4" />,
    subItems: [
      { id: 'liste-fournisseurs', label: 'Liste des fournisseurs' },
      { id: 'paiements-fournisseurs', label: 'Paiements fournisseurs' },
      { id: 'historique-achats', label: 'Historique des achats' },
    ]
  },
  {
    id: 'archives',
    label: 'Archives',
    icon: <Archive className="h-4 w-4" />,
    subItems: [
      { id: 'docs-comptables', label: 'Documents comptables' },
      { id: 'recus-archives', label: 'Reçus' },
      { id: 'contrats', label: 'Contrats' },
      { id: 'anciennes-op', label: 'Anciennes opérations' },
    ]
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: <Settings className="h-4 w-4" />,
    subItems: [
      { id: 'profil', label: 'Profil comptable' },
      { id: 'securite', label: 'Sécurité' },
      { id: 'methodes-paiement', label: 'Méthodes de paiement' },
      { id: 'devise', label: 'Devise' },
      { id: 'impression', label: 'Impression des reçus' },
    ]
  }
];

interface ServiceBilanCardProps {
  title: string;
  icon: React.ReactNode;
  daily: number;
  weekly: number;
  monthly: number;
  color: 'emerald' | 'blue' | 'amber';
}

const RecentRecettesList = ({ refreshRecent, formatFCFA }: { refreshRecent: number, formatFCFA: (n: number) => string }) => {
  const [recentRecettes, setRecentRecettes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('recettes')
          .select(`
            *,
            gares(name)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setRecentRecettes(data || []);
      } catch (error) {
        console.error('Error fetching recent recettes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecent();
  }, [refreshRecent]);

  if (isLoading) return <div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-emerald-600" /></div>;
  if (recentRecettes.length === 0) return <div className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Aucune recette enregistrée</div>;

  return (
    <div className="divide-y divide-slate-50">
      {recentRecettes.map((recette) => (
        <div key={recette.id} className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-all group relative overflow-hidden">
          <div className="flex items-center gap-5">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <ArrowUpRight className="h-6 w-6" />
            </div>
            <div>
              <p className="font-black text-slate-900 capitalize">{recette.service} - {recette.gares?.name || recette.gare_id}</p>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant="outline" className="bg-emerald-50/50 text-emerald-600 border-none px-2 h-4 text-[8px] font-black tracking-widest">{recette.type}</Badge>
                <span className="text-[10px] text-slate-300">•</span>
                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">{new Date(recette.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-emerald-600">+{formatFCFA(recette.amount)}</p>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-none px-2 h-5 text-[9px] font-black tracking-widest flex items-center gap-1 mt-1 ml-auto">
              <CheckCircle2 className="h-2.5 w-2.5" /> {recette.validation_status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export function FinanceDashboard() {
  const [searchParams] = useSearchParams();
  const sub = searchParams.get('sub') || 'vue-generale';
  
  // Detemine activeSection based on sub-item
  const getActiveSection = (subId: string) => {
    for (const section of menuConfig) {
      if (section.subItems.some(s => s.id === subId)) return section.id;
    }
    return 'dashboard';
  };

  const activeSection = getActiveSection(sub);
  const activeSubSection = sub;
  
  const [selectedGare, setSelectedGare] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [gares] = useState<Gare[]>(GARES);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLoadingGares = false;

  // Form State for Recette
  const [newRecette, setNewRecette] = useState({
    gare_id: '',
    service: 'Guichet',
    amount: '',
    type: 'journalier',
    date: new Date().toISOString().split('T')[0]
  });

  const [isRegisteringDepense, setIsRegisteringDepense] = useState(false);
  const [depenses, setDepenses] = useState<any[]>([]);
  const [isLoadingDepenses, setIsLoadingDepenses] = useState(true);
  const [refreshRecent, setRefreshRecent] = useState(0);
  const [globalStats, setGlobalStats] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    monthlyExpenses: 0,
    pendingDepenses: 0
  });

  // Form State for Depense
  const [newDepense, setNewDepense] = useState({
    description: '',
    category: 'Carburant',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    gare_id: ''
  });

  const [expandedMenus, setExpandedMenus] = useState<string[]>(['dashboard', 'finances']);

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchDepenses();
    fetchGlobalStats();
  }, [refreshRecent]);

  const fetchGlobalStats = async () => {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
      
      const day = now.getDay() || 7;
      const startOfWeekDate = new Date(now);
      startOfWeekDate.setDate(now.getDate() - day + 1);
      const startOfWeek = startOfWeekDate.toISOString().split('T')[0];

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

      // Fetch receipts (recettes)
      const { data: receipts } = await supabase
        .from('recettes')
        .select('amount, date')
        .eq('validation_status', 'Validé')
        .gte('date', startOfMonth);

      // Fetch expenses (depenses) for stats
      const { data: expenses } = await supabase
        .from('depenses')
        .select('amount, date')
        .eq('status', 'Validé')
        .gte('date', startOfMonth);

      // Fetch ALL pending expenses for the counter
      const { count: pendingCount } = await supabase
        .from('depenses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'En attente');

      const sum = (arr: any[] | null, since: string) => 
        arr?.filter(item => item.date >= since).reduce((acc, curr) => acc + curr.amount, 0) || 0;

      setGlobalStats({
        daily: sum(receipts, startOfDay) - sum(expenses, startOfDay),
        weekly: sum(receipts, startOfWeek) - sum(expenses, startOfWeek),
        monthly: sum(receipts, startOfMonth) - sum(expenses, startOfMonth),
        monthlyExpenses: sum(expenses, startOfMonth),
        pendingDepenses: pendingCount || 0
      });
    } catch (error) {
      console.error('Error fetching global stats:', error);
    }
  };

  const fetchDepenses = async () => {
    setIsLoadingDepenses(true);
    try {
      const { data, error } = await supabase
        .from('depenses')
        .select(`
          *,
          gares(name)
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      setDepenses(data || []);
    } catch (error) {
      console.error('Error fetching depenses:', error);
      // Fallback if table doesn't exist yet in first run
    } finally {
      setIsLoadingDepenses(false);
    }
  };

  const handleAddDepense = async () => {
    if (!newDepense.description || !newDepense.amount || !newDepense.category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('depenses').insert([{
        description: newDepense.description,
        category: newDepense.category,
        amount: parseFloat(newDepense.amount),
        date: newDepense.date,
        gare_id: newDepense.gare_id || null,
        status: 'En attente'
      }]);

      if (error) throw error;

      toast.success('Dépense enregistrée avec succès');
      setIsRegisteringDepense(false);
      fetchDepenses();
      fetchGlobalStats();
      setNewDepense({
        description: '',
        category: 'Carburant',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        gare_id: ''
      });
    } catch (error) {
      console.error('Error adding depense:', error);
      toast.error('Erreur lors de l\'enregistrement de la dépense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddRecette = async () => {
    if (!newRecette.gare_id || !newRecette.amount || !newRecette.service) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('recettes').insert([{
        gare_id: newRecette.gare_id,
        service: newRecette.service,
        amount: parseFloat(newRecette.amount),
        type: newRecette.type,
        date: newRecette.date,
        validation_status: 'Validé'
      }]);

      if (error) throw error;

      toast.success('Recette enregistrée avec succès');
      setIsRegistering(false);
      setRefreshRecent(prev => prev + 1);
      setNewRecette({
        gare_id: '',
        service: 'Guichet',
        amount: '',
        type: 'journalier',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error adding recette:', error);
      toast.error('Erreur lors de l\'enregistrement de la recette');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [selectedGareData, setSelectedGareData] = useState<ServiceBilanCardProps[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    if (selectedGare) {
      const gareId = gares.find(g => g.name === selectedGare)?.id;
      if (gareId) fetchGareStats(gareId);
    }
  }, [selectedGare, refreshRecent]);

  const fetchGareStats = async (gareId: string) => {
    setIsLoadingStats(true);
    try {
      const { data, error } = await supabase
        .from('recettes')
        .select('*')
        .eq('gare_id', gareId)
        .eq('validation_status', 'Validé');

      if (error) throw error;

      // Logic to aggregate data by service and period (daily, weekly, monthly)
      // For this prototype, we'll keep it simple or use dummy aggregation
      const services = ['Guichet', 'Courrier', 'Bagage'];
      const stats = services.map(service => {
        const serviceRecettes = data.filter(r => r.service === service);
        return {
          title: `Service ${service}`,
          icon: service === 'Guichet' ? <Ticket className="h-6 w-6" /> : service === 'Courrier' ? <Truck className="h-6 w-6" /> : <Package className="h-6 w-6" />,
          daily: serviceRecettes.filter(r => r.type === 'journalier').reduce((acc, curr) => acc + curr.amount, 0),
          weekly: serviceRecettes.filter(r => r.type === 'hebdomadaire').reduce((acc, curr) => acc + curr.amount, 0),
          monthly: serviceRecettes.filter(r => r.type === 'mensuel').reduce((acc, curr) => acc + curr.amount, 0),
          color: service === 'Guichet' ? 'emerald' : service === 'Courrier' ? 'blue' : 'amber' as any
        };
      });
      setSelectedGareData(stats);
    } catch (error) {
      console.error('Error fetching gare stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const formatFCFA = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const filteredGares = gares.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <main className="flex-1 overflow-y-auto pb-24 custom-scrollbar relative">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header de Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black uppercase text-primary bg-primary/5 px-3 py-1 rounded-full tracking-[0.2em]">
                  {menuConfig.find(m => m.id === activeSection)?.label || 'Dashboard'}
                </span>
                <ChevronRight className="h-3 w-3 text-slate-300" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">
                  {menuConfig.find(m => m.id === activeSection)?.subItems.find(s => s.id === activeSubSection)?.label || 'Vue'}
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-slate-900 flex items-center gap-4 uppercase">
                {activeSubSection === 'vue-generale' ? 'TABLEAU DE BORD' : activeSubSection.replace(/-/g, ' ')}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="rounded-2xl border-slate-200 bg-white text-slate-600 font-black px-6 h-12 text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                <Filter className="h-4 w-4 mr-2" /> Filtres
              </Button>
              <Button className="rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black px-6 h-12 text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 transition-all">
                <Download className="h-4 w-4 mr-2" /> Exporter
              </Button>
            </div>
          </div>

          {/* Rendu Conditionnel du Contenu */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeSection}-${activeSubSection}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === 'dashboard' && activeSubSection === 'vue-generale' && (
                <div className="space-y-10">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                      title="Bilan Journalier" 
                      amount={globalStats.daily} 
                      trend="+12%" 
                      icon={<TrendingUp className="h-5 w-5" />} 
                      color="emerald"
                      subtitle="Cumul toutes gares"
                    />
                    <StatCard 
                      title="Bilan Hebdomadaire" 
                      amount={globalStats.weekly} 
                      trend="+5%" 
                      icon={<Calendar className="h-5 w-5" />} 
                      color="blue"
                      subtitle="Semaine en cours"
                    />
                    <StatCard 
                      title="Bilan Mensuel" 
                      amount={globalStats.monthly} 
                      trend="+18%" 
                      icon={<TrendingUp className="h-5 w-5" />} 
                      color="indigo"
                      subtitle={`${new Date().toLocaleString('fr-FR', { month: 'long' })} ${new Date().getFullYear()}`}
                    />
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Recent Receipts List */}
                    <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white border-l-4 border-emerald-500 h-fit">
                      <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-xl font-black flex items-center gap-3 text-emerald-900">
                          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Receipt className="h-5 w-5" />
                          </div>
                          RECETTES RÉCENTES
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <RecentRecettesList refreshRecent={refreshRecent} formatFCFA={formatFCFA} />
                      </CardContent>
                    </Card>

                    {/* Recent Expenses List */}
                    <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white border-l-4 border-rose-500 h-fit">
                      <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-xl font-black flex items-center gap-3 text-rose-900">
                          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                            <ArrowDownRight className="h-5 w-5" />
                          </div>
                          DÉPENSES RÉCENTES
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                          {depenses.slice(0, 5).map((depense) => (
                            <div key={depense.id} className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-all group">
                              <div className="flex items-center gap-5">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center font-black group-hover:bg-rose-50 group-hover:text-rose-600">
                                  <ArrowDownRight className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-black text-slate-900 group-hover:text-rose-600 transition-colors text-sm">{depense.description}</p>
                                  <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mt-1">{depense.category} • {new Date(depense.date).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <p className="text-sm font-black text-slate-900">-{formatFCFA(depense.amount)}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Placeholder for other sections */}
              {(activeSection !== 'dashboard' || activeSubSection !== 'vue-generale') && (
                <div className="bg-white rounded-[3rem] p-20 text-center space-y-6 shadow-sm border-2 border-slate-50 border-dashed">
                  <div className="h-24 w-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mx-auto">
                    {menuConfig.find(m => m.id === activeSection)?.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Section en cours de déploiement</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                       L'interface pour {menuConfig.find(m => m.id === activeSection)?.subItems.find(s => s.id === activeSubSection)?.label || 'cette section'} sera disponible sous peu.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-10 right-10 flex gap-4 z-50">
        <Dialog open={isRegistering} onOpenChange={setIsRegistering}>
          <DialogTrigger asChild>
            <Button className="h-16 w-16 rounded-[2rem] bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl shadow-emerald-200 p-0 flex items-center justify-center">
              <TrendingUp className="h-8 w-8" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-emerald-600 p-8 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black flex items-center gap-3">
                  <Receipt className="h-6 w-6" />
                  NOUVELLE RECETTE
                </DialogTitle>
                <CardDescription className="font-bold text-[10px] uppercase tracking-widest text-emerald-100 opacity-80 mt-2">
                  Enregistrement d'une entrée de caisse
                </CardDescription>
              </DialogHeader>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="gare" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gare concernée</Label>
                <Select 
                  value={newRecette.gare_id} 
                  onValueChange={(val) => setNewRecette({...newRecette, gare_id: val})}
                >
                  <SelectTrigger className="rounded-xl h-12 border-slate-100 bg-slate-50 font-bold focus:ring-emerald-500">
                    <SelectValue placeholder="Choisir une gare..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl font-bold">
                    {gares.map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="service" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Service</Label>
                  <Select 
                    value={newRecette.service} 
                    onValueChange={(val) => setNewRecette({...newRecette, service: val})}
                  >
                    <SelectTrigger className="rounded-xl h-12 border-slate-100 bg-slate-50 font-bold">
                      <SelectValue placeholder="Service" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl font-bold">
                      <SelectItem value="Guichet">Guichet</SelectItem>
                      <SelectItem value="Courrier">Courrier</SelectItem>
                      <SelectItem value="Bagage">Bagage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Montant (FCFA)</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="0"
                    value={newRecette.amount}
                    onChange={(e) => setNewRecette({...newRecette, amount: e.target.value})}
                    className="rounded-xl h-12 border-slate-100 bg-slate-50 font-black text-lg"
                  />
                </div>
              </div>
              <Button 
                onClick={handleAddRecette} 
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-100 mt-4"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
                Valider l'enregistrement
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isRegisteringDepense} onOpenChange={setIsRegisteringDepense}>
          <DialogTrigger asChild>
            <Button className="h-16 w-16 rounded-[2rem] bg-rose-600 hover:bg-rose-700 text-white shadow-2xl shadow-rose-200 p-0 flex items-center justify-center">
              <TrendingDown className="h-8 w-8" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-rose-600 p-8 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-black flex items-center gap-3">
                  <ArrowDownRight className="h-6 w-6" />
                  NOUVELLE DÉPENSE
                </DialogTitle>
                <CardDescription className="font-bold text-[10px] uppercase tracking-widest text-rose-100 opacity-80 mt-2">
                  Précisez la nature et le montant
                </CardDescription>
              </DialogHeader>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description / Nature</Label>
                <Input 
                  id="description" 
                  placeholder="Nature de la dépense..."
                  value={newDepense.description}
                  onChange={(e) => setNewDepense({...newDepense, description: e.target.value})}
                  className="rounded-xl h-12 border-slate-100 bg-slate-50 font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Catégorie</Label>
                  <Select 
                    value={newDepense.category} 
                    onValueChange={(val) => setNewDepense({...newDepense, category: val})}
                  >
                    <SelectTrigger className="rounded-xl h-12 border-slate-100 bg-slate-50 font-bold text-xs">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl font-bold">
                      <SelectItem value="Carburant">Carburant</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Logistique">Logistique</SelectItem>
                      <SelectItem value="Salaire">Salaire</SelectItem>
                      <SelectItem value="Loyer">Loyer</SelectItem>
                      <SelectItem value="Divers">Divers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="depense-amount" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Montant (FCFA)</Label>
                  <Input 
                    id="depense-amount" 
                    type="number" 
                    placeholder="0"
                    value={newDepense.amount}
                    onChange={(e) => setNewDepense({...newDepense, amount: e.target.value})}
                    className="rounded-xl h-12 border-slate-100 bg-slate-50 font-black text-lg"
                  />
                </div>
              </div>
              <Button 
                onClick={handleAddDepense} 
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-rose-600 hover:bg-rose-700 h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-100 mt-4"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
                Enregistrer la dépense
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function StatCard({ title, amount, trend, icon, color, subtitle }: { 
  title: string, 
  amount: number, 
  trend: string, 
  icon: React.ReactNode,
  color: 'emerald' | 'blue' | 'indigo',
  subtitle: string
}) {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-500/10 hover:bg-emerald-600 hover:text-white',
    blue: 'bg-blue-50 text-blue-600 ring-blue-500/10 hover:bg-blue-600 hover:text-white',
    indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-500/10 hover:bg-indigo-600 hover:text-white'
  };

  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-8 bg-white group hover:scale-[1.02] transition-all border border-transparent hover:border-slate-100">
      <div className="flex justify-between items-start mb-8">
        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center ring-1 ring-inset transition-colors", colorClasses[color])}>
          {icon}
        </div>
        <Badge className={cn("border-none h-6 px-2 rounded-lg text-[10px] font-black tracking-widest uppercase", 
          color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'
        )}>
          {trend}
        </Badge>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{title}</p>
        <p className="text-3xl font-black text-slate-900 mt-2 tracking-tighter truncate">
          {amount.toLocaleString('fr-FR')} <span className="text-xs text-slate-300">FCFA</span>
        </p>
        <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 tracking-widest flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-200" /> {subtitle}
        </p>
      </div>
    </Card>
  );
}

function ServiceBilanCard({ title, icon, daily, weekly, monthly, color }: { 
  title: string, 
  icon: React.ReactNode,
  daily: number,
  weekly: number,
  monthly: number,
  color: 'emerald' | 'blue' | 'amber'
}) {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    blue: 'bg-blue-50 text-blue-600 ring-blue-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100'
  };

  const formatM = (val: number) => new Intl.NumberFormat('fr-FR').format(val) + ' F';

  return (
    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-10 bg-white group border border-transparent hover:border-slate-100 transition-all overflow-hidden relative">
      <div className={cn("absolute -top-12 -right-12 h-40 w-40 rounded-full opacity-5 transition-transform group-hover:scale-150", 
        color === 'emerald' ? 'bg-emerald-500' : color === 'blue' ? 'bg-blue-500' : 'bg-amber-500'
      )} />
      
      <div className="flex items-center gap-5 mb-10">
        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center ring-1", colorClasses[color])}>
          {icon}
        </div>
        <h3 className="font-black text-xl text-slate-900 uppercase tracking-tighter">{title}</h3>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Journalier</p>
          <p className="text-xl font-black text-slate-900">{formatM(daily)}</p>
        </div>
        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hebdo</p>
          <p className="text-xl font-black text-slate-900">{formatM(weekly)}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mensuel</p>
          <p className="text-xl font-black text-slate-900">{formatM(monthly)}</p>
        </div>
      </div>
      
      <Button className={cn("w-full mt-10 rounded-2xl font-black uppercase text-[10px] tracking-widest h-14 border-none transition-all hover:scale-[0.98]", 
        color === 'emerald' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 
        color === 'blue' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 
        'bg-amber-50 text-amber-700 hover:bg-amber-100'
      )}>
        Historique Décaissé
      </Button>
    </Card>
  );
}
