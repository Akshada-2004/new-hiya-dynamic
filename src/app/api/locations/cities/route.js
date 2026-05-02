import { NextResponse } from 'next/server';
import { getCitiesByState } from '@/app/services/location-data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const stateId = searchParams.get('stateId');

  if (!stateId) {
    return NextResponse.json({ error: 'stateId is required' }, { status: 400 });
  }

  try {
    const cities = await getCitiesByState(stateId);
    return NextResponse.json(cities);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
