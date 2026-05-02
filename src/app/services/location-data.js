import db from '@/lib/db';

export async function getAllCountries() {
  const [rows] = await db.execute(
    'SELECT id, name, slug FROM countries ORDER BY name ASC'
  );
  return rows;
}

export async function getCountry(countrySlug) {
  const [rows] = await db.execute(
    `
      SELECT
        countries.id AS countryId,
        countries.name AS countryName,
        countries.slug AS countrySlug
      FROM countries
      WHERE countries.slug = ?
      LIMIT 1
    `,
    [countrySlug]
  );

  return rows[0] ?? null;
}

export async function getState(countrySlug, stateSlug) {
  const [rows] = await db.execute(
    `
      SELECT
        states.id AS stateId,
        states.name AS stateName,
        states.slug AS stateSlug,
        countries.id AS countryId,
        countries.name AS countryName,
        countries.slug AS countrySlug
      FROM states
      JOIN countries ON countries.id = states.country_id
      WHERE states.slug = ? AND countries.slug = ?
      LIMIT 1
    `,
    [stateSlug, countrySlug]
  );

  return rows[0] ?? null;
}

export async function getCity(countrySlug, stateSlug, citySlug) {
  const [rows] = await db.execute(
    `
      SELECT
        cities.name AS cityName,
        states.name AS stateName,
        countries.name AS countryName
      FROM cities
      JOIN states ON cities.state_id = states.id
      JOIN countries ON states.country_id = countries.id
      WHERE cities.slug = ? AND states.slug = ? AND countries.slug = ?
      LIMIT 1
    `,
    [citySlug, stateSlug, countrySlug]
  );

  return rows[0] ?? null;
}

export async function getStatesByCountry(countryId) {
  const [rows] = await db.execute(
    'SELECT id, name, slug FROM states WHERE country_id = ? ORDER BY name ASC',
    [countryId]
  );

  return rows;
}

export async function getCitiesByState(stateId) {
  const [rows] = await db.execute(
    'SELECT id, name, slug FROM cities WHERE state_id = ? ORDER BY name ASC',
    [stateId]
  );

  return rows;
}

export async function getCityInCountry(countrySlug, citySlug) {
  const [rows] = await db.execute(
    `SELECT
       cities.id    AS cityId,    cities.name    AS cityName,    cities.slug    AS citySlug,
       states.id    AS stateId,   states.name    AS stateName,   states.slug    AS stateSlug,
       countries.id AS countryId, countries.name AS countryName, countries.slug AS countrySlug
     FROM cities
     JOIN states    ON cities.state_id     = states.id
     JOIN countries ON states.country_id   = countries.id
     WHERE cities.slug = ? AND countries.slug = ?
     LIMIT 1`,
    [citySlug, countrySlug]
  );
  return rows[0] ?? null;
}
