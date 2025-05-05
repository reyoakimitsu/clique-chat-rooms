import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the current user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    const { otherUserId } = await req.json();

    // Find existing conversation between these two users
    const { data: conversations, error: fetchError } = await supabaseClient
      .from("conversations")
      .select("id")
      .eq("id", supabaseClient.rpc("find_conversation_between_users", {
        user_id_one: user.id,
        user_id_two: otherUserId,
      }))
      .limit(1);

    if (fetchError) {
      throw fetchError;
    }

    // If conversation exists, return it
    if (conversations && conversations.length > 0) {
      return new Response(
        JSON.stringify({ id: conversations[0].id }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Otherwise create a new conversation
    const { data: newConversation, error: createError } = await supabaseClient
      .from("conversations")
      .insert({})
      .select("id")
      .single();

    if (createError) {
      throw createError;
    }

    // Add both users to the conversation
    const { error: participantError } = await supabaseClient
      .from("conversation_participants")
      .insert([
        {
          conversation_id: newConversation.id,
          profile_id: user.id,
        },
        {
          conversation_id: newConversation.id,
          profile_id: otherUserId,
        },
      ]);

    if (participantError) {
      throw participantError;
    }

    return new Response(
      JSON.stringify({ id: newConversation.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
