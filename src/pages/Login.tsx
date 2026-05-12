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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 bg-white">
        <img 
          src="/background.png" 
          alt="Transport Background" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Grid Pattern Overlay removed for clarity */}

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[340px] z-10 lg:mr-[10%] lg:ml-auto"
      >
        <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
          <CardHeader className="space-y-4 text-center p-8 pb-4">
            <Logo size="xl" showText={false} className="mx-auto drop-shadow-xl" />
            <div>
              <CardTitle className="text-3xl font-black tracking-tighter text-[#004B93] leading-none">DBS-BAN</CardTitle>
              <CardDescription className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[9px] mt-3">
                Système de Gestion
              </CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="px-8 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[9px] uppercase font-black tracking-widest text-slate-400 ml-1">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nom@dbs-ban.com" 
                    className="pl-11 h-12 rounded-xl bg-slate-50/50 border-none focus-visible:ring-primary/20 transition-all font-medium text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-[9px] uppercase font-black tracking-widest text-slate-400">Mot de passe</Label>
                  <Button variant="link" className="px-0 h-auto font-bold text-[9px] uppercase tracking-widest text-primary/60 hover:text-primary">
                    Oublié ?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    className="pl-11 pr-11 h-12 rounded-xl bg-slate-50/50 border-none focus-visible:ring-primary/20 transition-all font-medium text-sm"
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
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-8 pb-8 pt-4 flex flex-col gap-4">
              <Button type="submit" className="w-full h-12 text-sm font-black uppercase tracking-widest rounded-xl bg-[#004B93] hover:bg-[#003d7a] shadow-lg shadow-primary/10 transition-all active:scale-[0.98]" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
              
              <div className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <ShieldAlert className="h-3 w-3" />
                Accès restreint
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
