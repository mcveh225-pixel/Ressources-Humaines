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
    
    // Safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn('AuthProvider: Initialization timed out after 5s. Forcing loading = false.');
        setLoading(false);
      }
    }, 5000);

    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Checking session...');
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('AuthProvider: Session check error:', sessionError);
        }

        if (initialSession) {
          console.log('AuthProvider: Real session found for:', initialSession.user.email);
          setSession(initialSession);
          await fetchProfile(initialSession.user.id, initialSession.user.email);
        } else {
          console.log('AuthProvider: No real session, checking demo mode...');
          const demoUserJson = localStorage.getItem('dbs_demo_user');
          if (demoUserJson) {
            try {
              const demoUser = JSON.parse(demoUserJson);
              setUser(demoUser);
              setSession({ user: { id: demoUser.id, email: demoUser.email } } as any);
              console.log('AuthProvider: Demo session loaded:', demoUser.email);
            } catch (e) {
              console.error('AuthProvider: Failed to parse demo user:', e);
              localStorage.removeItem('dbs_demo_user');
            }
          }
        }
      } catch (err) {
        console.error('AuthProvider: Fatal initialization error:', err);
        localStorage.removeItem('dbs_demo_user');
      } finally {
        console.log('AuthProvider: Initialization complete.');
        setLoading(false);
        clearTimeout(safetyTimeout);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('AuthProvider: Auth event change:', event);
      
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('dbs_demo_user');
        setUser(null);
        setSession(null);
        setLoading(false);
        return;
      }

      if (currentSession) {
        console.log('AuthProvider: Session active after event for:', currentSession.user.email);
        setSession(currentSession);
        localStorage.removeItem('dbs_demo_user');
        await fetchProfile(currentSession.user.id, currentSession.user.email);
      } else if (!localStorage.getItem('dbs_demo_user')) {
        setUser(null);
        setSession(null);
      }
      
      setLoading(false);
    });

    return () => {
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, email?: string) => {
    const userEmail = email || '';
    const isAdminCandidate = userEmail === 'pdg@dbs-ban.ci' || userEmail.toLowerCase().includes('mcveh225@gmail.com');
    
    console.log('AuthProvider: Fetching profile for:', userId, 'Email:', userEmail, 'IsAdminCandidate:', isAdminCandidate);
    
    try {
      // Add a timeout to the profile fetch to prevent hanging
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .limit(1);

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timed out')), 3000)
      );

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error || !data || data.length === 0) {
        console.warn('Profile fetch failed or empty, using fallback. Error:', error?.message);
        
        const fallbackUser: UserProfile = {
          id: userId,
          email: userEmail,
          fullName: isAdminCandidate ? 'Administrateur' : userEmail.split('@')[0],
          role: isAdminCandidate ? UserRole.PDG : UserRole.CHAUFFEUR,
        };
        
        console.log('AuthProvider: Setting fallback user:', fallbackUser);
        (window as any).dbs_user = fallbackUser;
        setUser(fallbackUser);
      } else {
        const profile = data[0];
        console.log('AuthProvider: Found profile in DB:', profile);
        
        const rawRole = profile.role || (isAdminCandidate ? 'PDG' : 'CHAUFFEUR');
        const normalizedRole = rawRole.toUpperCase().replace(' ', '_') as UserRole;
        
        const validRoles = Object.values(UserRole) as string[];
        const finalRole = validRoles.includes(normalizedRole) ? normalizedRole : (isAdminCandidate ? UserRole.PDG : UserRole.CHAUFFEUR);

        const dbUser: UserProfile = {
          id: profile.id,
          email: profile.email || userEmail,
          fullName: profile.full_name || (isAdminCandidate ? 'Administrateur' : userEmail.split('@')[0]),
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
        fullName: isAdminCandidate ? 'Administrateur' : userEmail.split('@')[0],
        role: isAdminCandidate ? UserRole.PDG : UserRole.CHAUFFEUR,
      };
      
      console.log('AuthProvider: Applying emergency fallback:', fallbackUser);
      setUser(fallbackUser);
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
