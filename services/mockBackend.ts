import { CertificateData, ADMIN_EMAILS } from '../types';
import { hashPassword } from './crypto';

const STORAGE_KEY = 'tenanet_certificates_db';

// Initialize DB with some dummy data if empty
const initDB = async () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const defaultCert: CertificateData = {
      id: 'init-demo-1',
      name: 'John Doe',
      passwordHash: await hashPassword('password123'),
      createdAt: new Date().toISOString(),
      issuedBy: 'ORYN - Company CEO'
    };
    
    // Seed a cert for the default mock user 'CTF Player' so the profile isn't empty
    const playerCert: CertificateData = {
      id: 'init-demo-2',
      name: 'CTF Player',
      passwordHash: await hashPassword('ctf123'),
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      issuedBy: 'ORYN - Company CEO'
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultCert, playerCert]));
  }
};

initDB();

export const BackendService = {
  // --- Admin Methods ---

  getAllCertificates: async (): Promise<CertificateData[]> => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  addCertificate: async (name: string, plainPassword: string): Promise<void> => {
    const certs = await BackendService.getAllCertificates();
    const passwordHash = await hashPassword(plainPassword);
    
    const newCert: CertificateData = {
      id: crypto.randomUUID(),
      name,
      passwordHash,
      createdAt: new Date().toISOString(),
      issuedBy: 'ORYN - Company CEO'
    };
    
    certs.push(newCert);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certs));
  },

  deleteCertificate: async (id: string): Promise<void> => {
    let certs = await BackendService.getAllCertificates();
    certs = certs.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certs));
  },

  // --- User Methods ---

  findCertificateByPassword: async (password: string): Promise<CertificateData | null> => {
    const certs = await BackendService.getAllCertificates();
    const targetHash = await hashPassword(password);
    
    // Find the certificate where the hash matches
    const found = certs.find(c => c.passwordHash === targetHash);
    return found || null;
  },

  findCertificatesByName: async (name: string): Promise<CertificateData[]> => {
    const certs = await BackendService.getAllCertificates();
    // Simple case-insensitive match.
    return certs.filter(c => c.name.toLowerCase() === name.toLowerCase());
  }
};
