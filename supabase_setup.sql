-- SCRIPT DE CONFIGURATION SUPABASE POUR DBS-BAN
-- Copiez et collez ce script dans l'éditeur SQL de votre tableau de bord Supabase

-- 1. Création de la table 'employees' (Base de données du personnel gérée par le DRH)
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matricule TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    role TEXT,
    gare_id TEXT,
    service TEXT,
    status TEXT DEFAULT 'active',
    phone TEXT,
    email TEXT,
    photo_url TEXT,
    date_embauche DATE DEFAULT CURRENT_DATE,
    sexe TEXT,
    adresse TEXT,
    cni_number TEXT,
    permis_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Création de la table 'profiles' (Extension des comptes utilisateurs Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    role TEXT,
    matricule TEXT,
    phone TEXT,
    gare_id TEXT,
    avatar_url TEXT,
    status TEXT DEFAULT 'Actif',
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Création de la table 'gares'
CREATE TABLE IF NOT EXISTS public.gares (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    managed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Activation de Row Level Security (RLS)
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gares ENABLE ROW LEVEL SECURITY;

-- 5. Politiques d'accès (Exemples simplifiés pour le prototype)
-- Permettre la lecture publique pour l'activation (nécessaire pour vérifier le matricule)
CREATE POLICY "Lecture publique pour activation" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Gestion complète par DRH/PDG" ON public.employees FOR ALL USING (true); -- Ajuster en prod

CREATE POLICY "Profils visibles par tous" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Modif propre profil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 6. Trigger pour créer un profil automatiquement lors de l'auth (optionnel mais recommandé)
-- Note: Ce trigger aide à garder 'auth.users' et 'profiles' synchronisés
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, matricule, phone, gare_id)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'role',
        NEW.raw_user_meta_data->>'matricule',
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'gare_id'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        matricule = EXCLUDED.matricule;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
