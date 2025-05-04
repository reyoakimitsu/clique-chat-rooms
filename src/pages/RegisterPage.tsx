
import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/messages" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-clique-purple mb-2">Clique</h1>
        <p className="text-muted-foreground">Join our private messaging platform</p>
      </div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
