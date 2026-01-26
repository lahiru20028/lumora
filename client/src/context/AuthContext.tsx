import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  email: string;
  role?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Read user from localStorage on mount and when it changes
  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();

    // Listen for storage changes (when login happens in another tab/window)
    window.addEventListener('storage', loadUser);
    
    // Also check periodically for localStorage changes (same tab)
    const interval = setInterval(loadUser, 1000);

    return () => {
      window.removeEventListener('storage', loadUser);
      clearInterval(interval);
    };
  }, []);

  const isAdmin = user?.role === 'admin';

  const signUp = async (email: string, _password: string) => {
    // This is handled by Register page which sets localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const signIn = async (email: string, _password: string) => {
    // This is handled by Login page which sets localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const signOut = async () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
