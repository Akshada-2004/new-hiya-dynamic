import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSessionFromRequest } from '@/lib/admin-auth';

const slugify = (text) => text.toLowerCase().replace(/[\s\W-]+/g, '-').replace(/^-|-$/g, '');

export async function POST(req) {
  try {
    const session = getAdminSessionFromRequest(req);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, name, parentId } = await req.json();

    if (!name || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = slugify(name);
    // Generate an ID outside the dataset range (900,000+) to prevent collisions
    const customId = Math.floor(Math.random() * 100000) + 900000; 

    if (type === 'country') {
      await db.execute('INSERT INTO countries (id, name, slug) VALUES (?, ?, ?)', [customId, name, slug]);
    } else if (type === 'state') {
      if (!parentId) return NextResponse.json({ error: 'parentId (country_id) required' }, { status: 400 });
      await db.execute('INSERT INTO states (id, name, slug, country_id) VALUES (?, ?, ?, ?)', [customId, name, slug, parentId]);
    } else if (type === 'city') {
      if (!parentId) return NextResponse.json({ error: 'parentId (state_id) required' }, { status: 400 });
      await db.execute('INSERT INTO cities (id, name, slug, state_id) VALUES (?, ?, ?, ?)', [customId, name, slug, parentId]);
    } else {
      return NextResponse.json({ error: 'Invalid type. Use country, state, or city.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `${type} added successfully`, id: customId, slug });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
