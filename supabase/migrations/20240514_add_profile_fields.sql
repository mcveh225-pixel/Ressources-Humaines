-- Ajout de champs personnalisés pour les employés
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS matricule TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gare_id TEXT;

-- Assurez-vous que les politiques RLS autorisent la mise à jour par l'utilisateur lui-même
-- CREATE POLICY "Users can update their own profile" ON profiles 
-- FOR UPDATE USING (auth.uid() = id);
