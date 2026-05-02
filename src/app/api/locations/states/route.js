import { NextResponse } from 'next/server';
import { getStatesByCountry } from '@/app/services/location-data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const countryId = searchParams.get('countryId');

  if (!countryId) {
    return NextResponse.json({ error: 'countryId is required' }, { status: 400 });
  }

  try {
    const states = await getStatesByCountry(countryId);
    return NextResponse.json(states);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
