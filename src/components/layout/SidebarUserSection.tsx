
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SidebarUserSection: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="mt-auto flex flex-col items-center space-y-4">
      <Link to="/profile" className="group flex flex-col items-center justify-center">
        <Button variant="ghost" size="icon" className="rounded-full mb-1 bg-clique-purple/10 hover:bg-clique-purple/20">
          <User className="h-6 w-6 text-clique-purple" />
        </Button>
        <span className="text-xs text-muted-foreground group-hover:text-foreground">Profile</span>
      </Link>
      
      <Link to="/settings" className="group flex flex-col items-center justify-center">
        <Button variant="ghost" size="icon" className="rounded-full mb-1 bg-clique-purple/10 hover:bg-clique-purple/20">
          <Settings className="h-6 w-6 text-clique-purple" />
        </Button>
        <span className="text-xs text-muted-foreground group-hover:text-foreground">Settings</span>
      </Link>

      <Avatar 
        className="cursor-pointer border-2 border-transparent hover:border-clique-purple transition-all"
        onClick={handleSignOut}
      >
        {currentUser?.user_metadata?.avatar_url ? (
          <AvatarImage src={currentUser.user_metadata.avatar_url} alt={currentUser.user_metadata.display_name || 'User'} />
        ) : (
          <AvatarFallback className="bg-clique-purple text-white">
            {currentUser?.user_metadata?.display_name?.substring(0, 2)?.toUpperCase() || currentUser?.email?.substring(0, 2)?.toUpperCase() || 'U'}
          </AvatarFallback>
        )}
      </Avatar>
    </div>
  );
};

export default SidebarUserSection;
