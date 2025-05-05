
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatHeader from '@/components/messages/ChatHeader';
import ChatMessageList from '@/components/messages/ChatMessageList';
import ChatInput from '@/components/messages/ChatInput';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

// Mock messages data
const generateMockMessages = (channelId: string) => {
  const users = [
    { id: 'u1', displayName: 'Jane Smith', photoURL: null },
    { id: 'u2', displayName: 'John Doe', photoURL: null },
    { id: 'u3', displayName: 'Alice Johnson', photoURL: null },
  ];

  const baseDate = new Date();
  const hourInMillis = 3600000;

  const messages = [];
  const messageCount = 15 + Math.floor(Math.random() * 10);
  
  for (let i = 0; i < messageCount; i++) {
    const user = users[i % users.length];
    const timestamp = new Date(baseDate.getTime() - (messageCount - i) * hourInMillis / 4);
    
    messages.push({
      id: `msg_${channelId}_${i}`,
      content: `This is a sample message ${i + 1} in channel. It might be a bit longer to show how text wraps in the design.`,
      sender: user,
      timestamp,
    });
  }

  return messages;
};

// Mock function to get channel name
const getChannelInfo = (channelId: string) => {
  const channels = {
    "c1": { name: "general", groupId: "g1", groupName: "Team Alpha" },
    "c2": { name: "random", groupId: "g1", groupName: "Team Alpha" },
    "c3": { name: "important", groupId: "g1", groupName: "Team Alpha" },
    "c4": { name: "hangouts", groupId: "g2", groupName: "Friends" },
    "c5": { name: "movies", groupId: "g2", groupName: "Friends" },
    "c6": { name: "home", groupId: "g3", groupName: "Family" },
    "c7": { name: "vacation-plans", groupId: "g3", groupName: "Family" },
  };
  
  return channels[channelId as keyof typeof channels];
};

const ChannelPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { channelId } = useParams<{ channelId: string; groupId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const channelInfo = channelId ? getChannelInfo(channelId) : null;

  useEffect(() => {
    if (channelId) {
      setIsLoading(true);
      
      // Simulate API call to load messages
      setTimeout(() => {
        const mockMessages = generateMockMessages(channelId);
        setMessages(mockMessages);
        setIsLoading(false);
      }, 1000);
    }
  }, [channelId]);

  const handleSendMessage = (content: string) => {
    if (!currentUser) return;
    
    const newMessage = {
      id: `msg_${Date.now()}`,
      content,
      sender: {
        id: currentUser.id,
        displayName: currentUser.user_metadata?.display_name || currentUser.email?.split('@')[0] || 'User',
        photoURL: currentUser.user_metadata?.avatar_url || null,
      },
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // In a real app, we would send this to the server
  };

  if (!channelId || !channelInfo) {
    return <div className="p-4">Channel not found</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        name={`#${channelInfo.name}`} 
        subtitle={`Channel in ${channelInfo.groupName}`}
      />
      <ChatMessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChannelPage;
