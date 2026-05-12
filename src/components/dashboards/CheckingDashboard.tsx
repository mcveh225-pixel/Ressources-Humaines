import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bus, 
  User, 
  Calendar, 
  MapPin, 
  ClipboardCheck, 
  Download, 
  Send,
  AlertTriangle,
  Info,
  History,
  Plus,
  Loader2,
  ChevronRight,
  Search,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

interface CheckItem {
  id: string;
  label: string;
  status: 'ok' | 'non' | null;
}

interface Section {
  title: string;
  items: CheckItem[];
}

interface CheckingRecord {
  id: string;
  chauffeur_name: string;
  check_date: string;
  departure_city: string;
  arrival_city: string;
  car_number: string;
  observations: string;
  sections: Section[];
  created_at: string;
}

export function CheckingDashboard() {
  const { user } = useAuth();
  const [isHistoryView, setIsHistoryView] = useState(false);
  const [history, setHistory] = useState<CheckingRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    chauffeur: user?.fullName || '',
    date: new Date().toISOString().split('T')[0],
    depart: '',
    arrivee: '',
    numeroCar: '',
    observations: ''
  });

  const [dateFilter, setDateFilter] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const initialSections: Section[] = [
    {
      title: "2. État extérieur du véhicule",
      items: [
        { id: 'ext-1', label: 'Carrosserie (bosses, rayures)', status: null },
        { id: 'ext-2', label: 'Pare-brise (propreté, fissures)', status: null },
        { id: 'ext-3', label: 'Rétroviseurs (état et réglage)', status: null },
        { id: 'ext-4', label: 'Plaques d\'immatriculation', status: null },
        { id: 'ext-5', label: 'Pneus (usure, pression visuelle)', status: null },
        { id: 'ext-6', label: 'Éclairage extérieur (phares, clignotants, feux stop)', status: null },
      ]
    },
    {
      title: "3. Compartiment moteur",
      items: [
        { id: 'mot-1', label: 'Niveau d\'huile moteur', status: null },
        { id: 'mot-2', label: 'Niveau liquide de refroidissement', status: null },
        { id: 'mot-3', label: 'Niveau liquide de frein', status: null },
        { id: 'mot-4', label: 'Batterie (fixation / état)', status: null },
        { id: 'mot-5', label: 'Fuites visibles (huile, eau)', status: null },
      ]
    },
    {
      title: "4. Intérieur du véhicule",
      items: [
        { id: 'int-1', label: 'Propreté générale', status: null },
        { id: 'int-2', label: 'Sièges passagers', status: null },
        { id: 'int-3', label: 'Tableau de bord', status: null },
        { id: 'int-4', label: 'Klaxon', status: null },
        { id: 'int-5', label: 'Essuie-glaces', status: null },
        { id: 'int-6', label: 'Climatisation / ventilation', status: null },
      ]
    },
    {
      title: "5. Équipements de sécurité",
      items: [
        { id: 'sec-1', label: 'Extincteur (présence + validité)', status: null },
        { id: 'sec-2', label: 'Triangle de signalisation', status: null },
        { id: 'sec-3', label: 'Trousse de secours', status: null },
        { id: 'sec-4', label: 'Ceintures de sécurité', status: null },
        { id: 'sec-5', label: 'Essuie-glaces', status: null },
        { id: 'sec-6', label: 'Marteaux brise-vitre', status: null },
      ]
    },
    {
      title: "6. Documents du véhicule",
      items: [
        { id: 'doc-1', label: 'Carte grise', status: null },
        { id: 'doc-2', label: 'Assurance', status: null },
        { id: 'doc-3', label: 'Visite technique', status: null },
        { id: 'doc-4', label: 'Autorisation de transport', status: null },
      ]
    },
    {
      title: "7. Vérification fonctionnelle",
      items: [
        { id: 'fun-1', label: 'Freinage', status: null },
        { id: 'fun-2', label: 'Direction', status: null },
        { id: 'fun-3', label: 'Boîte de vitesse', status: null },
        { id: 'fun-4', label: 'Tableau de bord (voyants)', status: null },
      ]
    }
  ];

  const [sections, setSections] = useState<Section[]>(initialSections);

  useEffect(() => {
    if (isHistoryView) {
      fetchHistory();
    }
  }, [isHistoryView]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      let query = supabase
        .from('vehicle_checkings')
        .select('*')
        .order('check_date', { ascending: false });

      if (dateFilter.from) query = query.gte('check_date', dateFilter.from);
      if (dateFilter.to) query = query.lte('check_date', dateFilter.to);

      const { data, error } = await query;

      if (error) throw error;
      setHistory(data || []);
    } catch (err: any) {
      toast.error("Erreur lors du chargement de l'historique: " + err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleStatusChange = (sectionIndex: number, itemIndex: number, status: 'ok' | 'non') => {
    const newSections = [...sections];
    newSections[sectionIndex].items[itemIndex].status = 
      newSections[sectionIndex].items[itemIndex].status === status ? null : status;
    setSections(newSections);
  };

  const handleSubmit = async () => {
    if (!formData.chauffeur || !formData.numeroCar) {
      toast.error("Veuillez remplir au moins le nom du chauffeur et le numéro du car.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('vehicle_checkings')
        .insert({
          chauffeur_name: formData.chauffeur,
          check_date: formData.date,
          departure_city: formData.depart,
          arrival_city: formData.arrivee,
          car_number: formData.numeroCar,
          observations: formData.observations,
          sections: sections,
          user_id: user?.id
        });

      if (error) throw error;

      toast.success("Fiche de checking enregistrée avec succès !");
      // Reset form
      setFormData({
        chauffeur: user?.fullName || '',
        date: new Date().toISOString().split('T')[0],
        depart: '',
        arrivee: '',
        numeroCar: '',
        observations: ''
      });
      setSections(initialSections);
    } catch (err: any) {
      toast.error("Erreur lors de l'enregistrement: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-8 animate-in fade-in duration-700">
      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1 rounded-2xl flex gap-1">
          <Button 
            onClick={() => setIsHistoryView(false)}
            variant={!isHistoryView ? "default" : "ghost"}
            className={cn(
              "rounded-xl px-8 h-12 font-black uppercase text-[10px] tracking-widest transition-all",
              !isHistoryView ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Plus className="h-4 w-4 mr-2" /> Nouveau Checking
          </Button>
          <Button 
            onClick={() => setIsHistoryView(true)}
            variant={isHistoryView ? "default" : "ghost"}
            className={cn(
              "rounded-xl px-8 h-12 font-black uppercase text-[10px] tracking-widest transition-all",
              isHistoryView ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <History className="h-4 w-4 mr-2" /> Historique
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isHistoryView ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Header Fiche */}
            <div className="flex flex-col items-center text-center space-y-4 mb-10">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                   <Bus className="h-10 w-10" />
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-blue-700 uppercase">DIOMANDE BAN SERVICE</h1>
              </div>
              <div className="bg-slate-900 text-white px-8 py-3 rounded-2xl">
                <h2 className="text-xl font-bold tracking-widest uppercase">FICHE TECHNIQUE DE CAR AVANT LE DÉPART</h2>
              </div>
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[3rem] overflow-hidden">
              <CardContent className="p-10 md:p-16 space-y-12">
                
                {/* 1. Informations Générales */}
                <section className="space-y-8">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Info className="h-4 w-4" /> 1. INFORMATIONS GÉNÉRALES
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nom du chauffeur</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                          value={formData.chauffeur}
                          onChange={(e) => setFormData({...formData, chauffeur: e.target.value})}
                          placeholder="Ex: Bamba Souleymane" 
                          className="pl-12 h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold text-slate-900" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="pl-12 h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold text-slate-900" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2 text-right">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-1">Numéro du Car</Label>
                      <div className="relative">
                        <Bus className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                          value={formData.numeroCar}
                          onChange={(e) => setFormData({...formData, numeroCar: e.target.value})}
                          placeholder="Ex: DBS-001" 
                          className="pl-12 h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold text-slate-900" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Départ</Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                          value={formData.depart}
                          onChange={(e) => setFormData({...formData, depart: e.target.value})}
                          placeholder="Ville de départ" 
                          className="pl-12 h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold text-slate-900" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Arrivée</Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                          value={formData.arrivee}
                          onChange={(e) => setFormData({...formData, arrivee: e.target.value})}
                          placeholder="Ville d'arrivée" 
                          className="pl-12 h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold text-slate-900" 
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Grid de Sections Techniques */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  {sections.map((section, sIdx) => (
                    <section key={sIdx} className="space-y-6">
                      <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">{section.title}</h3>
                        <div className="flex gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">
                          <span className="w-8 text-center text-emerald-500">OK</span>
                          <span className="w-8 text-center text-rose-500">NON</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {section.items.map((item, iIdx) => (
                          <div key={item.id} className="flex items-center justify-between group hover:bg-slate-50 p-2 rounded-xl transition-colors">
                            <span className="text-sm font-bold text-slate-600">{item.label}</span>
                            <div className="flex gap-4">
                              <button 
                                onClick={() => handleStatusChange(sIdx, iIdx, 'ok')}
                                className={cn(
                                  "h-8 w-8 rounded-lg border-2 flex items-center justify-center transition-all",
                                  item.status === 'ok' ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200" : "border-slate-200 hover:border-emerald-300 bg-white"
                                )}
                              >
                                {item.status === 'ok' && <Check className="h-5 w-5" />}
                              </button>
                              <button 
                                onClick={() => handleStatusChange(sIdx, iIdx, 'non')}
                                className={cn(
                                  "h-8 w-8 rounded-lg border-2 flex items-center justify-center transition-all",
                                  item.status === 'non' ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200" : "border-slate-200 hover:border-rose-300 bg-white"
                                )}
                              >
                                {item.status === 'non' && <AlertTriangle className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                {/* 8. Observations Générales */}
                <section className="space-y-6 pt-10 border-t-2 border-slate-50">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">8. OBSERVATIONS GÉNÉRALES</h3>
                  <textarea 
                    value={formData.observations}
                    onChange={(e) => setFormData({...formData, observations: e.target.value})}
                    className="w-full min-h-[160px] p-8 rounded-[2rem] bg-slate-50 border-none shadow-inner font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none placeholder:text-slate-300"
                    placeholder="Notez ici les anomalies, remarques ou détails particuliers constatés..."
                  />
                </section>

                {/* Conseils & Signatures */}
                <div className="pt-10 space-y-12">
                  <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100 flex flex-col md:flex-row gap-8 items-center">
                    <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                      <AlertTriangle className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest">Conseils d'utilisation</h4>
                      <ul className="text-xs font-bold text-blue-700/70 space-y-1 list-disc ml-4">
                        <li>Cette fiche doit être <span className="text-blue-900 font-black italic underline">remplie avant chaque départ</span>.</li>
                        <li>Toute anomalie doit être <span className="text-rose-600 font-black italic">signalée immédiatement</span>.</li>
                        <li>Un car avec défaut critique ne doit <span className="text-rose-600 font-black italic uppercase">pas quitter la gare</span>.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between gap-12 pt-10 px-4">
                     <div className="space-y-4 text-center md:text-left">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Signature Chauffeur</p>
                        <div className="h-24 w-64 border-b-2 border-slate-100 italic text-slate-300 font-bold flex items-center justify-center">
                          (Signez ici numeriquement)
                        </div>
                     </div>
                     <div className="space-y-4 text-center md:text-right">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Responsable / Chef de gare</p>
                        <div className="h-24 w-64 border-b-2 border-slate-100 italic text-slate-300 font-bold flex items-center justify-center ml-auto">
                          (Nom & Signature)
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-10">
                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100"
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-5 w-5" />
                      )}
                      Enregistrer & Envoyer la Fiche
                    </Button>
                    <Button 
                      variant="outline"
                      className="h-16 px-10 rounded-2xl border-2 border-slate-100 font-black uppercase tracking-widest text-xs hover:bg-slate-50"
                    >
                      <Download className="mr-2 h-5 w-5" /> Télécharger PDF
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* History Filters */}
            <Card className="border-none shadow-xl shadow-slate-100 rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Du</Label>
                    <Input 
                      type="date" 
                      value={dateFilter.from}
                      onChange={(e) => setDateFilter({...dateFilter, from: e.target.value})}
                      className="h-12 rounded-xl bg-slate-50 border-none font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Au</Label>
                    <Input 
                      type="date" 
                      value={dateFilter.to}
                      onChange={(e) => setDateFilter({...dateFilter, to: e.target.value})}
                      className="h-12 rounded-xl bg-slate-50 border-none font-bold" 
                    />
                  </div>
                  <Button 
                    onClick={fetchHistory}
                    disabled={loadingHistory}
                    className="h-12 rounded-xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest"
                  >
                    {loadingHistory ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                    Filtrer l'historique
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* History List */}
            <div className="space-y-4">
              {loadingHistory ? (
                <div className="flex flex-col items-center justify-center p-20 space-y-4 text-slate-400">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                  <p className="font-bold uppercase text-[10px] tracking-widest">Chargement de l'historique...</p>
                </div>
              ) : history.length > 0 ? (
                history.map((record) => (
                  <Card key={record.id} className="border-none shadow-lg shadow-slate-100 rounded-3xl overflow-hidden hover:shadow-xl transition-shadow group">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row md:items-center">
                        <div className="bg-blue-600 text-white p-6 flex flex-col items-center justify-center min-w-[120px]">
                          <span className="text-2xl font-black">{new Date(record.check_date).getDate()}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                            {new Date(record.check_date).toLocaleDateString('fr-FR', { month: 'short' })}
                          </span>
                        </div>
                        <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-1">
                            <Label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Chauffeur</Label>
                            <p className="font-black text-slate-900">{record.chauffeur_name}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Véhicule (Car)</Label>
                            <p className="font-black text-slate-900">{record.car_number}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Trajet</Label>
                            <p className="font-bold text-slate-600 text-sm">
                              {record.departure_city || '—'} <ChevronRight className="inline h-3 w-3 mx-1" /> {record.arrival_city || '—'}
                            </p>
                          </div>
                        </div>
                        <div className="p-6 flex gap-2 justify-end bg-slate-50 md:bg-transparent">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-full bg-slate-100 hover:bg-blue-100 hover:text-blue-600"
                            title="Voir les détails"
                          >
                            <ClipboardCheck className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-full bg-slate-100 hover:bg-emerald-100 hover:text-emerald-600"
                            title="Télécharger PDF"
                          >
                            <Download className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-20 space-y-4 text-slate-300 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                  <ClipboardCheck className="h-16 w-16 opacity-20" />
                  <p className="font-bold uppercase text-[10px] tracking-widest">Aucun checking trouvé pour cette période</p>
                  <Button 
                    variant="link" 
                    onClick={() => setIsHistoryView(false)}
                    className="text-blue-500 font-black uppercase text-[10px] tracking-widest"
                  >
                    Créer le premier checking
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
