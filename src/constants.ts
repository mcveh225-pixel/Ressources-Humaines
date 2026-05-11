import { UserRole, Gare } from './types';

export const GARES: Gare[] = [
  { id: 'adjame', name: 'Adjamé', location: 'Abidjan', color: '#3b82f6', icon: 'Building2' },
  { id: 'yopougon', name: 'Yopougon', location: 'Abidjan', color: '#2563eb', icon: 'Building' },
  { id: 'duekoue', name: 'Duékoué', location: 'Duékoué', color: '#10b981', icon: 'MapPin' },
  { id: 'bangolo', name: 'Bangolo', location: 'Bangolo', color: '#059669', icon: 'MapPin' },
  { id: 'man', name: 'Man', location: 'Man', color: '#f59e0b', icon: 'Warehouse' },
  { id: 'sangouine', name: 'Sangouiné', location: 'Sangouiné', color: '#d97706', icon: 'MapPin' },
  { id: 'mahapleu', name: 'Mahapleu', location: 'Mahapleu', color: '#ef4444', icon: 'MapPin' },
  { id: 'danane', name: 'Danané', location: 'Danané', color: '#dc2626', icon: 'MapPin' },
  { id: 'zouanhounien', name: 'Zouan-Hounien', location: 'Zouan-Hounien', color: '#8b5cf6', icon: 'MapPin' },
  { id: 'binhouye', name: 'Bin-Houyé', location: 'Bin-Houyé', color: '#7c3aed', icon: 'MapPin' },
  { id: 'touba', name: 'Touba', location: 'Touba', color: '#ec4899', icon: 'MapPin' },
  { id: 'biankouman', name: 'Biankouman', location: 'Biankouman', color: '#db2777', icon: 'MapPin' },
  { id: 'facobly', name: 'Facobly', location: 'Facobly', color: '#6366f1', icon: 'MapPin' },
  { id: 'san-pedro', name: 'San Pedro', location: 'San Pedro', color: '#10b981', icon: 'Building' }
];

export const ROLE_HIERARCHY = [
  UserRole.PDG,
  UserRole.DG,
  UserRole.DAF,
  UserRole.CHEF_DE_GARE,
  UserRole.COMPTABLE,
  UserRole.DRH,
  UserRole.SERVICE_TECHNIQUE,
  UserRole.CHAUFFEUR
];
