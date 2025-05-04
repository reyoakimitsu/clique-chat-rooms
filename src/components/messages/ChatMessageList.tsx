
import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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

interface ChatMessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 p-4 overflow-y-auto flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 p-4 overflow-y-auto flex items-center justify-center">
        <div className="text-muted-foreground">No messages yet. Start the conversation!</div>
      </div>
    );
  }

  // Group messages by sender
  const groupedMessages: Message[][] = [];
  let currentGroup: Message[] = [];
  
  messages.forEach((message, index) => {
    if (index === 0 || messages[index - 1].sender.id !== message.sender.id) {
      if (currentGroup.length > 0) {
        groupedMessages.push(currentGroup);
      }
      currentGroup = [message];
    } else {
      currentGroup.push(message);
    }
  });
  
  if (currentGroup.length > 0) {
    groupedMessages.push(currentGroup);
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto message-container">
      <div className="space-y-6">
        {groupedMessages.map((group, groupIndex) => (
          <div key={`group-${groupIndex}`} className="flex space-x-3">
            <div className="flex-shrink-0 mt-1">
              <Avatar>
                {group[0].sender.photoURL ? (
                  <AvatarImage src={group[0].sender.photoURL} alt={group[0].sender.displayName} />
                ) : (
                  <AvatarFallback>
                    {group[0].sender.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{group[0].sender.displayName}</span>
                <span className="text-xs text-muted-foreground">
                  {formatTime(group[0].timestamp)}
                </span>
              </div>
              
              <div className="space-y-1 mt-1">
                {group.map(message => (
                  <div key={message.id} className="text-sm">
                    {message.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessageList;
