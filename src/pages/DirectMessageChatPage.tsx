
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ChatHeader from '@/components/messages/ChatHeader';
import ChatMessageList from '@/components/messages/ChatMessageList';
import ChatInput from '@/components/messages/ChatInput';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Mock data
interface User {
  id: string;
  displayName: string;
  photoURL: string | null;
  isOnline: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    displayName: string;
    photoURL: string | null;
  };
  timestamp: Date;
}

// Mock conversations data
const mockUsers: Record<string, User> = {
  "u1": { id: "u1", displayName: "Jane Smith", photoURL: null, isOnline: true },
  "u2": { id: "u2", displayName: "John Doe", photoURL: null, isOnline: false },
  "u3": { id: "u3", displayName: "Alice Johnson", photoURL: null, isOnline: true }
};

const mockConversations: Record<string, { userId: string; messages: Message[] }> = {
  "dm1": {
    userId: "u1",
    messages: [
      {
        id: "m1",
        content: "Hey, how's it going?",
        sender: { id: "u1", displayName: "Jane Smith", photoURL: null },
        timestamp: new Date(Date.now() - 3600000 * 5) // 5 hours ago
      },
      {
        id: "m2",
        content: "I was wondering about the project timeline.",
        sender: { id: "u1", displayName: "Jane Smith", photoURL: null },
        timestamp: new Date(Date.now() - 3600000 * 4.9) // Just after previous
      },
      {
        id: "m3",
        content: "Everything's going well! We're right on schedule.",
        sender: { id: "currentUser", displayName: "Current User", photoURL: null },
        timestamp: new Date(Date.now() - 3600000 * 4) // 4 hours ago
      },
      {
        id: "m4",
        content: "Great to hear that! How's the new feature coming along?",
        sender: { id: "u1", displayName: "Jane Smith", photoURL: null },
        timestamp: new Date(Date.now() - 3600000 * 2) // 2 hours ago
      }
    ]
  },
  "dm2": {
    userId: "u2",
    messages: [
      {
        id: "m5",
        content: "Are we still meeting tomorrow?",
        sender: { id: "currentUser", displayName: "Current User", photoURL: null },
        timestamp: new Date(Date.now() - 86400000 * 2) // 2 days ago
      },
      {
        id: "m6",
        content: "Yes, let's catch up tomorrow at 2 PM.",
        sender: { id: "u2", displayName: "John Doe", photoURL: null },
        timestamp: new Date(Date.now() - 86400000) // 1 day ago
      }
    ]
  },
  "dm3": {
    userId: "u3",
    messages: [
      {
        id: "m7",
        content: "I just sent you the information you requested.",
        sender: { id: "currentUser", displayName: "Current User", photoURL: null },
        timestamp: new Date(Date.now() - 3600000 * 6) // 6 hours ago
      },
      {
        id: "m8",
        content: "Thanks for the info!",
        sender: { id: "u3", displayName: "Alice Johnson", photoURL: null },
        timestamp: new Date(Date.now() - 3600000 * 5) // 5 hours ago
      }
    ]
  }
};

const DirectMessageChatPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const conversation = conversationId ? mockConversations[conversationId] : null;
  const otherUser = conversation ? mockUsers[conversation.userId] : null;

  useEffect(() => {
    if (conversation) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setMessages(conversation.messages.map(msg => ({
          ...msg,
          sender: msg.sender.id === "currentUser" && currentUser ? 
            { 
              id: currentUser.id, 
              displayName: currentUser.user_metadata?.display_name || currentUser.email?.split('@')[0] || 'User', 
              photoURL: currentUser.user_metadata?.avatar_url || null 
            } : 
            msg.sender
        })));
        setIsLoading(false);
      }, 800);
    }
  }, [conversation, currentUser]);

  const handleSendMessage = (content: string) => {
    if (!currentUser || !conversation) return;
    
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

  if (!conversationId || !conversation || !otherUser) {
    return <Navigate to="/messages" replace />;
  }

  const headerIcon = (
    <div className="relative">
      <Avatar className="h-8 w-8">
        {otherUser.photoURL ? (
          <AvatarImage src={otherUser.photoURL} alt={otherUser.displayName} />
        ) : (
          <AvatarFallback>
            {otherUser.displayName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
      <span 
        className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background ${
          otherUser.isOnline ? 'bg-green-500' : 'bg-gray-500'
        }`}
      />
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        name={otherUser.displayName}
        subtitle={otherUser.isOnline ? "Online" : "Offline"}
        icon={headerIcon}
      />
      <ChatMessageList messages={messages} isLoading={isLoading} />
      <ChatInput 
        onSendMessage={handleSendMessage}
        placeholder={`Message ${otherUser.displayName}...`}
      />
    </div>
  );
};

export default DirectMessageChatPage;
