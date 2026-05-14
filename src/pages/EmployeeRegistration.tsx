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
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function EmployeeRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [matricule, setMatricule] = useState('');
  const [phone, setPhone] = useState('');

  // Check if supabase is initialized correctly
  const isConfigured = !!supabase;

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!matricule || !phone) {
        toast.error("Veuillez remplir tous les champs.");
        return;
      }

      const cleanMatricule = matricule.trim().toUpperCase();
      const cleanPhone = phone.trim().replace(/\s/g, '');

      console.log("Checking employee:", cleanMatricule, cleanPhone);

      // 1. Check if employee exists in HR records
      const { data: employee, error: empError } = await supabase
        .from('employees')
        .select('*')
        .eq('matricule', cleanMatricule)
        .eq('phone', cleanPhone);

      if (empError) {
        console.error("Employee fetch error:", empError);
        toast.error("Impossible d'accéder à la base du personnel. Contactez l'administrateur.");
        return;
      }

      if (!employee || employee.length === 0) {
        toast.error("Matricule ou téléphone incorret. Vérifiez vos données ou contactez le DRH.");
        return;
      }

      const empData = employee[0];
      const loginEmail = `${cleanMatricule.toLowerCase()}@dbs-ban.ci`;
      const loginPassword = cleanMatricule;

      // 2. Create/Sync Auth Account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: loginEmail,
        password: loginPassword,
        options: {
          data: {
            full_name: empData.full_name,
            role: empData.role,
            matricule: cleanMatricule,
            phone: cleanPhone,
            gare_id: empData.gare_id
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('User already registered') || signUpError.status === 400) {
          toast.info("Ce compte est déjà activé. Redirection...");
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        throw signUpError;
      }

      if (authData.user) {
        // 3. Update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: loginEmail,
            full_name: empData.full_name,
            role: empData.role,
            matricule: cleanMatricule,
            phone: cleanPhone,
            gare_id: empData.gare_id
          }, { onConflict: 'id' });

        if (profileError) console.warn("Profile sync issue:", profileError);

        setSuccess(true);
        toast.success("Compte activé avec succès !");
      } else {
        toast.info("Vérification envoyée si requise (Généralement désactivé).");
        setSuccess(true);
      }
    } catch (err: any) {
      console.error("Activation flow failed:", err);
      toast.error("Erreur d'activation: " + (err.message || "Inconnue"));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="h-24 w-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 uppercase">Compte Activé !</h1>
            <p className="text-slate-500 font-bold">
              Bienvenue chez DBS. Votre compte est maintenant prêt.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/login')}
            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-100"
          >
            Se Connecter
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="flex flex-col items-center mb-8 text-center space-y-3">
          <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
             <Bus className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Activer mon compte</h1>
            <p className="text-slate-500 font-black uppercase text-[8px] tracking-[0.3em] mt-1">Personnel DIOMANDE BAN SERVICE</p>
          </div>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="p-8 md:p-10">
            <form onSubmit={handleActivate} className="space-y-6">
              
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Matricule Employé</Label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    required
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    placeholder="Ex: DBS-2026-001" 
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-black text-slate-900 uppercase" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Numéro de téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: 0707070707" 
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold text-slate-900" 
                  />
                </div>
                <p className="text-[9px] text-slate-400 font-bold italic ml-1">
                  Utilisez le numéro communiqué au DRH lors de votre enregistrement.
                </p>
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    Vérifier et Activer <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>

              <div className="text-center pt-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Déjà activé ? <span onClick={() => navigate('/login')} className="text-blue-600 cursor-pointer hover:underline">Se connecter</span>
                </p>
              </div>

            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
