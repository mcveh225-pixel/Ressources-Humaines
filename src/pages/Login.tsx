import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Lock, Mail, Users, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

import { Logo } from '@/components/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In production, users provide real credentials via Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Erreur de connexion: ' + error.message);
      } else {
        toast.success('Connexion réussie');
        navigate('/');
      }
    } catch (err) {
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="space-y-6 text-center p-12 pb-6">
            <Logo size="xl" showText={false} className="mx-auto drop-shadow-2xl" />
            <div>
              <CardTitle className="text-5xl font-black tracking-tighter text-slate-900 leading-none">DBS-BAN</CardTitle>
              <CardDescription className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4">
                Système de Gestion de Transport
              </CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="px-10 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nom@dbs-ban.com" 
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary/20 transition-all font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-[10px] uppercase font-black tracking-widest text-slate-400">Mot de passe</Label>
                  <Button variant="link" className="px-0 h-auto font-bold text-[10px] uppercase tracking-widest text-primary/60 hover:text-primary">
                    Oublié ?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    className="pl-12 pr-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary/20 transition-all font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-10 pb-10 pt-6 flex flex-col gap-6">
              <Button type="submit" className="w-full h-14 text-base font-black uppercase tracking-widest rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
              
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-black">
                  <span className="bg-white px-4 text-slate-300 tracking-widest">Identification</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  const demoUser = {
                    id: 'demo-user-id',
                    email: 'demo@dbs-ban.ci',
                    fullName: 'Utilisateur Démo',
                    role: 'PDG'
                  };
                  localStorage.setItem('dbs_demo_user', JSON.stringify(demoUser));
                  window.location.reload();
                }}
                className="w-full h-14 border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 font-black uppercase tracking-widest text-[10px] transition-all"
              >
                Accéder Mode Démo
              </Button>

              <div className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <ShieldAlert className="h-3 w-3" />
                Accès restreint aux autorisés
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
