
import React from 'react';
import { Input } from '@/components/ui/input';

interface UserSearchInputProps {
  query: string;
  onChange: (value: string) => void;
}

const UserSearchInput: React.FC<UserSearchInputProps> = ({ query, onChange }) => {
  return (
    <Input
      type="text"
      placeholder="Search by username or display name..."
      value={query}
      onChange={(e) => onChange(e.target.value)}
      className="mb-4"
      autoFocus
    />
  );
};

export default UserSearchInput;
