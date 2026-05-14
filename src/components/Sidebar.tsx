import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  Wallet, 
  Wrench, 
  UserPlus, 
  BarChart3, 
  LayoutDashboard, 
  Bus, 
  LogOut, 
  Clock, 
  MapPin, 
  Settings,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Coins,
  Package2,
  UserCheck,
  Fuel,
  FileText,
  Banknote,
  Bell,
  Users2,
  Archive,
  MessageSquare,
  User
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles?: UserRole[];
  section?: string;
  subItems?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    title: 'Tableau de Bord',
    href: '/',
    icon: LayoutDashboard,
    roles: [UserRole.PDG, UserRole.DG, UserRole.DRH, UserRole.CHEF_DE_GARE, UserRole.CHEF_DE_GARE_ADJOINT, UserRole.POMPISTE],
  },
  {
    title: 'Tableau de Bord',
    href: '/finances',
    icon: LayoutDashboard,
    roles: [UserRole.COMPTABLE, UserRole.DAF],
    subItems: [
      { title: 'Vue générale', href: '/finances?sub=vue-generale' },
      { title: 'Résumé des recettes et dépenses', href: '/finances?sub=resume-recettes-depenses' },
      { title: 'Alertes financières', href: '/finances?sub=alertes-financieres' },
      { title: 'Activités récentes', href: '/finances?sub=activites-recentes' },
    ]
  },
  // --- COMPTABLE / DAF Specific ---
  {
    title: 'Finances',
    href: '/finances',
    icon: Coins,
    roles: [UserRole.COMPTABLE, UserRole.DAF],
    section: 'MENU COMPTABILITE',
    subItems: [
      { title: 'Recettes journalières', href: '/finances?sub=recettes-journalieres' },
      { title: 'Dépenses', href: '/finances?sub=depenses' },
      { title: 'Trésorerie', href: '/finances?sub=tresorerie' },
      { title: 'Caisse principale', href: '/finances?sub=caisse-principale' },
    ]
  },
  {
    title: 'Recettes des Gares',
    href: '/finances',
    icon: Bus,
    roles: [UserRole.COMPTABLE, UserRole.DAF],
    section: 'MENU COMPTABILITE',
    subItems: [
      { title: 'Saisie des recettes', href: '/finances?sub=saisie-recettes' },
      { title: 'Validation versements', href: '/finances?sub=validation-versements' },
    ]
  },
  {
    title: 'Gestion des Colis',
    href: '/finances',
    icon: Package2,
    roles: [UserRole.COMPTABLE, UserRole.DAF],
    section: 'MENU COMPTABILITE',
    subItems: [
      { title: 'Revenus expéditions', href: '/finances?sub=revenus-expeditions' },
      { title: 'Paiements clients', href: '/finances?sub=paiements-clients' },
    ]
  },
  {
    title: 'Salaires du Personnel',
    href: '/finances',
    icon: UserCheck,
    roles: [UserRole.COMPTABLE, UserRole.DAF],
    section: 'MENU COMPTABILITE',
    subItems: [
      { title: 'Gestion des salaires', href: '/finances?sub=gestion-salaires' },
      { title: 'Avances sur salaire', href: '/finances?sub=avances-salaire' },
    ]
  },
  {
    title: 'Dépenses & Maintenance',
    href: '/finances',
    icon: Fuel,
    roles: [UserRole.COMPTABLE, UserRole.DAF],
    section: 'MENU COMPTABILITE',
    subItems: [
      { title: 'Achat carburant', href: '/finances?sub=achat-carburant' },
      { title: 'Maintenance véhicules', href: '/finances?sub=maintenance' },
    ]
  },
  {
    title: 'Rapports & Archives',
    href: '/finances',
    icon: FileText,
    roles: [UserRole.COMPTABLE, UserRole.DAF],
    section: 'MENU COMPTABILITE',
    subItems: [
      { title: 'Rapport mensuel', href: '/finances?sub=rapport-mensuel' },
      { title: 'Bilan financier', href: '/finances?sub=bilan-financier' },
      { title: 'Archives docs', href: '/finances?sub=archives' },
    ]
  },
  
  // --- DRH Specific / Grouped ---
  {
    title: 'Le Personnel',
    href: '/personnel',
    icon: Users,
    roles: [UserRole.DRH],
    section: 'GESTION DU PERSONNEL'
  },
  {
    title: 'Absences / Retard',
    href: '/absences',
    icon: Clock,
    roles: [UserRole.DRH],
    section: 'GESTION DU PERSONNEL'
  },
  {
    title: 'Les Gares',
    href: '/services/gares',
    icon: MapPin,
    roles: [UserRole.DRH],
    section: 'LES SERVICES'
  },
  {
    title: 'Service Technique',
    href: '/services/technique',
    icon: Wrench,
    roles: [UserRole.DRH],
    section: 'LES SERVICES'
  },
  {
    title: 'Administration',
    href: '/services/administration',
    icon: UserPlus,
    roles: [UserRole.DRH],
    section: 'LES SERVICES'
  },
  
  // --- Other Roles / General ---
  {
    title: 'Gestion Personnel',
    href: '/personnel',
    icon: Users,
    roles: [UserRole.PDG, UserRole.DG],
  },
  {
    title: 'Finances',
    href: '/finances',
    icon: Wallet,
    roles: [UserRole.PDG, UserRole.DG],
  },
  {
    title: 'Service Technique',
    href: '/technique',
    icon: Wrench,
    roles: [UserRole.PDG, UserRole.DG],
  },
  {
    title: 'Tableau de Bord',
    href: '/technique',
    icon: LayoutDashboard,
    roles: [UserRole.SERVICE_TECHNIQUE],
    subItems: [
      { title: 'Vue globale du parc', href: '/technique?sub=vue-globale' },
      { title: 'Véhicules en panne', href: '/technique?sub=vehicules-panne' },
      { title: 'Interventions en cours', href: '/technique?sub=interventions-cours' },
      { title: 'Alertes techniques', href: '/technique?sub=alertes-techniques' },
    ]
  },
  {
    title: 'Gestion des Véhicules',
    href: '/technique',
    icon: Bus,
    roles: [UserRole.SERVICE_TECHNIQUE],
    section: 'SERVICE TECHNIQUE',
    subItems: [
      { title: 'Liste des véhicules', href: '/technique?sub=liste-vehicules' },
      { title: 'Kilométrage & Suivi', href: '/technique?sub=kilometrage' },
      { title: 'Affectation chauffeurs', href: '/technique?sub=affectation-chauffeurs' },
      { title: 'Documents du véhicule', href: '/technique?sub=documents-vehicule' },
    ]
  },
  {
    title: 'Maintenance',
    href: '/technique',
    icon: Wrench,
    roles: [UserRole.SERVICE_TECHNIQUE],
    section: 'SERVICE TECHNIQUE',
    subItems: [
      { title: 'Maintenance préventive', href: '/technique?sub=maintenance-preventive' },
      { title: 'Maintenance corrective', href: '/technique?sub=maintenance-corrective' },
      { title: 'Calendrier d’entretien', href: '/technique?sub=calendrier-entretien' },
      { title: 'Contrôles techniques', href: '/technique?sub=controles-techniques' },
    ]
  },
  {
    title: 'Gestion des Pannes',
    href: '/technique',
    icon: AlertTriangle,
    roles: [UserRole.SERVICE_TECHNIQUE],
    section: 'SERVICE TECHNIQUE',
    subItems: [
      { title: 'Déclaration de panne', href: '/technique?sub=declaration-panne' },
      { title: 'Suivi des réparations', href: '/technique?sub=suivi-reparations' },
      { title: 'Véhicules immobilisés', href: '/technique?sub=vehicules-immobilises' },
    ]
  },
  {
    title: 'Techniciens',
    href: '/technique',
    icon: Users2,
    roles: [UserRole.SERVICE_TECHNIQUE],
    section: 'SERVICE TECHNIQUE',
    subItems: [
      { title: 'Liste des techniciens', href: '/technique?sub=liste-techniciens' },
      { title: 'Planning des équipes', href: '/technique?sub=planning-techniciens' },
    ]
  },
  {
    title: 'Interventions',
    href: '/technique',
    icon: CheckCircle2,
    roles: [UserRole.SERVICE_TECHNIQUE],
    section: 'SERVICE TECHNIQUE',
    subItems: [
      { title: 'Interventions en attente', href: '/technique?sub=interventions-attente' },
      { title: 'Interventions terminées', href: '/technique?sub=interventions-terminees' },
      { title: 'Rapports d’intervention', href: '/technique?sub=rapports-intervention' },
    ]
  },
  {
    title: 'Pièces de Rechange',
    href: '/technique',
    icon: Package2,
    roles: [UserRole.SERVICE_TECHNIQUE],
    section: 'SERVICE TECHNIQUE',
    subItems: [
      { title: 'Stock des pièces', href: '/technique?sub=stock-pieces' },
      { title: 'Fournisseurs', href: '/technique?sub=fournisseurs-pieces' },
      { title: 'Inventaire', href: '/technique?sub=inventaire-pieces' },
    ]
  },
  {
    title: 'Budget & Dépenses',
    href: '/technique',
    icon: Wallet,
    roles: [UserRole.SERVICE_TECHNIQUE],
    section: 'SERVICE TECHNIQUE',
    subItems: [
      { title: 'Coût des réparations', href: '/technique?sub=cout-reparations' },
      { title: 'Budget maintenance', href: '/technique?sub=budget-maintenance' },
      { title: 'Historique financier', href: '/technique?sub=historique-financier' },
    ]
  },
  {
    title: 'Consommation',
    href: '/technique',
    icon: Fuel,
    roles: [UserRole.SERVICE_TECHNIQUE],
    section: 'SERVICE TECHNIQUE',
    subItems: [
      { title: 'Suivi carburant', href: '/technique?sub=suivi-carburant' },
      { title: 'Analyse des coûts', href: '/technique?sub=analyse-conso' },
    ]
  },
  {
    title: 'Rapports & Stats',
    href: '/technique',
    icon: BarChart3,
    roles: [UserRole.SERVICE_TECHNIQUE],
    section: 'SERVICE TECHNIQUE',
    subItems: [
      { title: 'Rapport mensuel', href: '/technique?sub=rapport-mensuel-technique' },
      { title: 'Taux de panne', href: '/technique?sub=taux-panne' },
      { title: 'Disponibilité flotte', href: '/technique?sub=disponibilite-flotte' },
    ]
  },
  {
    title: 'Paramètres',
    href: '/technique',
    icon: Settings,
    roles: [UserRole.SERVICE_TECHNIQUE],
    section: 'SERVICE TECHNIQUE',
    subItems: [
      { title: 'Types de maintenance', href: '/technique?sub=types-maintenance' },
      { title: 'Catégories de pannes', href: '/technique?sub=categories-pannes' },
    ]
  },
  {
    title: 'Accès Comptes',
    href: '/admin/accounts',
    icon: UserPlus,
    roles: [UserRole.PDG],
  },
  {
    title: 'Moyennes & Notes',
    href: '/notes',
    icon: BarChart3,
    roles: [UserRole.PDG, UserRole.DG],
  },
  {
    title: 'Gestion de Gare',
    href: '/gare',
    icon: MapPin,
    roles: [UserRole.CHEF_DE_GARE, UserRole.CHEF_DE_GARE_ADJOINT, UserRole.PDG],
    subItems: [
      { title: 'Vue générale', href: '/gare?sub=vue-generale' },
      { title: 'Le Personnel', href: '/gare?sub=personnel' },
    ]
  },
  {
    title: 'Voyages',
    href: '/voyages',
    icon: Bus,
    roles: [UserRole.PDG],
  },
  {
    title: 'Absences/Retards',
    href: '/absences',
    icon: Clock,
    roles: [UserRole.PDG, UserRole.DG, UserRole.CHEF_DE_GARE, UserRole.CHEF_DE_GARE_ADJOINT],
  },
  {
    title: 'Maintenance',
    href: '/maintenance',
    icon: Settings,
    roles: [UserRole.CHEF_DE_GARE, UserRole.CHEF_DE_GARE_ADJOINT, UserRole.PDG],
  },
  // --- CHAUFFEUR MENU ---
  {
    title: 'Accueil',
    href: '/',
    icon: LayoutDashboard,
    roles: [UserRole.CHAUFFEUR],
    section: 'MENU CHAUFFEUR'
  },
  {
    title: 'Voyages',
    href: '/voyages',
    icon: Bus,
    roles: [UserRole.CHAUFFEUR],
    section: 'MENU CHAUFFEUR'
  },
  {
    title: 'Checking',
    href: '/checking',
    icon: CheckCircle2,
    roles: [UserRole.CHAUFFEUR],
    section: 'MENU CHAUFFEUR'
  },
  {
    title: 'Pannes',
    href: '/pannes',
    icon: AlertTriangle,
    roles: [UserRole.CHAUFFEUR],
    section: 'MENU CHAUFFEUR'
  },
  {
    title: 'Carburant',
    href: '/carburant',
    icon: Fuel,
    roles: [UserRole.CHAUFFEUR],
    section: 'MENU CHAUFFEUR'
  },
  {
    title: 'Trajet',
    href: '/trajet',
    icon: MapPin,
    roles: [UserRole.CHAUFFEUR],
    section: 'MENU CHAUFFEUR'
  },
  {
    title: 'Maintenance',
    href: '/maintenance',
    icon: Wrench,
    roles: [UserRole.CHAUFFEUR],
    section: 'MENU CHAUFFEUR'
  },
  {
    title: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    roles: [UserRole.CHAUFFEUR],
    section: 'MENU CHAUFFEUR'
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
    roles: [UserRole.CHAUFFEUR],
    section: 'MENU CHAUFFEUR'
  },
  {
    title: 'Profil',
    href: '/profile',
    icon: User,
    roles: [UserRole.CHAUFFEUR],
    section: 'MENU CHAUFFEUR'
  }
];

import { Logo } from './Logo';

export function Sidebar({ className }: { className?: string }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [expandedMenus, setExpandedMenus] = React.useState<string[]>(['Tableau de Bord', 'Finances', 'Recettes des Gares']);

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const filteredItems = navItems.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  );

  // Group items by section
  const sections = filteredItems.reduce((acc, item) => {
    const section = item.section || 'MENU';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  return (
    <div className={cn("flex flex-col h-full border-r bg-sidebar text-sidebar-foreground overflow-hidden", className)}>
      <div className="px-6 py-10 flex items-center gap-4 shrink-0 border-b border-sidebar-border/50">
        <Logo size="md" showText={false} className="shadow-2xl shadow-primary/20" />
        <div>
          <h2 className="text-xl font-black tracking-tighter text-sidebar-foreground leading-none">DBS-BAN</h2>
          <p className="text-[10px] font-black text-sidebar-foreground/40 mt-1.5 uppercase tracking-[0.2em]">{user?.role?.replace(/_/g, ' ')}</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
        <div className="space-y-6 pb-10">
          {Object.entries(sections).map(([sectionName, items]) => (
            <div key={sectionName} className="space-y-2">
              {sectionName !== 'MENU' && (
                <p className="px-4 text-[10px] font-black tracking-[0.2em] text-sidebar-foreground/40 uppercase">
                  {sectionName}
                </p>
              )}
              <div className="space-y-1">
                {items.map((item) => {
                  const isExpanded = expandedMenus.includes(item.title);
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isActive = location.pathname === item.href || (hasSubItems && item.subItems!.some(sub => location.search.includes(sub.href.split('?')[1])));

                  return (
                    <div key={item.title + item.href} className="space-y-1">
                      <div className="relative group">
                        {hasSubItems ? (
                          <button
                            onClick={() => toggleMenu(item.title)}
                            className={cn(
                              "w-full flex items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition-all",
                              isActive 
                                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "p-2 rounded-xl transition-colors",
                                isActive ? "bg-sidebar-primary/20 text-sidebar-primary" : "bg-transparent group-hover:bg-white/5"
                              )}>
                                <item.icon className="h-4 w-4" />
                              </div>
                              {item.title}
                            </div>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 opacity-30" />
                            ) : (
                              <ChevronRight className="h-4 w-4 opacity-30" />
                            )}
                          </button>
                        ) : (
                          <NavLink
                            to={item.href}
                            className={({ isActive: isLinkActive }) => cn(
                              "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition-all group",
                              isLinkActive 
                                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            )}
                          >
                            <div className={cn(
                              "p-2 rounded-xl transition-colors",
                              isActive ? "bg-sidebar-primary/20 text-sidebar-primary" : "bg-transparent group-hover:bg-white/5"
                            )}>
                              <item.icon className="h-4 w-4" />
                            </div>
                            {item.title}
                          </NavLink>
                        )}
                      </div>

                      {hasSubItems && isExpanded && (
                        <div
                          className="overflow-hidden space-y-1 ml-10 border-l border-sidebar-accent/30 pl-4 py-1"
                        >
                          {item.subItems!.map((sub) => {
                              const isSubActive = location.search.includes(sub.href.split('?')[1]);
                              return (
                                <NavLink
                                  key={sub.href}
                                  to={sub.href}
                                  className={cn(
                                    "block py-2 px-3 text-xs font-bold transition-all rounded-lg",
                                    isSubActive
                                      ? "text-sidebar-foreground bg-sidebar-accent/30 font-black"
                                      : "text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent/20"
                                  )}
                                >
                                  {sub.title}
                                </NavLink>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border bg-sidebar/50 shrink-0">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:text-white hover:bg-destructive rounded-xl h-11 transition-all"
          onClick={() => signOut().then(() => navigate('/login'))}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
