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
import { ApiError } from "@/lib/api/api-errors";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função para definir cookie
function setCookie(name: string, value: string, days: number = 7) {
  if (typeof window !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }
}

// Função para remover cookie
function removeCookie(name: string) {
  if (typeof window !== "undefined") {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
}

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
        // Remover cookie se a autenticação falhar
        removeCookie("access_token");
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const apiUser = await authAPI.login(email, password);
      const mapped = mapApiUserToUser(apiUser);
      setUser(mapped);

      // Definir cookie para o middleware usando o token armazenado
      const token = authAPI.getToken();
      if (token) {
        setCookie("access_token", token);
      }

      return { success: true };
    } catch (error) {
      setUser(null);
      removeCookie("access_token");

      let errorMessage = "Erro durante o login. Tente novamente.";
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const apiUser = await authAPI.register(name, email, password);
      const mapped = mapApiUserToUser(apiUser);
      setUser(mapped);
      return { success: true };
    } catch (error) {
      let errorMessage = "Erro durante o registro. Tente novamente.";
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    removeCookie("access_token");
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
