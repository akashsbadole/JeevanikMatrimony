import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { searchProfiles } from '@/lib/database/connection';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    
    const filters = {
      gender: searchParams.get('gender') || undefined,
      minAge: searchParams.get('minAge') ? parseInt(searchParams.get('minAge')!) : undefined,
      maxAge: searchParams.get('maxAge') ? parseInt(searchParams.get('maxAge')!) : undefined,
      minHeight: searchParams.get('minHeight') ? parseInt(searchParams.get('minHeight')!) : undefined,
      maxHeight: searchParams.get('maxHeight') ? parseInt(searchParams.get('maxHeight')!) : undefined,
      religion: searchParams.get('religion')?.split(',') || undefined,
      caste: searchParams.get('caste')?.split(',') || undefined,
      city: searchParams.get('city')?.split(',') || undefined,
      state: searchParams.get('state')?.split(',') || undefined,
      education: searchParams.get('education')?.split(',') || undefined,
      occupation: searchParams.get('occupation')?.split(',') || undefined,
      maritalStatus: searchParams.get('maritalStatus')?.split(',') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    };

    const profiles = await searchProfiles(filters);

    return NextResponse.json({
      success: true,
      data: profiles,
      pagination: {
        limit: filters.limit,
        offset: filters.offset,
        total: profiles.length, // In a real app, you'd get this from a count query
      }
    });
  } catch (error) {
    console.error('Search profiles error:', error);
    return NextResponse.json(
      { error: 'Failed to search profiles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const profiles = await searchProfiles(body);

    return NextResponse.json({
      success: true,
      data: profiles,
    });
  } catch (error) {
    console.error('Search profiles error:', error);
    return NextResponse.json(
      { error: 'Failed to search profiles' },
      { status: 500 }
    );
  }
}
