
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Mock function to get group info
const getGroupInfo = (groupId: string) => {
  const groups = {
    "g1": { 
      name: "Team Alpha", 
      description: "A team focused on building great products",
      memberCount: 3,
      channelCount: 3
    },
    "g2": { 
      name: "Friends", 
      description: "A group for close friends",
      memberCount: 2,
      channelCount: 2
    },
    "g3": { 
      name: "Family", 
      description: "Family chat group",
      memberCount: 3,
      channelCount: 2
    }
  };
  
  return groups[groupId as keyof typeof groups];
};

const GroupHomePage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  
  const groupInfo = groupId ? getGroupInfo(groupId) : null;

  if (!groupId || !groupInfo) {
    return <div className="p-4">Group not found</div>;
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{groupInfo.name}</h1>
          <p className="text-muted-foreground">{groupInfo.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-secondary p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Group Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-background rounded-md">
                <p className="text-3xl font-bold text-clique-purple">{groupInfo.memberCount}</p>
                <p className="text-sm text-muted-foreground">Members</p>
              </div>
              <div className="text-center p-4 bg-background rounded-md">
                <p className="text-3xl font-bold text-clique-purple">{groupInfo.channelCount}</p>
                <p className="text-sm text-muted-foreground">Channels</p>
              </div>
            </div>
          </div>
          
          <div className="bg-secondary p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-2">#</span> general
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Invite People
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Group Settings
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-secondary p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Welcome to {groupInfo.name}</h2>
          <p className="text-muted-foreground mb-4">
            This is the home page for your group. Select a channel from the sidebar to start chatting
            with other members.
          </p>
          <p className="text-muted-foreground">
            Need to adjust settings or invite new members? Use the options at the bottom of the sidebar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GroupHomePage;
