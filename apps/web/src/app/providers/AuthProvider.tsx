import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import {
  login as loginRequest,
  register as registerRequest,
} from "../../features/auth/api";

import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
} from "../../features/auth/types";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (input: LoginInput) => Promise<AuthResponse>;
  register: (input: RegisterInput) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  useEffect(() => {
    // We'll replace this with the real session/refresh check next.
    setIsInitializing(false);
  }, []);
  async function login(input: LoginInput) {
    const response = await loginRequest(input);

    setUser(response.user);
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);

    return response;
  }

  async function register(input: RegisterInput) {
    const response = await registerRequest(input);

    setUser(response.user);
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);

    return response;
  }

  function logout() {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  }

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(accessToken && user),
      isInitializing,

      login,
      register,
      logout,
    }),
    [user, accessToken, refreshToken, isInitializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
