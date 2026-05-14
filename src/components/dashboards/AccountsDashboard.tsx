import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, Shield, UserCheck, Mail, Lock, Trash2, AlertCircle, User as UserIcon, Loader2 } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from '@/types';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import { cn } from "@/lib/utils";
import { QRCodeGenerator } from '@/components/QRCodeGenerator';

interface AdminAccount {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  lastLogin: string;
  status: 'Actif' | 'Inactif';
}

export function AccountsDashboard() {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<AdminAccount | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    role: UserRole.DG as string,
    password: ''
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setDbError(null);
      console.log("Fetching accounts from Supabase...");
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setAccounts(data.map(item => ({
          id: item.id,
          email: item.email,
          fullName: item.full_name || 'Sans Nom',
          role: item.role as UserRole,
          lastLogin: item.last_login ? new Date(item.last_login).toLocaleString() : 'Jamais',
          status: item.status || 'Actif'
        })));
        localStorage.setItem('dbs_accounts', JSON.stringify(data));
        localStorage.setItem('dbs_accounts_synced', 'true');
      }
    } catch (error: any) {
      console.warn('Supabase fetch failed:', error.message);
      setDbError(error.message);
      localStorage.removeItem('dbs_accounts_synced');
      
      const localAccounts = localStorage.getItem('dbs_accounts');
      if (localAccounts) {
        setAccounts(JSON.parse(localAccounts));
      } else {
        const initial: AdminAccount[] = [
          { id: '1', email: 'pdg@dbs-ban.ci', fullName: 'Directeur Général', role: UserRole.PDG, lastLogin: "Aujourd'hui, 08:30", status: 'Actif' },
          { id: '2', email: 'daf@dbs-ban.ci', fullName: 'Directeur Financier', role: UserRole.DAF, lastLogin: '05/07/2026', status: 'Actif' },
        ];
        setAccounts(initial);
        localStorage.setItem('dbs_accounts', JSON.stringify(initial));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with:", { email: formData.email, fullName: formData.fullName, role: formData.role });
    
    if (isSubmitting) {
      console.log("Already submitting, skipping...");
      return;
    }
    
    let signupCompleted = false;
    
    try {
      setIsSubmitting(true);
      console.log("Attempting to create account in Supabase Auth...");
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password || 'DBS2026!',
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
          },
          emailRedirectTo: window.location.origin
        }
      });

      if (authError) {
        console.error("Auth Exception received:", authError);
        toast.error(`Erreur d'authentification: ${authError.message}`);
        setIsSubmitting(false);
        return;
      }
      
      console.log("Auth result received:", authData);

      if (authData.user) {
        // Handle case where user already exists but isn't confirmed
        if (authData.user.identities && authData.user.identities.length === 0) {
          toast.warning("Cet email est déjà utilisé ou en attente.");
        } else {
          toast.success("Compte créé avec succès !");
        }
        
        setIsCreateDialogOpen(false);
        setFormData({ email: '', fullName: '', role: UserRole.DG, password: '' });
        
        // Short delay before refresh to allow trigger execution
        setTimeout(() => {
          fetchAccounts();
          setIsSubmitting(false);
        }, 1500);
      } else {
        toast.info("Inscription envoyée. Vérifiez vos emails.");
        setIsCreateDialogOpen(false);
        setIsSubmitting(false);
      }
      
    } catch (error: any) {
      console.error('Critical Catch Error in handleCreateAccount:', error);
      toast.error(`Erreur lors de la création: ${error.message || 'Inconnue'}`);
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Supabase delete failed, removing from local storage only:', error.message);
      }

      const updatedAccounts = accounts.filter(acc => acc.id !== id);
      setAccounts(updatedAccounts);
      localStorage.setItem('dbs_accounts', JSON.stringify(updatedAccounts));
      
      setIsDeleteDialogOpen(false);
      setAccountToDelete(null);
      toast.success("Compte supprimé");
    } catch (error) {
      console.error('Error deleting account:', error);
      const updatedAccounts = accounts.filter(acc => acc.id !== id);
      setAccounts(updatedAccounts);
      localStorage.setItem('dbs_accounts', JSON.stringify(updatedAccounts));
      setIsDeleteDialogOpen(false);
      toast.success("Compte supprimé (localement)");
    }
  };

  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const registrationUrl = `${customBaseUrl || window.location.origin}/#/register-employee`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Gestion des Comptes Accès</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">Administration des privilèges et accès au système.</p>
            <Badge variant="outline" className={cn(
              "text-[9px] font-black uppercase tracking-widest px-2 h-5 border-none",
              loading ? "bg-slate-100 text-slate-400" : 
              accounts.length > 0 && localStorage.getItem('dbs_accounts_synced') ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
            )}>
              {loading ? "Vérification..." : 
               accounts.length > 0 && localStorage.getItem('dbs_accounts_synced') ? "Connecté à la base" : 
               dbError ? `ERREUR SQL: ${dbError}` : "Mode local / Déconnecté"}
            </Badge>
          </div>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger render={<Button className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl px-6 h-12" />}>
              <UserPlus className="h-5 w-5" /> Créer un accès
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Nouveau Compte</DialogTitle>
              <DialogDescription className="font-medium text-slate-500">
                Définissez les identifiants et le rôle du nouvel administrateur.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAccount} className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Nom Complet</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="name" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Ex: Jean Kouassi" 
                    className="pl-10 h-11 rounded-xl border-slate-200" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Email Professionnel</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="nom@dbs-ban.ci" 
                    className="pl-10 h-11 rounded-xl border-slate-200" 
                    required 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Rôle</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(val) => setFormData({...formData, role: val})}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Rôle" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {Object.values(UserRole).map((role) => (
                        <SelectItem key={role} value={role} className="rounded-lg">{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pass" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      id="pass" 
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••" 
                      className="pl-10 h-11 rounded-xl border-slate-200" 
                      required 
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl font-black uppercase tracking-widest">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : "Valider la création"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm rounded-3xl">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Admins</p>
                <p className="text-2xl font-black">{accounts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-3xl">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Utilisateurs Actifs</p>
                <p className="text-2xl font-black">{accounts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

        </div>

        <div className="lg:w-80 space-y-6">
          <div className="space-y-4 px-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">URL Publique (Shared URL)</Label>
            <div className="flex gap-2">
              <Input 
                value={customBaseUrl}
                onChange={(e) => setCustomBaseUrl(e.target.value)}
                placeholder="https://..."
                className="h-10 rounded-xl bg-slate-50 border-none font-bold text-xs flex-1"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  navigator.clipboard.writeText(registrationUrl);
                  toast.success("Lien copié !");
                }}
                className="h-10 rounded-xl px-3"
              >
                Copier
              </Button>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">URL Générée :</p>
               <p className="text-[10px] font-mono break-all text-blue-600 font-bold">{registrationUrl}</p>
            </div>
            <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">
              Vérifiez que l'URL contient **/#/** pour fonctionner en prod.
            </p>
          </div>

          <QRCodeGenerator 
            url={registrationUrl} 
            title="S'inscrire" 
            description="Le code pour les nouveaux employés" 
          />
          
          <Card className="border-none shadow-sm bg-slate-900 text-white rounded-[2rem]">
            <CardContent className="p-6 space-y-4">
              <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-xs font-medium leading-relaxed opacity-80">
                Partagez ce QR code avec vos employés pour qu'ils puissent créer leur propre compte avec leur numéro de téléphone et matricule.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
          <div>
            <CardTitle className="text-xl font-black">Comptes Administratifs</CardTitle>
            <CardDescription className="text-xs font-medium uppercase tracking-widest mt-1">Utilisateurs ayant des accès de gestion</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="font-black uppercase text-[10px] tracking-widest pl-8">Email & Nom</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Rôle</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Dernière Connexion</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Statut</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-slate-400">
                      <Loader2 className="h-10 w-10 animate-spin" />
                      <p className="font-black uppercase text-[10px] tracking-widest">Chargement des comptes...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : accounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-slate-400">
                      <Shield className="h-10 w-10 opacity-20" />
                      <p className="font-black uppercase text-[10px] tracking-widest">Aucun compte administrateur trouvé</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((account) => (
                  <TableRow key={account.id} className="hover:bg-slate-50/50 border-slate-50 transition-colors">
                    <TableCell className="py-5 pl-8">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900">{account.email}</span>
                        <span className="text-xs text-slate-500 font-medium">{account.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none font-bold text-[10px] uppercase px-2">
                        {account.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-slate-600">{account.lastLogin}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 font-black text-[9px] uppercase px-2 h-5">
                        {account.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="rounded-lg h-8 font-black uppercase text-[10px] tracking-widest">
                          Gérer
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setAccountToDelete(account);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="rounded-lg h-8 font-black uppercase text-[10px] tracking-widest text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem]">
          <DialogHeader className="items-center text-center">
            <div className="h-20 w-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-4">
              <AlertCircle className="h-10 w-10" />
            </div>
            <DialogTitle className="text-2xl font-black">Confirmer la suppression</DialogTitle>
            <DialogDescription className="font-medium text-slate-500 pt-2">
              Êtes-vous sûr de vouloir supprimer le compte de <span className="text-slate-900 font-bold">{accountToDelete?.fullName}</span> ? 
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="grid grid-cols-2 gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="rounded-xl h-12 font-black uppercase tracking-widest border-2"
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => accountToDelete && handleDeleteAccount(accountToDelete.id)}
              className="rounded-xl h-12 font-black uppercase tracking-widest"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

