import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: template, error } = await supabase
      .from('templates')
      .select(`
        *,
        apps (*),
        votes (count)
      `)
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Transform the data to include vote count and format app data
    const transformedTemplate = {
      ...template,
      votes: template.votes?.length || 0,
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
    };

    return NextResponse.json(transformedTemplate);
  } catch (error) {
    console.error('Failed to fetch template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
} 