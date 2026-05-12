import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile, UserRole } from '@/types';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Initializing...');
    
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (initialSession) {
          setSession(initialSession);
          await fetchProfile(initialSession.user.id, initialSession.user.email);
        } else {
          // Check for manual demo mode
          const demoUserJson = localStorage.getItem('dbs_demo_user');
          if (demoUserJson) {
            try {
              const demoUser = JSON.parse(demoUserJson);
              setUser(demoUser);
              // Mock a session object for the app to allow entry
              setSession({ user: { id: demoUser.id, email: demoUser.email } } as any);
            } catch (e) {
              localStorage.removeItem('dbs_demo_user');
            }
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('AuthProvider: Init error:', err);
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted) return;
      console.log('AuthProvider: Auth event:', event);
      
      if (currentSession) {
        localStorage.removeItem('dbs_demo_user'); // Real user takes precedence
        setSession(currentSession);
        await fetchProfile(currentSession.user.id, currentSession.user.email);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('dbs_demo_user');
        setUser(null);
        setSession(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, email?: string) => {
    const userEmail = email || '';
    
    const inferRoleFromEmail = (email: string): UserRole => {
      const e = email.toLowerCase();
      if (e.includes('pdg')) return UserRole.PDG;
      if (e.includes('drh')) return UserRole.DRH;
      if (e.includes('finan') || e.includes('daf')) return UserRole.DAF;
      if (e.includes('compt')) return UserRole.COMPTABLE;
      if (e.includes('tech')) return UserRole.SERVICE_TECHNIQUE;
      if (e.includes('adjoint')) return UserRole.CHEF_DE_GARE_ADJOINT;
      if (e.includes('gare')) return UserRole.CHEF_DE_GARE;
      if (e.includes('pompiste')) return UserRole.POMPISTE;
      if (e.includes('chauf')) return UserRole.CHAUFFEUR;
      if (e.includes('mcveh225')) return UserRole.PDG;
      return UserRole.CHAUFFEUR;
    };

    const isAdminCandidate = userEmail === 'pdg@dbs-ban.ci' || userEmail.toLowerCase().includes('mcveh225@gmail.com');
    const inferredRole = inferRoleFromEmail(userEmail);
    
    console.log('AuthProvider: Fetching profile for:', userId, 'Email:', userEmail, 'Inferred Role:', inferredRole);
    
    try {
      // Increased timeout to 15s to prevent premature fallbacks on slow networks
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timed out')), 15000)
      );

      const { data: profile, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error || !profile) {
        console.warn('Profile fetch failed or empty, using fallback. Error:', error?.message);
        
        const fallbackUser: UserProfile = {
          id: userId,
          email: userEmail,
          fullName: userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1),
          role: inferredRole,
        };
        
        console.log('AuthProvider: Setting fallback user:', fallbackUser);
        (window as any).dbs_user = fallbackUser;
        setUser(fallbackUser);
      } else {
        console.log('AuthProvider: Found profile in DB:', profile);
        
        const rawRole = profile.role || inferredRole;
        const normalizedRole = rawRole.toUpperCase().replace(' ', '_') as UserRole;
        
        const validRoles = Object.values(UserRole) as string[];
        const finalRole = validRoles.includes(normalizedRole) ? (normalizedRole as UserRole) : inferredRole;

        const dbUser: UserProfile = {
          id: profile.id,
          email: profile.email || userEmail,
          fullName: profile.full_name || userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1),
          role: finalRole,
          gareId: profile.gare_id,
          avatarUrl: profile.avatar_url,
        };
        
        console.log('AuthProvider: Setting DB user:', dbUser);
        (window as any).dbs_user = dbUser;
        setUser(dbUser);
      }
    } catch (e) {
      console.error('Critical Error in fetchProfile:', e);
      
      const fallbackUser: UserProfile = {
        id: userId,
        email: userEmail,
        fullName: userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1),
        role: inferredRole,
      };
      
      console.log('AuthProvider: Applying emergency fallback:', fallbackUser);
      setUser(fallbackUser);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('dbs_demo_user');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
