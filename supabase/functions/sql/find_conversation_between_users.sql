
-- Function to find a conversation between two users
CREATE OR REPLACE FUNCTION public.find_conversation_between_users(
  user_id_one UUID,
  user_id_two UUID
)
RETURNS UUID
LANGUAGE SQL
STABLE
AS $$
  SELECT c.id
  FROM public.conversations c
  JOIN public.conversation_participants cp1 ON c.id = cp1.conversation_id
  JOIN public.conversation_participants cp2 ON c.id = cp2.conversation_id
  WHERE cp1.profile_id = user_id_one
  AND cp2.profile_id = user_id_two
  LIMIT 1;
$$;
