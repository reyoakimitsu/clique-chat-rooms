
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface ConversationResult {
  id: string;
}

export const useStartConversation = (onClose: () => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const startConversation = async (userId: string) => {
    setLoading(true);
    try {
      // First, check if a conversation already exists
      const { data: existingConversation, error: fetchError } = await supabase
        .rpc<ConversationResult>('find_or_create_conversation', { 
          other_user_id: userId 
        });

      if (fetchError) throw fetchError;

      if (existingConversation) {
        navigate(`/messages/${existingConversation.id}`);
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

      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData.user?.id;

      // Add both users to the conversation
      const { error: participantError } = await supabase
        .from('conversation_participants')
        .insert([
          {
            conversation_id: conversationId,
            profile_id: currentUserId,
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
    } finally {
      setLoading(false);
    }
  };

  return { startConversation, loading };
};
