import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'motion/react';
import { 
  User, 
  Phone, 
  Hash, 
  Mail, 
  Lock, 
  Camera, 
  ArrowRight, 
  Bus,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserRole } from '@/types';

export default function EmployeeRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    matricule: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.CHAUFFEUR
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
            matricule: formData.matricule,
            phone: formData.phone,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Now update the profile with matricule and phone
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: formData.fullName,
            role: formData.role,
            matricule: formData.matricule,
            phone: formData.phone
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.warn("Profile update failed, but auth was created:", profileError);
        }

        setSuccess(true);
        toast.success("Compte créé avec succès !");
      }
    } catch (err: any) {
      toast.error("Erreur d'inscription: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white text-center p-12 space-y-8">
            <div className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-900 uppercase">Bienvenue !</h1>
              <p className="text-slate-500 font-medium">
                Votre compte employé a été créé avec succès. Vous pouvez maintenant vous connecter.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/login')}
              className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest"
            >
              Aller à la Connexion
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        <div className="flex flex-col items-center mb-10 text-center space-y-4">
          <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
             <Bus className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">DIOMANDE BAN SERVICE</h1>
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] mt-1">Espace Recrutement Employés</p>
          </div>
        </div>

        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
          <CardContent className="p-10 md:p-16">
            <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Créer mon compte</h2>
            
            <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Photo Placeholder */}
              <div className="md:col-span-2 flex justify-center mb-4">
                <div className="h-28 w-28 bg-slate-50 rounded-full border-4 border-slate-100 flex flex-col items-center justify-center text-slate-400 group cursor-pointer hover:bg-blue-50 hover:border-blue-100 transition-all">
                  <Camera className="h-8 w-8 mb-1" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Ajouter Photo</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Nom Complet</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Bamba Souleymane" 
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold text-slate-900" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Matricule</Label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    required
                    value={formData.matricule}
                    onChange={(e) => setFormData({...formData, matricule: e.target.value})}
                    placeholder="DBS-2026-001" 
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold text-slate-900 uppercase" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Numéro de téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="07 00 00 00 00" 
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold text-slate-900" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="mon-email@dbs.ci" 
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold text-slate-900" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••" 
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold text-slate-900" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Confirmer</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    required
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="••••••••" 
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold text-slate-900" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Poste occupé</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({...formData, role: value as UserRole})}
                >
                  <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold text-slate-900">
                    <SelectValue placeholder="Choisir un poste" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    <SelectItem value={UserRole.CHAUFFEUR} className="font-bold py-3">Chauffeur</SelectItem>
                    <SelectItem value={UserRole.POMPISTE} className="font-bold py-3">Pompiste</SelectItem>
                    <SelectItem value={UserRole.SERVICE_TECHNIQUE} className="font-bold py-3">Service Technique</SelectItem>
                    <SelectItem value={UserRole.CHARGE_DE_CLIENTELE} className="font-bold py-3">Chargé de Clientèle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 pt-6">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      Finaliser mon inscription <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>

              <div className="md:col-span-2 text-center pt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Déjà un compte ? <span onClick={() => navigate('/login')} className="text-blue-600 cursor-pointer hover:underline">Se connecter</span>
                </p>
              </div>

            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
