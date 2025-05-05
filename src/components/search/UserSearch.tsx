
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import UserSearchHeader from './UserSearchHeader';
import UserSearchInput from './UserSearchInput';
import UserSearchResults from './UserSearchResults';
import { useStartConversation } from '@/hooks/useStartConversation';

interface UserResult {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  last_online: string | null;
}

interface UserSearchProps {
  onClose: () => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { startConversation, loading: conversationLoading } = useStartConversation(onClose);

  useEffect(() => {
    if (query.trim().length >= 2) {
      searchUsers();
    } else {
      setResults([]);
    }
  }, [query]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, last_online')
        .or(`username.ilike.%${query}%, display_name.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: 'Error searching users',
        description: 'Failed to search for users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatLastOnline = (timestamp: string | null) => {
    if (!timestamp) return 'Never online';
    
    const lastOnline = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - lastOnline.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 5) return 'Online now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    
    return lastOnline.toLocaleDateString();
  };

  return (
    <div className="w-full max-w-md bg-background border border-border rounded-lg shadow-lg">
      <UserSearchHeader onClose={onClose} />
      
      <div className="p-4">
        <UserSearchInput 
          query={query}
          onChange={setQuery}
        />
        
        <UserSearchResults
          query={query}
          results={results}
          loading={loading || conversationLoading}
          formatLastOnline={formatLastOnline}
          onSelectUser={startConversation}
        />
      </div>
    </div>
  );
};

export default UserSearch;
