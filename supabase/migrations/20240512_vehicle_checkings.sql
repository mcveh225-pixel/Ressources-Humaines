-- Table pour enregistrer les fiches de checking (inspections de car)
CREATE TABLE vehicle_checkings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chauffeur_id UUID REFERENCES auth.users(id), -- Optionnel: l'ID de l'utilisateur qui remplit la fiche
  chauffeur_name TEXT NOT NULL,
  check_date DATE NOT NULL DEFAULT CURRENT_DATE,
  departure_city TEXT,
  arrival_city TEXT,
  car_number TEXT NOT NULL,
  observations TEXT,
  sections JSONB NOT NULL, -- Stocke les items du checking et leurs états (ok/non)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) -- Propriétaire de l'enregistrement
);

-- Index pour la recherche par date et par numéro de car
CREATE INDEX idx_checkings_date ON vehicle_checkings(check_date);
CREATE INDEX idx_checkings_car ON vehicle_checkings(car_number);

-- RLS (Row Level Security) - Optionnel selon vos besoins de sécurité
-- ALTER TABLE vehicle_checkings ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Utilisateurs authentifiés peuvent voir les fiches" 
-- ON vehicle_checkings FOR SELECT USING (auth.role() = 'authenticated');

-- CREATE POLICY "Chauffeurs peuvent créer leurs propres fiches" 
-- ON vehicle_checkings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
