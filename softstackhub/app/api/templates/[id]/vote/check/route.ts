import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get authenticated user
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const templateId = params.id;

    // Get user's existing vote
    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('template_id', templateId)
      .eq('user_id', userId)
      .single();

    if (voteError && voteError.code !== 'PGRST116') { // Ignore "no rows returned" error
      console.error('Vote check error:', voteError);
      throw voteError;
    }

    // Get total votes
    const { count: upvotes } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('template_id', templateId)
      .eq('vote_type', 'up');

    const { count: downvotes } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('template_id', templateId)
      .eq('vote_type', 'down');

    const totalVotes = (upvotes || 0) - (downvotes || 0);

    return NextResponse.json({ 
      voteType: vote?.vote_type || null,
      votes: totalVotes
    });

  } catch (error) {
    console.error('Error checking vote:', error);
    return NextResponse.json(
      { error: 'Failed to check vote' },
      { status: 500 }
    );
  }
} 