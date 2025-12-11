import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, ADMIN_EMAILS, GOOGLE_CLIENT_ID } from '../types';

interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Declare google global for TypeScript
declare global {
  interface Window {
    google?: any;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    accessToken: undefined,
  });

  // Check localStorage for persisted session
  useEffect(() => {
    const storedUser = localStorage.getItem('tenanet_user');
    const storedToken = localStorage.getItem('tenanet_token');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState({
          user,
          isAdmin: ADMIN_EMAILS.includes(user.email),
          accessToken: storedToken || undefined,
        });
      } catch (e) {
        console.error("Failed to parse user session", e);
        localStorage.removeItem('tenanet_user');
        localStorage.removeItem('tenanet_token');
      }
    }
  }, []);

  const waitForGoogleScript = (retries = 20): Promise<void> => {
    return new Promise((resolve, reject) => {
       if (window.google && window.google.accounts) {
         resolve();
         return;
       }
       
       if (retries === 0) {
         // Attempt to inject script if missing after retries
         const script = document.createElement('script');
         script.src = "https://accounts.google.com/gsi/client";
         script.async = true;
         script.defer = true;
         script.onload = () => resolve();
         script.onerror = () => reject(new Error("Failed to load Google Identity Services script"));
         document.head.appendChild(script);
         return;
       }

       setTimeout(() => {
         waitForGoogleScript(retries - 1).then(resolve).catch(reject);
       }, 200);
    });
  };

  const login = async () => {
    try {
      await waitForGoogleScript();
    } catch (e) {
      console.error("Google Identity Services script not loaded.");
      alert("Security System Error: Unable to load Google authentication module. Please check your internet connection or ad-blockers.");
      throw new Error("GIS_NOT_LOADED");
    }

    return new Promise<void>((resolve, reject) => {
      try {
        // Initialize the Token Client (OAuth 2.0 Implicit Flow)
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: async (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                // Store token for session management/revocation
                localStorage.setItem('tenanet_token', tokenResponse.access_token);

                // Fetch user details using the access token
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: {
                    'Authorization': `Bearer ${tokenResponse.access_token}`
                  }
                });
                
                if (!userInfoResponse.ok) {
                  throw new Error('Failed to fetch user profile');
                }

                const profile = await userInfoResponse.json();
                
                const newUser: User = {
                  email: profile.email,
                  name: profile.name,
                  avatarUrl: profile.picture
                };

                localStorage.setItem('tenanet_user', JSON.stringify(newUser));
                
                setState({
                  user: newUser,
                  isAdmin: ADMIN_EMAILS.includes(newUser.email),
                  accessToken: tokenResponse.access_token,
                });
                
                resolve();
              } catch (error) {
                console.error("Authentication Error:", error);
                localStorage.removeItem('tenanet_token');
                reject(error);
              }
            } else {
              reject(new Error("No access token received"));
            }
          },
          error_callback: (nonOAuthError: any) => {
            console.error("Non-OAuth Error:", nonOAuthError);
            reject(nonOAuthError);
          }
        });

        // Trigger the pop-up
        client.requestAccessToken();
      } catch (err) {
        console.error("Error initializing Google Token Client:", err);
        reject(err);
      }
    });
  };

  const logout = () => {
    // Revoke token if it exists to ensure complete logout from Google perspective for this app
    if (state.accessToken && window.google && window.google.accounts) {
      try {
        window.google.accounts.oauth2.revoke(state.accessToken, () => {
          console.log('Token revoked');
        });
      } catch (e) {
        console.warn("Failed to revoke token:", e);
      }
    }

    localStorage.removeItem('tenanet_user');
    localStorage.removeItem('tenanet_token');
    
    setState({
      user: null,
      isAdmin: false,
      accessToken: undefined,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};