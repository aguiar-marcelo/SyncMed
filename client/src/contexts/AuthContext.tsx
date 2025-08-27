"use client"
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { apiBaseUrl } from "@/services/api";

type LoginResponse = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  user: { id: number; email: string; role: string };
};

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextData {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persistSession = (data: Partial<LoginResponse>) => {
    if (data.accessToken) {
      Cookies.set("accessToken", data.accessToken, {
        expires: data.accessTokenExpiresAt
          ? new Date(data.accessTokenExpiresAt)
          : undefined,
      });
      setAccessToken(data.accessToken);
    }
    if (data.accessTokenExpiresAt) {
      Cookies.set("accessTokenExpiresAt", data.accessTokenExpiresAt, {
        expires: new Date(data.accessTokenExpiresAt),
      });
    }
    if (data.refreshToken) {
      Cookies.set("refreshToken", data.refreshToken, {
        expires: data.refreshTokenExpiresAt
          ? new Date(data.refreshTokenExpiresAt)
          : undefined,
      });
      setRefreshToken(data.refreshToken);
    }
    if (data.refreshTokenExpiresAt) {
      Cookies.set("refreshTokenExpiresAt", data.refreshTokenExpiresAt, {
        expires: new Date(data.refreshTokenExpiresAt),
      });
    }
    if (data.user) {
      Cookies.set("user", JSON.stringify(data.user), {
        expires: data.accessTokenExpiresAt
          ? new Date(data.accessTokenExpiresAt)
          : undefined,
      });
      setUser(data.user);
    }
  };

  const clearSession = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    Cookies.remove("accessToken");
    Cookies.remove("accessTokenExpiresAt");
    Cookies.remove("refreshToken");
    Cookies.remove("refreshTokenExpiresAt");
    Cookies.remove("user");
  };

  const scheduleRefresh = useCallback((expiresAtIso?: string) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    if (!expiresAtIso) return;
    const exp = new Date(expiresAtIso).getTime();
    const now = Date.now();
    const skewMs = 60_000; // renova 60s antes de expirar
    const delay = Math.max(0, exp - now - skewMs);

    if (delay === 0) {
      void refresh(); // expira logo? tenta já
      return;
    }
    refreshTimerRef.current = setTimeout(() => {
      void refresh();
    }, delay);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const rt = Cookies.get("refreshToken");
      if (!rt) throw new Error("Sem refresh token");
      const res = await fetch(`${apiBaseUrl}/Auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: rt }),
      });
      if (!res.ok) throw new Error("Refresh falhou");

      const data: Partial<LoginResponse> = await res.json();

      persistSession(data);

      const newAccessExp =
        data.accessTokenExpiresAt || Cookies.get("accessTokenExpiresAt") || "";
      scheduleRefresh(newAccessExp);
      return true;
    } catch (e) {
      clearSession();
      router.push("/login");
      return false;
    }
  }, [router, scheduleRefresh]);

  useEffect(() => {
    const at = Cookies.get("accessToken");
    const atExp = Cookies.get("accessTokenExpiresAt");
    const rt = Cookies.get("refreshToken");
    const rtExp = Cookies.get("refreshTokenExpiresAt");
    const uStr = Cookies.get("user");

    if (uStr) {
      try {
        setUser(JSON.parse(uStr));
      } catch {}
    }
    if (at) setAccessToken(at);
    if (rt) setRefreshToken(rt);

    const now = Date.now();
    const atValid = at && atExp && new Date(atExp).getTime() > now;
    const rtValid = rt && rtExp && new Date(rtExp).getTime() > now;

    if (atValid) {
      scheduleRefresh(atExp!);
    } else if (rtValid) {
      void refresh();
    } else {
      router.push("/login");
    }

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [router, refresh, scheduleRefresh]);

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await fetch(`${apiBaseUrl}/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Usuário e/ou senha inválidos");
        throw new Error("Falha no login. Tente novamente.");
      }

      const data: LoginResponse = await res.json();
      persistSession(data);
      scheduleRefresh(data.accessTokenExpiresAt);

      router.push("/");
    } catch (e: any) {
      setError(e?.message || "Erro inesperado");
    }
  };

  const signOut = () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    clearSession();
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        error,
        isAuthenticated: !!accessToken && !!user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
