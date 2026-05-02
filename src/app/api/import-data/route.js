import { NextResponse } from 'next/server';
import db from '@/lib/db'; 

const generateSlug = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           
        .replace(/[^\w\-]+/g, '')       
        .replace(/\-\-+/g, '-')         
        .replace(/^-+/, '')             
        .replace(/-+$/, '');            
};

const chunkArray = (array, size) => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) chunked.push(array.slice(i, i + size));
    return chunked;
};

export async function GET() {
    try {
        console.log("Fetching datasets from GitHub...");

        // Ab hum 3 alag-alag aur secure links use kar rahe hain
        const urls = {
            countries: 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries.json',
            states: 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/states.json',
            cities: 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/cities.json'
        };

        // 1. Fetch Countries
        const cRes = await fetch(urls.countries);
        if (!cRes.ok) throw new Error("Countries download fail ho gaya");
        const rawCountries = await cRes.json();

        // 2. Fetch States
        const sRes = await fetch(urls.states);
        if (!sRes.ok) throw new Error("States download fail ho gaya");
        const rawStates = await sRes.json();

        // 3. Fetch Cities
        const cityRes = await fetch(urls.cities);
        if (!cityRes.ok) throw new Error("Cities download fail ho gaya");
        const rawCities = await cityRes.json();

        // Format data for Database
        const countriesData = rawCountries.map(c => [c.id, c.name, generateSlug(c.name) || `c-${c.id}`]);
        const statesData = rawStates.map(s => [s.id, s.name, generateSlug(s.name) || `s-${s.id}`, s.country_id]);
        const citiesData = rawCities.map(city => [city.id, city.name, generateSlug(city.name) || `city-${city.id}`, city.state_id]);

        // Insert Countries
        console.log("Inserting Countries...");
        await db.query(`INSERT IGNORE INTO countries (id, name, slug) VALUES ?`, [countriesData]);

        // Insert States
        console.log("Inserting States...");
        const stateChunks = chunkArray(statesData, 5000);
        for (const chunk of stateChunks) {
            await db.query(`INSERT IGNORE INTO states (id, name, slug, country_id) VALUES ?`, [chunk]);
        }

        // Insert Cities (Yahan thoda time lagega)
        console.log("Inserting Cities...");
        const cityChunks = chunkArray(citiesData, 5000);
        for (const chunk of cityChunks) {
            await db.query(`INSERT IGNORE INTO cities (id, name, slug, state_id) VALUES ?`, [chunk]);
        }

        return NextResponse.json({ 
            success: true, 
            message: `Mubarak ho! Database me ${countriesData.length} countries, ${statesData.length} states, and ${citiesData.length} cities add ho chuki hain.` 
        });

    } catch (error) {
        console.error("IMPORT ERROR: ", error);
        // Agar dubara error aata hai toh screen par detail dikhayega
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}