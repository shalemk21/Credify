export type UserRole = 'employer' | 'admin';

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  designation?: string;
  avatar?: string;
  token?: string;
  loginTime: string;
}

export const DEMO_ACCOUNTS = {
  employer: {
    id: 'emp-arun-01',
    role: 'employer' as UserRole,
    name: 'Arun Bhat',
    email: 'employer@credify.in',
    phone: '+91 98450 11223',
    organization: 'ABC Contractors, Bengaluru',
    designation: 'Project & Hiring Manager',
    avatar: 'AB',
    defaultPassword: 'password123',
  },
  admin: {
    id: 'adm-sunita-01',
    role: 'admin' as UserRole,
    name: 'Dr. Sunita Rao',
    email: 'admin@credify.in',
    phone: '+91 99000 88776',
    organization: 'Credify Verification Directorate',
    designation: 'Senior Trust Assessor & Governance Director',
    avatar: 'SR',
    securityPin: '882200',
    defaultPassword: 'admin123',
  },
};

const STORAGE_KEY = 'credify_auth_user';

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to store auth user', err);
  }
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear auth user', err);
  }
}
