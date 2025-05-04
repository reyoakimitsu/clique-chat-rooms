
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface ChatHeaderProps {
  name: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ name, subtitle, icon }) => {
  return (
    <div className="border-b border-border p-4 bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon}
          <div>
            <h2 className="font-semibold">{name}</h2>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
