import React, { createContext, useContext, useState } from "react";

interface User {
  email: string;
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
  const [user, setUser] = useState<User | null>({
    email: "admin@gmail.com", // 🔥 TEMP logged-in admin
  });

  const [loading] = useState(false);

  const isAdmin = user?.email === "admin@gmail.com";

  const signUp = async (email: string, _password: string) => {
    setUser({ email });
  };

  const signIn = async (email: string, _password: string) => {
    setUser({ email });
  };

  const signOut = async () => {
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
