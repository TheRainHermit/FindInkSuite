import { createContext, useContext, useState } from "react";

type ErrorContextType = {
  error: string | null;
  setError: (msg: string | null) => void;
};

const ErrorContext = createContext<ErrorContextType>({
  error: null,
  setError: () => {},
});

export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<string | null>(null);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};