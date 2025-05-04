
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define types for our auth context
interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication for now (will be replaced with Firebase/Convex)
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    const storedUser = localStorage.getItem('clique_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
    setLoading(false);
  }, []);

  // Mock sign in function
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, we'll create a mock user
    const mockUser: User = {
      id: `user_${Math.random().toString(36).substring(2, 9)}`,
      email: email,
      displayName: email.split('@')[0],
      photoURL: null
    };
    
    setCurrentUser(mockUser);
    localStorage.setItem('clique_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  // Mock sign up function
  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a mock user
    const mockUser: User = {
      id: `user_${Math.random().toString(36).substring(2, 9)}`,
      email: email,
      displayName: displayName || email.split('@')[0],
      photoURL: null
    };
    
    setCurrentUser(mockUser);
    localStorage.setItem('clique_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  // Mock sign out function
  const signOut = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCurrentUser(null);
    localStorage.removeItem('clique_user');
    setLoading(false);
  };

  // Mock update profile function
  const updateProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser = {
      ...currentUser,
      ...data
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('clique_user', JSON.stringify(updatedUser));
    setLoading(false);
  };

  const value = {
    currentUser,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
