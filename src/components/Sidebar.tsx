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
  Archive
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'motion/react';
import { Separator } from '@/components/ui/separator';
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
    roles: [UserRole.PDG, UserRole.DG, UserRole.DRH, UserRole.SERVICE_TECHNIQUE, UserRole.CHEF_DE_GARE, UserRole.CHEF_DE_GARE_ADJOINT, UserRole.CHAUFFEUR, UserRole.POMPISTE],
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
    roles: [UserRole.PDG, UserRole.DG, UserRole.SERVICE_TECHNIQUE],
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
  },
  {
    title: 'Voyages',
    href: '/voyages',
    icon: Bus,
    roles: [UserRole.CHAUFFEUR, UserRole.PDG],
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
    roles: [UserRole.SERVICE_TECHNIQUE, UserRole.CHEF_DE_GARE, UserRole.CHEF_DE_GARE_ADJOINT, UserRole.PDG],
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

                      <AnimatePresence>
                        {hasSubItems && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
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
                          </motion.div>
                        )}
                      </AnimatePresence>
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
