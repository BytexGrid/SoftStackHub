import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('User auth error:', userError);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all user's templates with their total_votes
    const { data: templates, error: templatesError } = await supabase
      .from('templates')
      .select('id, title, description, target_os, total_votes')
      .eq('user_id', user.id)
      .order('total_votes', { ascending: false });

    if (templatesError) {
      console.error('Templates fetch error details:', {
        message: templatesError.message,
        details: templatesError.details,
        hint: templatesError.hint
      });
      return NextResponse.json({ error: templatesError.message }, { status: 500 });
    }

    // Ensure templates is an array
    const templatesArray = templates || [];

    // Calculate analytics
    const analytics = {
      total_templates: templatesArray.length,
      total_votes_received: templatesArray.reduce((sum, template) => sum + (template.total_votes || 0), 0),
      most_popular_template: templatesArray.length > 0 ? templatesArray[0] : null
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Unexpected error in analytics:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
} 