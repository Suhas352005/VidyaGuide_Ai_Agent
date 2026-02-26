import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthState = {
  token: string | null;
  email: string | null;
};

type AuthContextValue = AuthState & {
  login: (token: string, email: string) => void;
  logout: () => void;
  isAuthed: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_TOKEN = 'vm_token';
const STORAGE_EMAIL = 'vm_email';

const readInitialState = (): AuthState => {
  if (typeof window === 'undefined') {
    return { token: null, email: null };
  }
  return {
    token: window.localStorage.getItem(STORAGE_TOKEN),
    email: window.localStorage.getItem(STORAGE_EMAIL)
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(readInitialState);

  const value = useMemo<AuthContextValue>(() => {
    const login = (token: string, email: string) => {
      window.localStorage.setItem(STORAGE_TOKEN, token);
      window.localStorage.setItem(STORAGE_EMAIL, email);
      setState({ token, email });
    };

    const logout = () => {
      window.localStorage.removeItem(STORAGE_TOKEN);
      window.localStorage.removeItem(STORAGE_EMAIL);
      setState({ token: null, email: null });
    };

    return {
      token: state.token,
      email: state.email,
      login,
      logout,
      isAuthed: Boolean(state.token)
    };
  }, [state.token, state.email]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

