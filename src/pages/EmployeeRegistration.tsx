import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  // Check if supabase is initialized properly
  const isConfigured = !!supabase && !!supabase.auth;

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);

    try {
      if (!isConfigured) {
        toast.error("Supabase n'est pas configuré.");
        setLoading(false);
        return;
      }

      const cleanMatricule = matricule.trim().toUpperCase();
      const cleanPhone = phone.trim().replace(/\s/g, '');
      console.log("Activation start:", { cleanMatricule, cleanPhone });

      if (!cleanMatricule || !cleanPhone) {
        toast.error("Veuillez remplir tous les champs.");
        setLoading(false);
        return;
      }

      // 1. Check if employee exists in HR records with timeout
      console.log("Step 1: Check employee record");
      
      const empPromise = supabase
        .from('employees')
        .select('*')
        .eq('matricule', cleanMatricule)
        .eq('phone', cleanPhone);

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Le serveur ne répond pas. Vérifiez votre connexion.')), 12000)
      );

      const { data: employees, error: empError } = await Promise.race([empPromise, timeoutPromise]) as any;

      if (empError) {
        console.error("Employee fetch error:", empError);
        toast.error("Erreur de base de données : " + empError.message);
        setLoading(false);
        return;
      }

      if (!employees || employees.length === 0) {
        console.warn("Employee not found:", { cleanMatricule, cleanPhone });
        toast.error("Matricule ou téléphone incorrect. Vérifiez vos données ou contactez le DRH.");
        setLoading(false);
        return;
      }

      const empData = employees[0];
      const loginEmail = `${cleanMatricule.toLowerCase()}@dbs-ban.ci`;
      const loginPassword = cleanMatricule;

      // 2. Create/Sync Auth Account
      console.log("Step 2: Sign up user", loginEmail);
      const signUpPromise = supabase.auth.signUp({
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

      const { data: authData, error: signUpError } = await Promise.race([signUpPromise, timeoutPromise]) as any;

      if (signUpError) {
        console.error("SignUp Error:", signUpError);
        // Handle "already registered"
        if (signUpError.message.toLowerCase().includes('already registered') || signUpError.status === 400 || signUpError.message.includes('User already registered')) {
          toast.info("Ce compte est déjà activé. Redirection...");
          setTimeout(() => navigate('/login'), 1500);
          return;
        }
        throw signUpError;
      }

      // 3. Update profiles table
      if (authData?.user) {
        console.log("Step 3: Update profile", authData.user.id);
        
        // Attempt to update profile with all known info
        // We do this individually to avoid a total failure if columns are missing
        const profileData: any = {
          id: authData.user.id,
          email: loginEmail,
          full_name: empData.full_name,
          role: empData.role,
          gare_id: empData.gare_id,
          status: 'Actif'
        };

        // These columns might be missing in some schema versions
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              ...profileData,
              matricule: cleanMatricule,
              phone: cleanPhone,
            }, { onConflict: 'id' });

          if (profileError) {
            console.warn("Profile upsert with extra columns failed, retrying without them:", profileError.message);
            // Fallback to minimal profile if matricule/phone columns don't exist
            const { error: retryError } = await supabase
              .from('profiles')
              .upsert(profileData, { onConflict: 'id' });
            
            if (retryError) console.error("Final profile sync fail:", retryError);
          }
        } catch (e) {
          console.warn("Profile sync exception handled:", e);
        }
        
        setSuccess(true);
        toast.success("Compte activé avec succès !");
      } else {
        // Fallback for cases where session is not immediate
        setSuccess(true);
        toast.info("Activation en cours (Vérifiez vos emails si nécessaire)");
      }
    } catch (err: any) {
      console.error("Activation flow failed:", err);
      toast.error("Échec d'activation : " + (err.message || "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-8">
        <div className="h-24 w-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
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
          className="w-full max-w-xs h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-100"
        >
          Se Connecter
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
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
      </div>
    </div>
  );
}
