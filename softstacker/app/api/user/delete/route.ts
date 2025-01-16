import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First sign out the user from all devices
    await supabase.auth.signOut({ scope: 'global' });

    // Then delete user data from all tables
    const { error: prefError } = await supabase
      .from('user_preferences')
      .delete()
      .eq('user_id', user.id);

    if (prefError && prefError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw prefError;
    }

    // Delete votes if they exist
    const { error: votesError } = await supabase
      .from('votes')
      .delete()
      .eq('user_id', user.id);

    if (votesError && votesError.code !== 'PGRST116') {
      throw votesError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
} 