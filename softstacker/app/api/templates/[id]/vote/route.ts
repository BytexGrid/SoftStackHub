import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(
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

    // Get vote type from request body
    const { voteType } = await request.json();
    if (!voteType || !['up', 'down'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Invalid vote type' },
        { status: 400 }
      );
    }

    // Check if user has already voted
    const { data: existingVote } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('template_id', templateId)
      .eq('user_id', userId)
      .single();

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote if clicking same button
        const { error: deleteError } = await supabase
          .from('votes')
          .delete()
          .eq('template_id', templateId)
          .eq('user_id', userId);

        if (deleteError) {
          console.error('Delete error:', deleteError);
          throw deleteError;
        }
      } else {
        // Update vote if changing from up to down or vice versa
        const { error: updateError } = await supabase
          .from('votes')
          .update({ vote_type: voteType })
          .eq('template_id', templateId)
          .eq('user_id', userId);

        if (updateError) {
          console.error('Update error:', updateError);
          throw updateError;
        }
      }
    } else {
      // Add new vote
      const { error: insertError } = await supabase
        .from('votes')
        .insert([{ 
          template_id: templateId, 
          user_id: userId,
          vote_type: voteType
        }]);

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }
    }

    // Get updated vote counts
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
      message: existingVote ? (existingVote.vote_type === voteType ? 'Vote removed' : 'Vote updated') : 'Vote added',
      votes: totalVotes
    });

  } catch (error) {
    console.error('Voting error:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
} 