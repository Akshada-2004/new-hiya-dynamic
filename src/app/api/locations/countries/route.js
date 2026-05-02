import { NextResponse } from 'next/server';
import { getAllCountries } from '@/app/services/location-data';

export async function GET() {
  try {
    const countries = await getAllCountries();
    return NextResponse.json(countries);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
