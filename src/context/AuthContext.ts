import { createContext } from "react";

type User = {
  id: string;
  email: string;
  role?: string;
};

export type AuthContextType = {
  user: User | null;
  jwt: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean; 
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);