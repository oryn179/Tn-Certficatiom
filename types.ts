export interface User {
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface CertificateData {
  id: string;
  name: string;
  passwordHash: string;
  createdAt: string; // ISO Date string
  issuedBy: string;
}

export interface AuthState {
  user: User | null;
  isAdmin: boolean;
  accessToken?: string;
}

// Admin configuration constants
export const ADMIN_EMAILS = [
  "oryn179@gmail.com",
  "mikiyasalemesged7@gmail.com",
  "belexmikiyas2023@gmail.com",
  "ethiounboxing@gmail.com"
];

// configuration with environment variable fallback
// NOTE: Client Secret (GOCSPX-...) must NEVER be stored in frontend code. 
// It is intended for server-side validation only.
export const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || "382584710812-cqoqasbf0uuirn5kp2hp1p21e910hj1u.apps.googleusercontent.com";