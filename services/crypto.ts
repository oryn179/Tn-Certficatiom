// Using Web Crypto API for secure hashing in the browser without external heavy libraries
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const computedHash = await hashPassword(password);
  return computedHash === hash;
};
