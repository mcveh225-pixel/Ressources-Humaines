/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  PDG = 'PDG',
  DG = 'DG',
  DRH = 'DRH',
  DAF = 'DAF',
  COMPTABLE = 'COMPTABLE',
  DIRECTEUR_DE_GARE = 'DIRECTEUR_DE_GARE',
  CHEF_DE_GARE = 'CHEF_DE_GARE',
  CHAUFFEUR = 'CHAUFFEUR',
  RESPONSABLE_COURRIER = 'RESPONSABLE_COURRIER',
  BAGAGISTE = 'BAGAGISTE',
  ENREGISTREUR = 'ENREGISTREUR',
  CONTROLEUR = 'CONTROLEUR',
  CONVOYEUR = 'CONVOYEUR',
  CHARGEUR = 'CHARGEUR',
  CHEF_BAGAGISTE = 'CHEF_BAGAGISTE',
  CONSEILLER = 'CONSEILLER',
  GUICHETIER = 'GUICHETIER',
  ASSISTANT_GUICHET = 'ASSISTANT_GUICHET',
  SERVICE_TECHNIQUE = 'SERVICE_TECHNIQUE'
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  gareId?: string;
  avatarUrl?: string;
}

export interface Employee {
  id: string;
  matricule: string;
  fullName: string;
  photoUrl?: string;
  role: UserRole;
  gare: string;
  service: string;
  status: 'active' | 'absent' | 'leave';
  phone?: string;
  email?: string;
  dateEmbauche: string;
}

export interface Gare {
  id: string;
  name: string;
  location: string;
  color?: string;
  icon?: string;
}

export interface Recette {
  id: string;
  gareId: string;
  service: 'Guichet' | 'Courrier' | 'Bagage';
  amount: number;
  date: string;
  type: 'journalier' | 'hebdomadaire' | 'mensuel';
}

export interface Depense {
  id: string;
  gareId: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface Vehicle {
  id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  status: 'available' | 'in_repair' | 'on_journey';
  nextMaintenance?: string;
}

export interface AbsenceRecord {
  id: string;
  employeeId: string;
  date: string;
  type: 'absence' | 'retard';
  duration?: number; // in minutes for retard
  reason?: string;
}
