import { UserRole, Gare } from './types';

export const GARES: Gare[] = [
  { id: 'adjame', name: 'Adjamé', location: 'Abidjan' },
  { id: 'yopougon', name: 'Yopougon', location: 'Abidjan' },
  { id: 'duekoue', name: 'Duékoué', location: 'Duékoué' },
  { id: 'bangolo', name: 'Bangolo', location: 'Bangolo' },
  { id: 'man', name: 'Man', location: 'Man' },
  { id: 'sangouine', name: 'Sangouiné', location: 'Sangouiné' },
  { id: 'mahapleu', name: 'Mahapleu', location: 'Mahapleu' },
  { id: 'danane', name: 'Danané', location: 'Danané' },
  { id: 'zouanhounien', name: 'Zouan-Hounien', location: 'Zouan-Hounien' },
  { id: 'binhouye', name: 'Bin-Houyé', location: 'Bin-Houyé' },
  { id: 'touba', name: 'Touba', location: 'Touba' },
  { id: 'biankouman', name: 'Biankouman', location: 'Biankouman' },
  { id: 'facobly', name: 'Facobly', location: 'Facobly' }
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
