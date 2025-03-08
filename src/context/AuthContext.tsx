import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User, AuthContextType } from '../types';

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Create a default demo user
  const demoUser: User = {
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@example.com',
  };

  const [user, setUser] = useState<User | null>(demoUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // No need to check localStorage - we're automatically logged in
  useEffect(() => {
    setIsLoading(false);
  }, []);
  
  // These functions are just stubs now since we're automatically authenticated
  const login = async (email: string, password: string) => {
    return Promise.resolve();
  };
  
  const register = async (name: string, email: string, password: string) => {
    return Promise.resolve();
  };
  
  // Logout function (won't actually log out now)
  const logout = () => {
    // No action needed - we stay logged in
  };
  
  // Provide the context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: true, // Always authenticated
    isLoading,
    error,
    login,
    register,
    logout,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 