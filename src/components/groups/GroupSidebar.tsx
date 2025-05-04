
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Settings, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

// Mock data
interface Channel {
  id: string;
  name: string;
}

interface GroupInfo {
  id: string;
  name: string;
  avatar: string;
  isAdmin: boolean;
  channels: Channel[];
  members: {
    id: string;
    displayName: string;
    photoURL: string | null;
    isOnline: boolean;
  }[];
}

const mockGroupData: Record<string, GroupInfo> = {
  "g1": {
    id: "g1",
    name: "Team Alpha",
    avatar: "https://ui-avatars.com/api/?name=TA&background=random",
    isAdmin: true,
    channels: [
      { id: "c1", name: "general" },
      { id: "c2", name: "random" },
      { id: "c3", name: "important" }
    ],
    members: [
      { id: "u1", displayName: "Jane Smith", photoURL: null, isOnline: true },
      { id: "u2", displayName: "John Doe", photoURL: null, isOnline: false },
      { id: "u3", displayName: "Alice Johnson", photoURL: null, isOnline: true }
    ]
  },
  "g2": {
    id: "g2",
    name: "Friends",
    avatar: "https://ui-avatars.com/api/?name=FR&background=random",
    isAdmin: true,
    channels: [
      { id: "c4", name: "hangouts" },
      { id: "c5", name: "movies" }
    ],
    members: [
      { id: "u4", displayName: "Mike Williams", photoURL: null, isOnline: false },
      { id: "u5", displayName: "Sarah Davis", photoURL: null, isOnline: true }
    ]
  },
  "g3": {
    id: "g3",
    name: "Family",
    avatar: "https://ui-avatars.com/api/?name=FA&background=random",
    isAdmin: false,
    channels: [
      { id: "c6", name: "home" },
      { id: "c7", name: "vacation-plans" }
    ],
    members: [
      { id: "u6", displayName: "Dad", photoURL: null, isOnline: false },
      { id: "u7", displayName: "Mom", photoURL: null, isOnline: true },
      { id: "u8", displayName: "Sister", photoURL: null, isOnline: false }
    ]
  }
};

const GroupSidebar: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [showMembers, setShowMembers] = useState(false);

  if (!groupId || !mockGroupData[groupId]) {
    return <div className="p-4">Group not found</div>;
  }

  const group = mockGroupData[groupId];

  const handleCreateChannel = () => {
    if (!group.isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only group admins can create channels",
        variant: "destructive"
      });
      return;
    }

    // This would open a modal in a real app
    const newChannelName = prompt("Enter channel name:");
    if (newChannelName) {
      // In a real app, we would add this to the database
      toast({
        title: "Channel created!",
        description: `You've created "${newChannelName}" channel.`
      });
    }
  };

  const handleInviteMember = () => {
    if (!group.isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only group admins can invite members",
        variant: "destructive"
      });
      return;
    }

    // Mock invite link generation
    const inviteLink = `https://clique.example/invite/${groupId}/${Math.random().toString(36).substring(2, 15)}`;
    
    // In a real app, we would copy to clipboard or show a modal
    toast({
      title: "Invite link generated!",
      description: "Invite link has been copied to clipboard."
    });
  };

  return (
    <div className="h-screen w-64 bg-secondary flex flex-col border-r border-border">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={group.avatar} alt={group.name} />
            <AvatarFallback>{group.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h2 className="font-bold truncate">{group.name}</h2>
        </div>
        {group.isAdmin && (
          <Button variant="ghost" size="icon" onClick={handleInviteMember}>
            <Users className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator className="bg-border" />

      <div className="overflow-y-auto flex-grow scrollbar-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">CHANNELS</h3>
            {group.isAdmin && (
              <Button variant="ghost" size="icon" onClick={handleCreateChannel} className="h-5 w-5">
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          <div className="space-y-1">
            {group.channels.map(channel => (
              <Link
                key={channel.id}
                to={`/groups/${groupId}/channels/${channel.id}`}
                className="block px-2 py-1.5 rounded-md text-sm hover:bg-clique-purple/10 hover:text-clique-purple"
              >
                # {channel.name}
              </Link>
            ))}
          </div>
        </div>

        <Separator className="mx-4 bg-border my-2" />

        <div className="p-4">
          <button 
            onClick={() => setShowMembers(!showMembers)}
            className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <span>MEMBERS • {group.members.length}</span>
            <span>{showMembers ? '▼' : '►'}</span>
          </button>
          
          {showMembers && (
            <div className="mt-2 space-y-2">
              {group.members.map(member => (
                <div key={member.id} className="flex items-center space-x-2">
                  <div className="relative">
                    <Avatar className="h-6 w-6">
                      {member.photoURL ? (
                        <AvatarImage src={member.photoURL} alt={member.displayName} />
                      ) : (
                        <AvatarFallback className="text-xs">
                          {member.displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span 
                      className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background ${
                        member.isOnline ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    />
                  </div>
                  <span className="text-sm truncate">
                    {member.displayName}
                    {member.id === currentUser?.id && " (you)"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {group.isAdmin && (
        <div className="p-4 mt-auto border-t border-border">
          <Link to={`/groups/${groupId}/settings`}>
            <Button variant="outline" size="sm" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Group Settings
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default GroupSidebar;
