
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

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

const SidebarGroupSection: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const { toast } = useToast();

  const handleCreateGroup = () => {
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

  return (
    <>
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
    </>
  );
};

export default SidebarGroupSection;
