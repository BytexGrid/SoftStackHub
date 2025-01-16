import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetOS = searchParams.get('os');
    const category = searchParams.get('category');

    let query = supabase
      .from('templates')
      .select(`
        *,
        apps (*)
      `);

    // Apply filters if provided
    if (targetOS) {
      query = query.eq('target_os', targetOS);
    }
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data: templates, error } = await query;

    if (error) throw error;

    // Transform the data to use cached total_votes
    const transformedTemplates = templates.map(template => ({
      ...template,
      votes: template.total_votes || 0,
      apps: template.apps.map((app: any) => ({
        name: app.name,
        description: app.description,
        website: app.website,
        category: app.category,
        subcategory: app.subcategory,
        isRequired: app.is_required,
        chocolateyPackage: app.chocolatey_package,
        brewPackage: app.brew_package,
        aptPackage: app.apt_package,
        dnfPackage: app.dnf_package,
        pacmanPackage: app.pacman_package,
      }))
    }));

    return NextResponse.json(transformedTemplates);
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get authenticated user
    const supabaseAuth = createRouteHandlerClient({ cookies });
    const { data: { session }, error: authError } = await supabaseAuth.auth.getSession();

    if (authError || !session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, category, targetOS, apps } = body;

    // First, insert the template with user data
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .insert([
        { 
          title, 
          description, 
          category, 
          target_os: targetOS,
          user_id: session.user.id,
          author_name: session.user.user_metadata.user_name,
          author_avatar: session.user.user_metadata.avatar_url
        }
      ])
      .select()
      .single();

    if (templateError) throw templateError;

    // Then, insert the apps with the template_id
    const appsWithTemplateId = apps.map((app: any) => ({
      template_id: template.id,
      name: app.name,
      description: app.description,
      website: app.website,
      category: app.category,
      subcategory: app.subcategory,
      is_required: app.isRequired,
      chocolatey_package: app.chocolateyPackage,
      brew_package: app.brewPackage,
      apt_package: app.aptPackage,
      dnf_package: app.dnfPackage,
      pacman_package: app.pacmanPackage,
    }));

    const { error: appsError } = await supabase
      .from('apps')
      .insert(appsWithTemplateId);

    if (appsError) throw appsError;

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Template creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
} 