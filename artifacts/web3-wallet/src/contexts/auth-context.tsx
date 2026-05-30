import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { login as apiLogin, register as apiRegister, me as apiMe, type AuthUser } from "@/lib/auth-api";

const TOKEN_KEY = "nexa_auth_token";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Register the token getter so all API calls include Authorization header
  useEffect(() => {
    setAuthTokenGetter(() => localStorage.getItem(TOKEN_KEY));
    return () => setAuthTokenGetter(null);
  }, []);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) { setIsLoading(false); return; }
    apiMe(stored)
      .then((u) => {
        setToken(stored);
        setUser(u);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const persist = useCallback((tok: string, usr: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, tok);
    setToken(tok);
    setUser(usr);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    persist(res.token, res.user);
  }, [persist]);

  const register = useCallback(async (email: string, password: string) => {
    const res = await apiRegister(email, password);
    persist(res.token, res.user);
  }, [persist]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
