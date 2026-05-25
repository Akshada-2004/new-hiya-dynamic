// Populates MySQL with all countries, states, and cities from country-state-city.
// Safe to re-run: CREATE TABLE IF NOT EXISTS + INSERT IGNORE skip existing rows.

const mysql = require('mysql2/promise');
const { Country, State, City } = require('country-state-city');
const fs = require('fs');
const path = require('path');

// Parse .env manually (no dotenv dependency needed)
function loadEnv() {
  const envPath = path.resolve(__dirname, '..', '.env');
  try {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const m = line.match(/^\s*([^#=\s][^=]*?)\s*=\s*(.*?)\s*$/);
      if (!m) continue;
      const val = m[2].replace(/^(["'])(.*)\1$/, '$2');
      if (!process.env[m[1]]) process.env[m[1]] = val;
    }
  } catch {
    // .env not found — rely on environment variables already set
  }
}

function slugify(str) {
  const slug = str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'unnamed';
}

// Ensures slug is unique within the provided Set, appending -2, -3, … as needed.
function uniqueSlug(name, used) {
  const base = slugify(name);
  let slug = base;
  let n = 2;
  while (used.has(slug)) slug = `${base}-${n++}`;
  used.add(slug);
  return slug;
}

const BATCH = 500;

async function batchInsert(conn, table, cols, rows) {
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const ph = chunk.map(() => `(${cols.map(() => '?').join(', ')})`).join(', ');
    await conn.execute(
      `INSERT IGNORE INTO ${table} (${cols.join(', ')}) VALUES ${ph}`,
      chunk.flat()
    );
  }
}

async function main() {
  loadEnv();

  const conn = await mysql.createConnection({
    host:     process.env.MYSQL_HOST     || 'localhost',
    user:     process.env.MYSQL_USER     || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'hiya',
    multipleStatements: true,
    charset: 'utf8mb4',
  });

  console.log('Connected to MySQL  (%s/%s)', process.env.MYSQL_HOST || 'localhost', process.env.MYSQL_DATABASE || 'hiya');

  // ── Create tables ─────────────────────────────────────────────────────────
  await conn.query(`
    CREATE TABLE IF NOT EXISTS countries (
      id   INT UNSIGNED NOT NULL,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY uq_country_slug (slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS states (
      id         INT UNSIGNED NOT NULL,
      name       VARCHAR(255) NOT NULL,
      slug       VARCHAR(255) NOT NULL,
      country_id INT UNSIGNED NOT NULL,
      PRIMARY KEY (id),
      KEY idx_state_country (country_id),
      CONSTRAINT fk_state_country FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE IF NOT EXISTS cities (
      id       INT UNSIGNED NOT NULL,
      name     VARCHAR(255) NOT NULL,
      slug     VARCHAR(255) NOT NULL,
      state_id INT UNSIGNED NOT NULL,
      PRIMARY KEY (id),
      KEY idx_city_state (state_id),
      CONSTRAINT fk_city_state FOREIGN KEY (state_id) REFERENCES states (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('Tables ready.');

  // ── Countries ─────────────────────────────────────────────────────────────
  const allCountries = Country.getAllCountries();
  const countryIsoToId = new Map();
  const countryRows = [];
  const usedCountrySlugs = new Set();

  for (let i = 0; i < allCountries.length; i++) {
    const c = allCountries[i];
    const id = i + 1;
    countryRows.push([id, c.name, uniqueSlug(c.name, usedCountrySlugs)]);
    countryIsoToId.set(c.isoCode, id);
  }

  process.stdout.write(`Inserting ${countryRows.length} countries... `);
  await batchInsert(conn, 'countries', ['id', 'name', 'slug'], countryRows);
  console.log('done.');

  // ── States ────────────────────────────────────────────────────────────────
  let stateId = 1;
  const stateKeyToId = new Map(); // `${countryIso}|${stateIso}` → numeric id
  const stateRows = [];

  for (const country of allCountries) {
    const states = State.getStatesOfCountry(country.isoCode);
    const usedStateSlugs = new Set(); // unique per country
    for (const state of states) {
      stateRows.push([
        stateId,
        state.name,
        uniqueSlug(state.name, usedStateSlugs),
        countryIsoToId.get(country.isoCode),
      ]);
      stateKeyToId.set(`${country.isoCode}|${state.isoCode}`, stateId);
      stateId++;
    }
  }

  process.stdout.write(`Inserting ${stateRows.length} states... `);
  await batchInsert(conn, 'states', ['id', 'name', 'slug', 'country_id'], stateRows);
  console.log('done.');

  // ── Cities ────────────────────────────────────────────────────────────────
  let cityId = 1;
  let totalCities = 0;

  process.stdout.write('Inserting cities');

  for (const country of allCountries) {
    const states = State.getStatesOfCountry(country.isoCode);
    const countryBatch = [];

    for (const state of states) {
      const cities = City.getCitiesOfState(country.isoCode, state.isoCode);
      if (!cities.length) continue;

      const sId = stateKeyToId.get(`${country.isoCode}|${state.isoCode}`);
      const usedCitySlugs = new Set(); // unique per state

      for (const city of cities) {
        countryBatch.push([cityId++, city.name, uniqueSlug(city.name, usedCitySlugs), sId]);
      }
    }

    if (countryBatch.length) {
      await batchInsert(conn, 'cities', ['id', 'name', 'slug', 'state_id'], countryBatch);
      totalCities += countryBatch.length;
    }

    process.stdout.write('.');
  }

  console.log(`\nInserted ${totalCities} cities.`);

  // ── Summary ───────────────────────────────────────────────────────────────
  const [[{ c: numCountries }]] = await conn.query('SELECT COUNT(*) AS c FROM countries');
  const [[{ c: numStates }]]    = await conn.query('SELECT COUNT(*) AS c FROM states');
  const [[{ c: numCities }]]    = await conn.query('SELECT COUNT(*) AS c FROM cities');
  console.log(`\nDatabase totals → countries: ${numCountries}  states: ${numStates}  cities: ${numCities}`);

  await conn.end();
  console.log('Done.');
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});
