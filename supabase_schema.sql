-- SCHEMA SIMPLIFIÉ ET ROBUSTE POUR DBS-BAN
-- Ce script crée les tables sans dépendances complexes avec l'authentification native
-- pour assurer un fonctionnement immédiat du prototype.

-- 1. Suppression des anciennes contraintes si elles existent
DO $$ 
BEGIN 
  -- Suppression des clés étrangères vers auth.users pour simplifier
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'profiles_id_fkey' AND table_name = 'profiles') THEN
    ALTER TABLE public.profiles DROP CONSTRAINT profiles_id_fkey;
  END IF;
EXCEPTION WHEN OTHERS THEN 
  -- Ignorer les erreurs si la table n'existe pas encore
END $$;

-- 2. Table des Gares
CREATE TABLE IF NOT EXISTS public.gares (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table des Profils (Comptes Utilisateurs)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Par défaut génère un UUID, mais le trigger peut l'écraser
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'DRH',
  gare_id TEXT REFERENCES public.gares(id) ON DELETE SET NULL,
  avatar_url TEXT,
  status TEXT DEFAULT 'Actif',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Fonction Trigger pour créer le profil automatiquement
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Utilisateur DBS'),
    COALESCE(new.raw_user_meta_data->>'role', 'CHAUFFEUR')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attribution du Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Table des Employés
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  matricule TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  gare_id TEXT REFERENCES public.gares(id) ON DELETE SET NULL,
  service TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  sexe TEXT,
  phone TEXT,
  email TEXT,
  adresse TEXT,
  photo_url TEXT,
  cni_number TEXT,
  permis_number TEXT,
  date_embauche DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Correction pour les bases existantes (Si les colonnes manquent)
DO $$ 
BEGIN 
  -- Table Employees
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='full_name') THEN
    ALTER TABLE public.employees ADD COLUMN full_name TEXT NOT NULL DEFAULT 'Inconnu';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='date_embauche') THEN
    ALTER TABLE public.employees ADD COLUMN date_embauche DATE DEFAULT CURRENT_DATE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='first_name') THEN
    ALTER TABLE public.employees ADD COLUMN first_name TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='last_name') THEN
    ALTER TABLE public.employees ADD COLUMN last_name TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='sexe') THEN
    ALTER TABLE public.employees ADD COLUMN sexe TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='adresse') THEN
    ALTER TABLE public.employees ADD COLUMN adresse TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='cni_number') THEN
    ALTER TABLE public.employees ADD COLUMN cni_number TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='permis_number') THEN
    ALTER TABLE public.employees ADD COLUMN permis_number TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='service') THEN
    ALTER TABLE public.employees ADD COLUMN service TEXT DEFAULT 'Administration';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='photo_url') THEN
    ALTER TABLE public.employees ADD COLUMN photo_url TEXT;
  END IF;

  -- Supprimer la contrainte unique sur l'email si elle existe (problème rencontré par l'utilisateur)
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'employees_email_key' AND table_name = 'employees') THEN
    ALTER TABLE public.employees DROP CONSTRAINT employees_email_key;
  END IF;
END $$;

-- 4. Table des Véhicules
CREATE TABLE IF NOT EXISTS public.vehicles (
  id TEXT PRIMARY KEY,
  immatriculation TEXT UNIQUE NOT NULL,
  marque TEXT NOT NULL,
  modele TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  next_maintenance DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table des Recettes
CREATE TABLE IF NOT EXISTS public.recettes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gare_id TEXT REFERENCES public.gares(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  type TEXT NOT NULL,
  validation_status TEXT DEFAULT 'En attente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Table des Dépenses
CREATE TABLE IF NOT EXISTS public.depenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gare_id TEXT REFERENCES public.gares(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  validation_status TEXT DEFAULT 'En attente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Table des Absences
CREATE TABLE IF NOT EXISTS public.absences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  type TEXT NOT NULL,
  duration INTEGER,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activation pgcrypto pour les UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Politiques de sécurité simples
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recettes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.depenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absences ENABLE ROW LEVEL SECURITY;

-- Autoriser tout pour le prototype
DROP POLICY IF EXISTS "access_profiles" ON public.profiles;
CREATE POLICY "access_profiles" ON public.profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "access_gares" ON public.gares;
CREATE POLICY "access_gares" ON public.gares FOR ALL USING (true);

DROP POLICY IF EXISTS "access_employees" ON public.employees;
CREATE POLICY "access_employees_select" ON public.employees FOR SELECT USING (true);
CREATE POLICY "access_employees_insert" ON public.employees FOR INSERT WITH CHECK (true);
CREATE POLICY "access_employees_update" ON public.employees FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "access_employees_delete" ON public.employees FOR DELETE USING (true);

DROP POLICY IF EXISTS "access_vehicles" ON public.vehicles;
CREATE POLICY "access_vehicles_select" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "access_vehicles_insert" ON public.vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "access_vehicles_update" ON public.vehicles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "access_vehicles_delete" ON public.vehicles FOR DELETE USING (true);

DROP POLICY IF EXISTS "access_recettes" ON public.recettes;
CREATE POLICY "access_recettes" ON public.recettes FOR ALL USING (true);

DROP POLICY IF EXISTS "access_depenses" ON public.depenses;
CREATE POLICY "access_depenses" ON public.depenses FOR ALL USING (true);

DROP POLICY IF EXISTS "access_absences" ON public.absences;
CREATE POLICY "access_absences" ON public.absences FOR ALL USING (true);

-- 12. Insertion des données par défaut
INSERT INTO public.gares (id, name, location) VALUES 
('adjame', 'Adjamé', 'Abidjan'),
('yopougon', 'Yopougon', 'Abidjan'),
('duekoue', 'Duékoué', 'Duékoué'),
('bangolo', 'Bangolo', 'Bangolo'),
('man', 'Man', 'Man'),
('sangouine', 'Sangouiné', 'Sangouiné'),
('mahapleu', 'Mahapleu', 'Mahapleu'),
('danane', 'Danané', 'Danané'),
('zouanhounien', 'Zouan-Hounien', 'Zouan-Hounien'),
('binhouye', 'Bin-Houyé', 'Bin-Houyé'),
('touba', 'Touba', 'Touba'),
('biankouman', 'Biankouman', 'Biankouman'),
('facobly', 'Facobly', 'Facobly'),
('san-pedro', 'San Pedro', 'San Pedro')
ON CONFLICT (id) DO NOTHING;

-- 13. Insertion des Administrateurs par défaut (si nécessaire)
INSERT INTO public.profiles (id, email, full_name, role, status)
VALUES 
  ('037618c4-dac1-4cc8-8a78-3e7751675105', 'pdg@dbs-ban.ci', 'Directeur Général', 'PDG', 'Actif'),
  ('12345678-1234-1234-1234-123456789012', 'daf@dbs-ban.ci', 'Directeur Financier', 'DAF', 'Actif')
ON CONFLICT (email) 
DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- 14. Force le rôle DRH pour l'utilisateur actuel pour le prototype
UPDATE public.profiles SET role = 'DRH' WHERE email = 'mcveh225@gmail.com';
