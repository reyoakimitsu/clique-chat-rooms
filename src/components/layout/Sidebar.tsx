
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { Plus, User, MessageSquare, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Group {
  id: string;
  name: string;
  avatar?: string;
}

const initialGroups: Group[] = [
  { id: "g1", name: "Team Alpha", avatar: "https://ui-avatars.com/api/?name=TA&background=random" },
  { id: "g2", name: "Friends", avatar: "https://ui-avatars.com/api/?name=FR&background=random" },
  { id: "g3", name: "Family", avatar: "https://ui-avatars.com/api/?name=FA&background=random" }
];

const Sidebar: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>(initialGroups);

  const handleCreateGroup = () => {
    // This would open a modal in a real app
    const newGroupName = prompt("Enter group name:");
    if (newGroupName) {
      const newGroup = {
        id: `g${Date.now()}`,
        name: newGroupName,
        avatar: `https://ui-avatars.com/api/?name=${newGroupName.substring(0, 2)}&background=random`
      };
      setGroups([...groups, newGroup]);
      toast({
        title: "Group created!",
        description: `You've created "${newGroupName}" group.`,
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="h-screen bg-clique-dark w-20 flex-shrink-0 border-r border-border flex flex-col items-center py-4">
      {/* DM section */}
      <Link to="/messages" className="group flex flex-col items-center justify-center">
        <Button variant="ghost" size="icon" className="rounded-full mb-1 bg-clique-purple/10 hover:bg-clique-purple/20">
          <MessageSquare className="h-6 w-6 text-clique-purple" />
        </Button>
        <span className="text-xs text-muted-foreground group-hover:text-foreground">DMs</span>
      </Link>

      <Separator className="my-4 w-10 bg-clique-purple/20" />

      {/* Groups section */}
      <div className="flex flex-col items-center space-y-4 overflow-y-auto flex-grow scrollbar-hidden pb-4">
        {groups.map(group => (
          <Link 
            key={group.id} 
            to={`/groups/${group.id}`}
            className="group flex flex-col items-center justify-center"
          >
            <Avatar className="h-12 w-12 border-2 border-transparent group-hover:border-clique-purple transition-all">
              {group.avatar ? (
                <AvatarImage src={group.avatar} alt={group.name} />
              ) : (
                <AvatarFallback>
                  {group.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-xs mt-1 text-muted-foreground group-hover:text-foreground">
              {group.name.length > 8 ? `${group.name.substring(0, 8)}...` : group.name}
            </span>
          </Link>
        ))}

        <Button 
          onClick={handleCreateGroup}
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-secondary hover:bg-secondary/80 mx-auto"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <Separator className="my-4 w-10 bg-clique-purple/20" />

      {/* User section */}
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
          {currentUser?.photoURL ? (
            <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName} />
          ) : (
            <AvatarFallback className="bg-clique-purple text-white">
              {currentUser?.displayName?.substring(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          )}
        </Avatar>
      </div>
    </div>
  );
};

export default Sidebar;
