
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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

  const startConversation = async (userId: string) => {
    try {
      // First, check if a conversation already exists
      const { data: existingConversations, error: fetchError } = await supabase
        .rpc('find_or_create_conversation', { other_user_id: userId });

      if (fetchError) throw fetchError;

      if (existingConversations && existingConversations.length > 0) {
        navigate(`/messages/${existingConversations[0].id}`);
        onClose();
        return;
      }

      // If no conversation exists, create one
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({})
        .select('id')
        .single();

      if (createError) throw createError;

      const conversationId = newConversation.id;

      // Add both users to the conversation
      const { error: participantError } = await supabase
        .from('conversation_participants')
        .insert([
          {
            conversation_id: conversationId,
            profile_id: (await supabase.auth.getUser()).data.user?.id,
          },
          {
            conversation_id: conversationId,
            profile_id: userId,
          },
        ]);

      if (participantError) throw participantError;

      toast({
        title: 'Conversation started',
        description: 'You can now send messages to this user.',
      });

      navigate(`/messages/${conversationId}`);
      onClose();
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: 'Error starting conversation',
        description: 'Failed to start a conversation with this user.',
        variant: 'destructive',
      });
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
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Search Users</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4">
        <Input
          type="text"
          placeholder="Search by username or display name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-4"
          autoFocus
        />
        
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
              <div
                key={user.id}
                className="flex items-center p-2 rounded-md hover:bg-accent cursor-pointer"
                onClick={() => startConversation(user.id)}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
