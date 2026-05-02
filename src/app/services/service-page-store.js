import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'service-pages.json');
const DEFAULT_DATA = {
  pages: [],
};

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf8');
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

async function writeStore(data) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function getAllServicePages() {
  const data = await readStore();
  return [...(data.pages ?? [])]
    .map((page) => normalizeServicePage(page))
    .sort((a, b) =>
      a.countryName.localeCompare(b.countryName) ||
      a.stateName.localeCompare(b.stateName) ||
      a.cityName.localeCompare(b.cityName) ||
      a.locationLevel.localeCompare(b.locationLevel) ||
      a.serviceName.localeCompare(b.serviceName)
    );
}

function normalizeServicePage(page) {
  const locationLevel = page.locationLevel ?? 'city';
  const locationName =
    page.locationName ??
    (locationLevel === 'country'
      ? page.countryName
      : locationLevel === 'state'
        ? `${page.stateName}, ${page.countryName}`
        : `${page.cityName}, ${page.countryName}`);

  return {
    ...page,
    locationLevel,
    locationName,
  };
}

export async function getGroupedServiceLocations() {
  const pages = await getAllServicePages();
  const groups = new Map();

  for (const page of pages) {
    const locationKey = `${page.countrySlug}::${page.stateSlug}::${page.citySlug}`;
    const existing = groups.get(locationKey);

    if (existing) {
      existing.totalPages += 1;
      existing.services.push(page.serviceName);
      continue;
    }

    groups.set(locationKey, {
      locationKey,
      countryName: page.countryName,
      countrySlug: page.countrySlug,
      stateName: page.stateName,
      stateSlug: page.stateSlug,
      cityName: page.cityName,
      citySlug: page.citySlug,
      totalPages: 1,
      services: [page.serviceName],
    });
  }

  return [...groups.values()].sort((a, b) =>
    a.countryName.localeCompare(b.countryName) ||
    a.stateName.localeCompare(b.stateName) ||
    a.cityName.localeCompare(b.cityName)
  );
}

export async function getServicePagesByLocation(countrySlug, stateSlug, citySlug) {
  const pages = await getAllServicePages();

  return pages.filter(
    (page) =>
      page.countrySlug === countrySlug &&
      page.stateSlug === stateSlug &&
      page.citySlug === citySlug
  );
}

export async function getServicePageBySlug(slug) {
  const data = await readStore();
  const normalizedSlug = decodeURIComponent(String(slug ?? ''))
    .trim()
    .replace(/^\/+|\/+$/g, '');

  const page = data.pages?.find((entry) => {
    const pageSlug = String(entry.slug ?? '').trim().replace(/^\/+|\/+$/g, '');
    return pageSlug === normalizedSlug;
  });

  return page ? normalizeServicePage(page) : null;
}

export async function upsertServicePages(entries) {
  const data = await readStore();
  const created = [];
  const existing = [];

  for (const entry of entries) {
    const alreadyExists = data.pages.some((page) => page.slug === entry.slug);

    if (alreadyExists) {
      existing.push(entry);
      continue;
    }

    data.pages.push(entry);
    created.push(entry);
  }

  if (created.length > 0) {
    await writeStore(data);
  }

  return { created, existing };
}

export async function deleteServicePageBySlug(slug) {
  const data = await readStore();
  const beforeCount = data.pages.length;
  data.pages = data.pages.filter((page) => page.slug !== slug);

  if (data.pages.length !== beforeCount) {
    await writeStore(data);
    return true;
  }

  return false;
}
