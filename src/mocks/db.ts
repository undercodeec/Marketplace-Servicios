// ====================================================================
// ArtoCamello — Mock Database (localStorage-backed)
// ====================================================================
// Este módulo sólo se mantiene para datos de seed (categorías, perfiles).
// La lógica de pagos y leads usa la API real (server/src/index.ts).
// ====================================================================

import {
  User, ClientProfile, ProfessionalProfile, ServiceCategory,
  ServiceRequest, LeadPurchase, Quote, Review, Notification,
  UserRole, RequestStatus, LeadPurchaseStatus, QuoteStatus,
  UrgencyLevel,
} from '../domain/types';

const STORAGE_KEY = 'artocamello_db';

// --------------- Seed Data ---------------

const SEED_CATEGORIES: ServiceCategory[] = [
  { id: 'cat-1',  slug: 'fontaneria',    name: 'Fontanería',    icon: 'Wrench',      description: 'Reparaciones, instalaciones y mantenimiento de tuberías y grifería.' },
  { id: 'cat-2',  slug: 'electricidad',  name: 'Electricidad',  icon: 'Zap',         description: 'Instalaciones eléctricas, reparaciones y certificados.' },
  { id: 'cat-3',  slug: 'pintura',       name: 'Pintura',       icon: 'Paintbrush',  description: 'Pintura interior, exterior, decorativa y lacado.' },
  { id: 'cat-4',  slug: 'limpieza',      name: 'Limpieza',      icon: 'Brush',       description: 'Limpieza de hogares, oficinas y fin de obra.' },
  { id: 'cat-5',  slug: 'mudanzas',      name: 'Mudanzas',      icon: 'Truck',       description: 'Mudanzas locales, nacionales y guardamuebles.' },
  { id: 'cat-6',  slug: 'reformas',      name: 'Reformas',      icon: 'Hammer',      description: 'Reformas integrales, parciales, baños y cocinas.' },
  { id: 'cat-7',  slug: 'carpinteria',   name: 'Carpintería',   icon: 'Hammer',      description: 'Muebles a medida, puertas, ventanas y reparación.' },
  { id: 'cat-8',  slug: 'jardineria',    name: 'Jardinería',    icon: 'TreePine',    description: 'Diseño de jardines, mantenimiento y poda.' },
  { id: 'cat-9',  slug: 'cerrajeria',    name: 'Cerrajería',    icon: 'Key',         description: 'Apertura de puertas, cambio de cerraduras y seguridad.' },
  { id: 'cat-10', slug: 'climatizacion', name: 'Climatización', icon: 'Thermometer', description: 'Instalación y reparación de aire acondicionado y calefacción.' },
];

const SEED_USERS: User[] = [
  { id: 'user-client-1', email: 'cliente@artocamello.com', password: 'password123', role: UserRole.CLIENT,       fullName: 'María García López', phone: '+593 99 123 4567', createdAt: '2026-03-01T10:00:00Z' },
  { id: 'user-client-2', email: 'carlos@artocamello.com',  password: 'password123', role: UserRole.CLIENT,       fullName: 'Carlos Rodríguez',   phone: '+593 98 765 4321', createdAt: '2026-03-05T12:00:00Z' },
  { id: 'user-pro-1',    email: 'pro@artocamello.com',     password: 'password123', role: UserRole.PROFESSIONAL, fullName: 'Juan Profesional',   phone: '+593 99 888 7777', createdAt: '2026-02-15T08:00:00Z' },
  { id: 'user-pro-2',    email: 'ana.pro@artocamello.com', password: 'password123', role: UserRole.PROFESSIONAL, fullName: 'Ana Torres',         phone: '+593 97 111 2222', createdAt: '2026-02-20T09:00:00Z' },
];

const SEED_CLIENT_PROFILES: ClientProfile[] = [
  { userId: 'user-client-1', addresses: ['Quito, Cumbayá', 'Quito, Norte'], preferredCategories: ['fontaneria', 'electricidad'] },
  { userId: 'user-client-2', addresses: ['Valle de los Chillos'],            preferredCategories: ['pintura', 'reformas'] },
];

const SEED_PRO_PROFILES: ProfessionalProfile[] = [
  {
    userId: 'user-pro-1', businessName: 'Servicios Juan Pro',
    bio: 'Fontanero profesional con más de 10 años de experiencia.',
    categories: ['fontaneria', 'cerrajeria'], serviceZones: ['Quito', 'Cumbayá'],
    experienceYears: 10, portfolioImages: [], rating: 4.8, reviewCount: 24, verified: true, completedJobs: 35,
  },
  {
    userId: 'user-pro-2', businessName: 'ElectriFix',
    bio: 'Electricista certificada. Instalaciones, reparaciones y certificados.',
    categories: ['electricidad', 'climatizacion'], serviceZones: ['Quito', 'Cumbayá'],
    experienceYears: 7, portfolioImages: [], rating: 4.9, reviewCount: 18, verified: true, completedJobs: 28,
  },
];

const SEED_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-001', clientId: 'user-client-1', categorySlug: 'fontaneria',
    title: 'Reparación de fuga de agua en lavabo',
    description: 'El tubo debajo del lavabo está goteando constantemente. Necesito alguien que lo repare hoy mismo.',
    location: 'Quito, Sector La Carolina', urgency: UrgencyLevel.HIGH, status: RequestStatus.CONTACT_LIMIT_OPEN,
    contactPhone: '+593 99 123 4567', contactEmail: 'cliente@artocamello.com',
    estimatedBudget: 80, purchaseCount: 1, createdAt: '2026-04-08T09:30:00Z', updatedAt: '2026-04-08T09:30:00Z',
  },
  {
    id: 'req-002', clientId: 'user-client-2', categorySlug: 'limpieza',
    title: 'Limpieza profunda de oficina',
    description: 'Oficina de 120m2 necesita limpieza profunda, incluyendo alfombras y ventanas.',
    location: 'Quito, Norte', urgency: UrgencyLevel.MEDIUM, status: RequestStatus.MATCHING,
    contactPhone: '+593 98 765 4321', contactEmail: 'carlos@artocamello.com',
    estimatedBudget: 200, purchaseCount: 0, createdAt: '2026-04-08T11:00:00Z', updatedAt: '2026-04-08T11:00:00Z',
  },
];

const SEED_LEAD_PURCHASES: LeadPurchase[] = [
  {
    id: 'lp-001', requestId: 'req-001', professionalId: 'user-pro-1',
    costUSD: 4.80, status: LeadPurchaseStatus.PAID, purchasedAt: '2026-04-08T09:45:00Z',
  },
];

const SEED_QUOTES: Quote[] = [
  {
    id: 'q-001', requestId: 'req-001', professionalId: 'user-pro-1',
    message: 'Puedo ir hoy mismo a las 14:00. Traigo todas las herramientas necesarias.',
    estimatedPrice: 45, estimatedDays: 1, status: QuoteStatus.SENT, createdAt: '2026-04-08T10:00:00Z',
  },
];

const SEED_REVIEWS: Review[] = [
  {
    id: 'rev-001', requestId: 'req-001', clientId: 'user-client-1', professionalId: 'user-pro-1',
    rating: 5, comment: 'Excelente trabajo. Terminó antes de tiempo.', createdAt: '2026-04-06T20:00:00Z',
  },
];

const SEED_NOTIFICATIONS: Notification[] = [
  { id: 'notif-1', userId: 'user-pro-1', title: '¡Nuevos trabajos en tu zona!', message: 'Hay 3 nuevas solicitudes de Fontanería en Quito Norte.', link: '/dashboard/contacts', read: false, createdAt: '2026-04-08T10:00:00Z' },
];

// --------------- Database Interface ---------------

export interface MockDB {
  users: User[];
  clientProfiles: ClientProfile[];
  proProfiles: ProfessionalProfile[];
  categories: ServiceCategory[];
  requests: ServiceRequest[];
  leadPurchases: LeadPurchase[];
  quotes: Quote[];
  reviews: Review[];
  notifications: Notification[];
}

function createSeedDB(): MockDB {
  return {
    users: [...SEED_USERS],
    clientProfiles: [...SEED_CLIENT_PROFILES],
    proProfiles: [...SEED_PRO_PROFILES],
    categories: [...SEED_CATEGORIES],
    requests: [...SEED_REQUESTS],
    leadPurchases: [...SEED_LEAD_PURCHASES],
    quotes: [...SEED_QUOTES],
    reviews: [...SEED_REVIEWS],
    notifications: [...SEED_NOTIFICATIONS],
  };
}

// --------------- Persistence Layer ---------------

function loadDB(): MockDB {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MockDB;
  } catch { /* corrupt data, re-seed */ }
  const db = createSeedDB();
  saveDB(db);
  return db;
}

function saveDB(db: MockDB): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

// Singleton
let _db: MockDB | null = null;

export function getDB(): MockDB {
  if (!_db) _db = loadDB();
  return _db;
}

export function updateDB(updater: (db: MockDB) => void): MockDB {
  const db = getDB();
  updater(db);
  saveDB(db);
  return db;
}

export function resetDB(): MockDB {
  _db = createSeedDB();
  saveDB(_db);
  return _db;
}

// Helper to get a fresh unique ID
let _counter = Date.now();
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${(++_counter).toString(36)}`;
}
