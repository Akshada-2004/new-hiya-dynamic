import fs from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'locations.json');
const DEFAULT_DATA = {
  countries: [],
  states: [],
  cities: [],
};

let pool = null;
let poolKey = null;
let fallbackReason = 'MYSQL_CONFIG_MISSING';
let writeQueue = Promise.resolve();

function getMysqlConfig() {
  const url = process.env.MYSQL_URL || process.env.DATABASE_URL;

  if (url) {
    try {
      const parsed = new URL(url);

      return {
        host: parsed.hostname,
        port: parsed.port ? Number(parsed.port) : 3306,
        user: decodeURIComponent(parsed.username),
        password: decodeURIComponent(parsed.password),
        database: parsed.pathname.replace(/^\//, ''),
      };
    } catch {
      fallbackReason = 'MYSQL_URL_INVALID';
      return null;
    }
  }

  const config = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD ?? '',
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : undefined,
  };

  if (!config.host || !config.user || !config.database) {
    fallbackReason = 'MYSQL_CONFIG_MISSING';
    return null;
  }

  return config;
}

function getPoolKey(config) {
  return [
    config.host,
    config.port ?? '',
    config.user,
    config.database,
  ].join('|');
}

function normalizeSql(sql) {
  return sql.replace(/\s+/g, ' ').trim().toLowerCase();
}

function getEmptyResult() {
  return [[], []];
}

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf8');
  }
}

async function readData() {
  await writeQueue.catch(() => undefined);
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

async function updateData(updater) {
  const run = writeQueue.catch(() => undefined).then(async () => {
    await ensureDataFile();
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);
    const result = await updater(data);
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return result;
  });

  writeQueue = run.catch(() => undefined);
  return run;
}

function createPool() {
  const mysqlConfig = getMysqlConfig();

  if (!mysqlConfig) {
    return null;
  }

  const nextPoolKey = getPoolKey(mysqlConfig);

  if (!pool || poolKey !== nextPoolKey) {
    pool = mysql.createPool({
      ...mysqlConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    poolKey = nextPoolKey;
  }

  return pool;
}

function getTable(data, tableName) {
  const table = data[tableName];

  if (!Array.isArray(table)) {
    throw new Error(`Unsupported table: ${tableName}`);
  }

  return table;
}

function sortByName(rows) {
  return [...rows].sort((a, b) => a.name.localeCompare(b.name));
}

function getJoinedLocationRows(data) {
  return data.cities
    .map((city) => {
      const state = data.states.find((item) => item.id === city.state_id);
      const country = state
        ? data.countries.find((item) => item.id === state.country_id)
        : null;

      if (!state || !country) {
        return null;
      }

      return {
        countryName: country.name,
        countrySlug: country.slug,
        stateName: state.name,
        stateSlug: state.slug,
        cityName: city.name,
        citySlug: city.slug,
      };
    })
    .filter(Boolean)
    .sort((a, b) =>
      a.countryName.localeCompare(b.countryName) ||
      a.stateName.localeCompare(b.stateName) ||
      a.cityName.localeCompare(b.cityName)
    );
}

function getJoinedLocation(data, citySlug, stateSlug, countrySlug) {
  for (const city of data.cities) {
    if (city.slug !== citySlug) continue;
    const state = data.states.find((item) => item.id === city.state_id && item.slug === stateSlug);
    if (!state) continue;
    const country = data.countries.find(
      (item) => item.id === state.country_id && item.slug === countrySlug
    );
    if (!country) continue;

    return {
      cityName: city.name,
      stateName: state.name,
      countryName: country.name,
    };
  }

  return null;
}

function getJoinedLocationWithIds(data, citySlug, stateSlug, countrySlug) {
  for (const city of data.cities) {
    if (city.slug !== citySlug) continue;

    const state = data.states.find((item) => item.id === city.state_id && item.slug === stateSlug);
    if (!state) continue;

    const country = data.countries.find(
      (item) => item.id === state.country_id && item.slug === countrySlug
    );
    if (!country) continue;

    return {
      cityId: city.id,
      cityName: city.name,
      citySlug: city.slug,
      stateId: state.id,
      stateName: state.name,
      stateSlug: state.slug,
      countryId: country.id,
      countryName: country.name,
      countrySlug: country.slug,
    };
  }

  return null;
}

function getCountryBySlug(data, countrySlug) {
  const country = data.countries.find((item) => item.slug === countrySlug);

  if (!country) {
    return null;
  }

  return {
    countryId: country.id,
    countryName: country.name,
    countrySlug: country.slug,
  };
}

function getStateBySlugs(data, stateSlug, countrySlug) {
  const country = data.countries.find((item) => item.slug === countrySlug);

  if (!country) {
    return null;
  }

  const state = data.states.find(
    (item) => item.slug === stateSlug && Number(item.country_id) === Number(country.id)
  );

  if (!state) {
    return null;
  }

  return {
    stateId: state.id,
    stateName: state.name,
    stateSlug: state.slug,
    countryId: country.id,
    countryName: country.name,
    countrySlug: country.slug,
  };
}

async function runFallbackSelect(sql, params) {
  const data = await readData();
  const normalized = normalizeSql(sql);

  const countMatch = normalized.match(/^select count\(\*\) as total from (countries|states|cities)$/);
  if (countMatch) {
    const table = countMatch[1];
    return [[{ total: getTable(data, table).length }], []];
  }

  if (normalized === 'select id, name, slug from countries order by name asc') {
    return [sortByName(data.countries).map(({ id, name, slug }) => ({ id, name, slug })), []];
  }

  if (normalized === 'select id, name, slug from states where country_id = ? order by name asc') {
    const [countryId] = params;
    const rows = data.states
      .filter((item) => Number(item.country_id) === Number(countryId))
      .map(({ id, name, slug }) => ({ id, name, slug }));
    return [sortByName(rows), []];
  }

  if (normalized === 'select id, name, slug from cities where state_id = ? order by name asc') {
    const [stateId] = params;
    const rows = data.cities
      .filter((item) => Number(item.state_id) === Number(stateId))
      .map(({ id, name, slug }) => ({ id, name, slug }));
    return [sortByName(rows), []];
  }

  const nextIdMatch = normalized.match(
    /^select greatest\(coalesce\(max\(id\), 899999\) \+ 1, 900000\) as nextid from (countries|states|cities)$/
  );
  if (nextIdMatch) {
    const table = nextIdMatch[1];
    const rows = getTable(data, table);
    const maxId = rows.reduce((current, row) => Math.max(current, Number(row.id) || 0), 899999);
    return [[{ nextId: Math.max(maxId + 1, 900000) }], []];
  }

  const findBySlugMatch = normalized.match(
    /^select id(?:, name, slug)? from (countries|states|cities) where slug = \? limit 1$/
  );
  if (findBySlugMatch) {
    const table = findBySlugMatch[1];
    const slug = params[0];
    const row = getTable(data, table).find((item) => item.slug === slug);
    if (!row) return getEmptyResult();
    const payload = normalized.includes('id, name, slug')
      ? { id: row.id, name: row.name, slug: row.slug }
      : { id: row.id };
    return [[payload], []];
  }

  if (
    normalized ===
    'select id, name, slug from states where slug = ? and country_id = ? limit 1'
  ) {
    const [slug, countryId] = params;
    const row = data.states.find(
      (item) => item.slug === slug && Number(item.country_id) === Number(countryId)
    );
    return [row ? [{ id: row.id, name: row.name, slug: row.slug }] : [], []];
  }

  if (
    normalized ===
    'select id, name, slug from cities where slug = ? and state_id = ? limit 1'
  ) {
    const [slug, stateId] = params;
    const row = data.cities.find(
      (item) => item.slug === slug && Number(item.state_id) === Number(stateId)
    );
    return [row ? [{ id: row.id, name: row.name, slug: row.slug }] : [], []];
  }

  if (
    normalized.includes('select countries.name as countryname') &&
    normalized.includes('from cities join states on states.id = cities.state_id')
  ) {
    return [getJoinedLocationRows(data), []];
  }

  if (
    normalized.includes('select cities.name as cityname, states.name as statename, countries.name as countryname') &&
    normalized.includes('where cities.slug = ? and states.slug = ? and countries.slug = ? limit 1')
  ) {
    const [citySlug, stateSlug, countrySlug] = params;
    const row = getJoinedLocation(data, citySlug, stateSlug, countrySlug);
    return [row ? [row] : [], []];
  }

  if (
    normalized.includes('select cities.id as cityid') &&
    normalized.includes('states.id as stateid') &&
    normalized.includes('countries.id as countryid') &&
    normalized.includes('where cities.slug = ? and states.slug = ? and countries.slug = ? limit 1')
  ) {
    const [citySlug, stateSlug, countrySlug] = params;
    const row = getJoinedLocationWithIds(data, citySlug, stateSlug, countrySlug);
    return [row ? [row] : [], []];
  }

  if (
    normalized.includes('select countries.id as countryid') &&
    normalized.includes('countries.name as countryname') &&
    normalized.includes('countries.slug as countryslug') &&
    normalized.includes('from countries') &&
    normalized.includes('where countries.slug = ? limit 1')
  ) {
    const [countrySlug] = params;
    const row = getCountryBySlug(data, countrySlug);
    return [row ? [row] : [], []];
  }

  if (
    normalized.includes('select states.id as stateid') &&
    normalized.includes('states.name as statename') &&
    normalized.includes('states.slug as stateslug') &&
    normalized.includes('countries.id as countryid') &&
    normalized.includes('from states join countries on countries.id = states.country_id') &&
    normalized.includes('where states.slug = ? and countries.slug = ? limit 1')
  ) {
    const [stateSlug, countrySlug] = params;
    const row = getStateBySlugs(data, stateSlug, countrySlug);
    return [row ? [row] : [], []];
  }

  if (normalized === 'select count(*) as total from cities where state_id = ?') {
    const [stateId] = params;
    const total = data.cities.filter((item) => Number(item.state_id) === Number(stateId)).length;
    return [[{ total }], []];
  }

  if (normalized === 'select count(*) as total from states where country_id = ?') {
    const [countryId] = params;
    const total = data.states.filter((item) => Number(item.country_id) === Number(countryId)).length;
    return [[{ total }], []];
  }

  if (
    normalized.includes('cities.id as cityid') &&
    normalized.includes('cities.slug as cityslug') &&
    normalized.includes('states.id as stateid') &&
    normalized.includes('countries.id as countryid') &&
    normalized.includes('from cities') &&
    normalized.includes('join states') &&
    normalized.includes('join countries') &&
    normalized.includes('where cities.slug = ? and countries.slug = ? limit 1')
  ) {
    const [citySlug, countrySlug] = params;
    const country = data.countries.find((c) => c.slug === countrySlug);
    if (!country) return getEmptyResult();
    const stateIdsInCountry = new Set(
      data.states
        .filter((s) => Number(s.country_id) === Number(country.id))
        .map((s) => s.id)
    );
    const city = data.cities.find(
      (c) => c.slug === citySlug && stateIdsInCountry.has(c.state_id)
    );
    if (!city) return getEmptyResult();
    const state = data.states.find((s) => Number(s.id) === Number(city.state_id));
    if (!state) return getEmptyResult();
    return [[{
      cityId: city.id, cityName: city.name, citySlug: city.slug,
      stateId: state.id, stateName: state.name, stateSlug: state.slug,
      countryId: country.id, countryName: country.name, countrySlug: country.slug,
    }], []];
  }

  throw new Error(`Unsupported local SELECT query: ${sql}`);
}

async function runFallbackInsert(sql, params, ignoreDuplicates = false) {
  const normalized = normalizeSql(sql);
  const insertMatch = normalized.match(
    /^insert(?: ignore)? into (countries|states|cities) \(([^)]+)\) values (.+)$/
  );

  if (!insertMatch) {
    throw new Error(`Unsupported local INSERT query: ${sql}`);
  }

  const tableName = insertMatch[1];
  const fields = insertMatch[2].split(',').map((field) => field.trim());
  const valuesToken = insertMatch[3].trim();

  return updateData((data) => {
    const table = getTable(data, tableName);
    const rowsToInsert =
      valuesToken === '?'
        ? [params]
        : valuesToken.startsWith('(')
          ? [params]
          : Array.isArray(params[0]) ? params[0] : [];

    let affectedRows = 0;

    for (const rowValues of rowsToInsert) {
      const row = Object.fromEntries(fields.map((field, index) => [field, rowValues[index]]));
      const duplicate = table.some((item) => Number(item.id) === Number(row.id));

      if (duplicate) {
        if (ignoreDuplicates) {
          continue;
        }

        const error = new Error(`Duplicate entry '${row.id}' for key 'PRIMARY'`);
        error.code = 'ER_DUP_ENTRY';
        throw error;
      }

      table.push(row);
      affectedRows += 1;
    }

    return [{ affectedRows }, []];
  });
}

async function runFallback(sql, params = []) {
  const normalized = normalizeSql(sql);

  if (normalized.startsWith('select ')) {
    return runFallbackSelect(sql, params);
  }

  if (normalized.startsWith('insert ignore ')) {
    return runFallbackInsert(sql, params, true);
  }

  if (normalized.startsWith('insert ')) {
    return runFallbackInsert(sql, params, false);
  }

  if (normalized === 'delete from cities where id = ?') {
    const [cityId] = params;
    return updateData((data) => {
      const before = data.cities.length;
      data.cities = data.cities.filter((item) => Number(item.id) !== Number(cityId));
      return [{ affectedRows: before - data.cities.length }, []];
    });
  }

  if (normalized === 'delete from states where id = ?') {
    const [stateId] = params;
    return updateData((data) => {
      const before = data.states.length;
      data.states = data.states.filter((item) => Number(item.id) !== Number(stateId));
      return [{ affectedRows: before - data.states.length }, []];
    });
  }

  if (normalized === 'delete from countries where id = ?') {
    const [countryId] = params;
    return updateData((data) => {
      const before = data.countries.length;
      data.countries = data.countries.filter((item) => Number(item.id) !== Number(countryId));
      return [{ affectedRows: before - data.countries.length }, []];
    });
  }

  throw new Error(`Unsupported local query: ${sql}`);
}

async function runWithMySql(method, sql, params = []) {
  const activePool = createPool();

  if (!activePool) {
    return runFallback(sql, params);
  }

  try {
    fallbackReason = null;
    return await activePool[method](sql, params);
  } catch (error) {
    if (['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT'].includes(error.code)) {
      fallbackReason = error.code;
      return runFallback(sql, params);
    }

    throw error;
  }
}

export function getDbStatus() {
  const hasMySqlConfig = Boolean(getMysqlConfig());

  if (!hasMySqlConfig) {
    return {
      mode: 'local-json',
      detail: fallbackReason,
    };
  }

  return {
    mode: fallbackReason ? 'local-json' : 'mysql',
    detail: fallbackReason || 'MYSQL_CONNECTED',
  };
}

const db = {
  async execute(sql, params = []) {
    return runWithMySql('execute', sql, params);
  },
  async query(sql, params = []) {
    return runWithMySql('query', sql, params);
  },
};

export default db;
