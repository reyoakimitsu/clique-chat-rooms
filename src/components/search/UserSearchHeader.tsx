
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface UserSearchHeaderProps {
  onClose: () => void;
}

const UserSearchHeader: React.FC<UserSearchHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <h2 className="text-lg font-semibold">Search Users</h2>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserSearchHeader;
