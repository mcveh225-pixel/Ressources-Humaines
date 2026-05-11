import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Lock, Mail, Users, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For development/demo purposes, we allow a bypass or a specific test account
      // In production, users provide real credentials
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Mode démo pour le Super Administrateur (PDG)
        if (email === 'pdg@dbs-ban.ci' && password === 'pdgdbs123') {
          const demoUser = {
            id: 'demo-pdg-uuid',
            email: 'pdg@dbs-ban.ci',
            fullName: 'Super Administrateur',
            role: 'PDG'
          };
          localStorage.setItem('dbs_demo_user', JSON.stringify(demoUser));
          toast.success('Mode démo activé (Super Admin)');
          // Forcer le rechargement pour que AuthProvider détecte le mode démo
          window.location.href = '/';
          return;
        } else if (email.includes('admin') || email === 'mcveh225@gmail.com') {
          toast.success('Mode démo activé');
          navigate('/');
        } else {
          toast.error('Erreur de connexion: ' + error.message);
        }
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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Bus className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">DBS-BAN</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Système de Gestion Intégrée de Transport
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nom@dbs-ban.com" 
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Button variant="link" className="px-0 font-normal text-xs text-slate-500">
                    Mot de passe oublié?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
              <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <ShieldAlert className="h-3 w-3" />
                Accès restreint au personnel autorisé
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
