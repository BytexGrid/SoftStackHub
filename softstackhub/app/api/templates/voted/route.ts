import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First get the template IDs the user has voted on
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('template_id')
      .eq('user_id', user.id);

    if (votesError) throw votesError;

    if (!votes || votes.length === 0) {
      return NextResponse.json([]);
    }

    // Then fetch the actual templates
    const templateIds = votes.map(vote => vote.template_id);
    const { data: templates, error: templatesError } = await supabase
      .from('templates')
      .select('*')
      .in('id', templateIds)
      .order('created_at', { ascending: false });

    if (templatesError) throw templatesError;

    return NextResponse.json(templates || []);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 