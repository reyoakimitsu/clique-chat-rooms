
import React from 'react';
import { Loader2 } from 'lucide-react';
import UserSearchResultItem from './UserSearchResultItem';

interface UserResult {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  last_online: string | null;
}

interface UserSearchResultsProps {
  query: string;
  results: UserResult[];
  loading: boolean;
  formatLastOnline: (timestamp: string | null) => string;
  onSelectUser: (userId: string) => void;
}

const UserSearchResults: React.FC<UserSearchResultsProps> = ({
  query,
  results,
  loading,
  formatLastOnline,
  onSelectUser
}) => {
  return (
    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
      {loading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : results.length === 0 ? (
        query.trim().length >= 2 ? (
          <div className="text-center p-4 text-muted-foreground">
            No users found matching "{query}"
          </div>
        ) : query.trim().length > 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            Type at least 2 characters to search
          </div>
        ) : null
      ) : (
        results.map((user) => (
          <UserSearchResultItem
            key={user.id}
            user={user}
            formatLastOnline={formatLastOnline}
            onClick={() => onSelectUser(user.id)}
          />
        ))
      )}
    </div>
  );
};

export default UserSearchResults;
