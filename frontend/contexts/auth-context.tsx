"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authAPI } from "@/lib/api/auth-api";
import { setupAuthInterceptor } from "@/lib/api/interceptors";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setupAuthInterceptor();
    }

    const bootstrapAuth = async () => {
      try {
        if (authAPI.isAuthenticated()) {
          const apiUser = await authAPI.getCurrentUser();
          setUser(mapApiUserToUser(apiUser));
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    try {
      const apiUser = await authAPI.login(email, password);
      const mapped = mapApiUserToUser(apiUser);
      setUser(mapped);
      return mapped;
    } catch {
      setUser(null);
      return null;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<User> => {
    const apiUser = await authAPI.register(name, email, password);
    const mapped = mapApiUserToUser(apiUser);
    setUser(mapped);
    return mapped;
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

function mapApiUserToUser(apiUser: {
  id: string;
  nome: string;
  email: string;
}): User {
  return {
    id: apiUser.id,
    name: apiUser.nome,
    email: apiUser.email,
  };
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
