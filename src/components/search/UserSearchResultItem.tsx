
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UserResultItemProps {
  user: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
    last_online: string | null;
  };
  formatLastOnline: (timestamp: string | null) => string;
  onClick: () => void;
}

const UserSearchResultItem: React.FC<UserResultItemProps> = ({ 
  user, 
  formatLastOnline, 
  onClick 
}) => {
  return (
    <div
      className="flex items-center p-2 rounded-md hover:bg-accent cursor-pointer"
      onClick={onClick}
    >
      <Avatar className="h-10 w-10 mr-3">
        {user.avatar_url ? (
          <AvatarImage src={user.avatar_url} />
        ) : (
          <AvatarFallback>
            {user.display_name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="font-medium">{user.display_name}</div>
        <div className="text-xs text-muted-foreground">@{user.username}</div>
      </div>
      <div className="text-xs text-muted-foreground">
        {formatLastOnline(user.last_online)}
      </div>
    </div>
  );
};

export default UserSearchResultItem;
