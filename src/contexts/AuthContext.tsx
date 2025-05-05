
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Define types for our auth context
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
  isAuthenticated: boolean;
  session: Session | null;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setCurrentUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: 'Signed in',
            description: 'You have successfully signed in.',
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: 'Signed out',
            description: 'You have been signed out.',
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setCurrentUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      // The session will be updated by onAuthStateChange
    } catch (error) {
      console.error('Sign in error:', error);
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });
      
      if (error) {
        toast({
          title: 'Sign up failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      toast({
        title: 'Account created',
        description: 'Your account has been created successfully.',
      });
      
      // The session will be updated by onAuthStateChange
    } catch (error) {
      console.error('Sign up error:', error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: 'Sign out failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      // The session will be updated by onAuthStateChange
    } catch (error) {
      console.error('Sign out error:', error);
      setLoading(false);
      throw error;
    }
  };

  const updateProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Update auth metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          display_name: data.displayName,
          avatar_url: data.photoURL,
        },
      });
      
      if (updateError) throw updateError;

      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: data.displayName,
          avatar_url: data.photoURL,
        })
        .eq('id', currentUser.id);

      if (profileError) throw profileError;

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      
      // Refresh user data
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setCurrentUser(currentSession?.user ?? null);
      
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: 'Profile update failed',
        description: 'Failed to update your profile.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!currentUser,
    session,
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
