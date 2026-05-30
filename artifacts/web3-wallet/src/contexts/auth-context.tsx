import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { login as apiLogin, register as apiRegister, me as apiMe, type AuthUser } from "@/lib/auth-api";

const TOKEN_KEY = "nexa_auth_token";
const BIOMETRIC_CRED_KEY = "nexa_bio_cred";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/* ── Cookie helpers ── */
function setCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Strict`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.split("; ").find((r) => r.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Strict`;
}

/* ── WebAuthn / Biometric helpers ── */
export const isBiometricSupported = () =>
  typeof window !== "undefined" &&
  !!window.PublicKeyCredential &&
  typeof navigator.credentials?.create === "function";

function bufferToBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base64ToBuffer(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

function randomBytes(n = 32): Uint8Array {
  const arr = new Uint8Array(n);
  crypto.getRandomValues(arr);
  return arr;
}

export async function registerBiometric(userId: string, email: string): Promise<string | null> {
  if (!isBiometricSupported()) return null;
  try {
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: randomBytes(32),
        rp: { name: "NEXA Pay", id: window.location.hostname },
        user: {
          id: new TextEncoder().encode(userId),
          name: email,
          displayName: email.split("@")[0],
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },
          { alg: -257, type: "public-key" },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "preferred",
        },
        timeout: 60000,
      },
    }) as PublicKeyCredential | null;

    if (!credential) return null;
    const credId = bufferToBase64(credential.rawId);
    setCookie(BIOMETRIC_CRED_KEY, credId, COOKIE_MAX_AGE);
    return credId;
  } catch {
    return null;
  }
}

export async function authenticateWithBiometric(): Promise<boolean> {
  if (!isBiometricSupported()) return false;
  const credIdB64 = getCookie(BIOMETRIC_CRED_KEY);
  if (!credIdB64) return false;
  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: randomBytes(32),
        allowCredentials: [
          { id: base64ToBuffer(credIdB64), type: "public-key" },
        ],
        userVerification: "required",
        timeout: 60000,
      },
    });
    return !!assertion;
  } catch {
    return false;
  }
}

export function hasBiometricRegistered(): boolean {
  return !!getCookie(BIOMETRIC_CRED_KEY);
}

/* ── Context ── */
interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  enableBiometric: () => Promise<boolean>;
  loginWithBiometric: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAuthTokenGetter(() => getCookie(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY));
    return () => setAuthTokenGetter(null);
  }, []);

  useEffect(() => {
    const stored = getCookie(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    if (!stored) { setIsLoading(false); return; }
    apiMe(stored)
      .then((u) => { setToken(stored); setUser(u); })
      .catch(() => { deleteCookie(TOKEN_KEY); localStorage.removeItem(TOKEN_KEY); })
      .finally(() => setIsLoading(false));
  }, []);

  const persist = useCallback((tok: string, usr: AuthUser) => {
    setCookie(TOKEN_KEY, tok);
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
    deleteCookie(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const enableBiometric = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    const credId = await registerBiometric(user.id ?? "user", user.email);
    return !!credId;
  }, [user]);

  const loginWithBiometric = useCallback(async (): Promise<boolean> => {
    const ok = await authenticateWithBiometric();
    if (!ok) return false;
    const storedToken = getCookie(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    if (!storedToken) return false;
    try {
      const u = await apiMe(storedToken);
      setToken(storedToken);
      setUser(u);
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, enableBiometric, loginWithBiometric }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
