
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Mock data
interface Conversation {
  id: string;
  user: {
    id: string;
    displayName: string;
    photoURL: string | null;
    isOnline: boolean;
  };
  lastMessage: string;
  unread: number;
  timestamp: Date;
}

const initialConversations: Conversation[] = [
  {
    id: "dm1",
    user: { id: "u1", displayName: "Jane Smith", photoURL: null, isOnline: true },
    lastMessage: "How's the project coming along?",
    unread: 2,
    timestamp: new Date(Date.now() - 3600000 * 2) // 2 hours ago
  },
  {
    id: "dm2",
    user: { id: "u2", displayName: "John Doe", photoURL: null, isOnline: false },
    lastMessage: "Let's catch up tomorrow",
    unread: 0,
    timestamp: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    id: "dm3",
    user: { id: "u3", displayName: "Alice Johnson", photoURL: null, isOnline: true },
    lastMessage: "Thanks for the info!",
    unread: 0,
    timestamp: new Date(Date.now() - 3600000 * 5) // 5 hours ago
  }
];

const DirectMessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleNewConversation = () => {
    // In a real app, this would open a modal to select users
    toast({
      title: "Feature coming soon",
      description: "The ability to start new conversations will be available soon.",
    });
  };

  const filteredConversations = conversations.filter(conv => 
    conv.user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full">
      {/* DM Sidebar */}
      <div className="w-80 border-r border-border h-full flex flex-col bg-secondary">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold">Direct Messages</h1>
            <Button variant="ghost" size="icon" onClick={handleNewConversation}>
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mb-4">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-1">
            {filteredConversations.map(conv => (
              <Link
                key={conv.id}
                to={`/messages/${conv.id}`}
                className="flex items-center p-3 rounded-md hover:bg-accent group"
              >
                <div className="relative mr-3">
                  <Avatar>
                    {conv.user.photoURL ? (
                      <AvatarImage src={conv.user.photoURL} />
                    ) : (
                      <AvatarFallback>
                        {conv.user.displayName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span 
                    className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background ${
                      conv.user.isOnline ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium truncate">{conv.user.displayName}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground truncate pr-2">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="bg-clique-purple text-white text-xs px-2 py-0.5 rounded-full">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            
            {filteredConversations.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No conversations found
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main content area - empty state */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">Your Messages</h2>
          <p className="text-muted-foreground mb-4">Select a conversation or start a new one</p>
          <Button 
            onClick={handleNewConversation}
            className="bg-clique-purple hover:bg-clique-purple/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Conversation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DirectMessagesPage;
