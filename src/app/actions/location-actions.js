'use server';

import { refresh, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { getServiceOptionById } from '@/app/services/service-catalog';
import {
  deleteServicePageBySlug,
  upsertServicePages,
} from '@/app/services/service-page-store';

function slugify(text) {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function getNextCustomId(tableName) {
  const [rows] = await db.execute(
    `SELECT GREATEST(COALESCE(MAX(id), 899999) + 1, 900000) AS nextId FROM ${tableName}`
  );

  return rows[0]?.nextId ?? 900000;
}

function getTextValue(formData, key) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function getTextValueFromSource(source, key) {
  if (typeof FormData !== 'undefined' && source instanceof FormData) {
    return getTextValue(source, key);
  }

  const value = source?.[key];
  return typeof value === 'string' ? value.trim() : '';
}

function getSelectedServices(formData) {
  return formData
    .getAll('services')
    .filter((value) => typeof value === 'string')
    .map((value) => value.trim())
    .filter(Boolean);
}

function getSelectedPageLevels(formData) {
  const selected = formData
    .getAll('pageLevels')
    .filter((value) => typeof value === 'string')
    .map((value) => value.trim())
    .filter((value) => ['country', 'state', 'city'].includes(value));

  return selected.length > 0 ? selected : ['city'];
}

function buildLocationLabel(level, countryName, stateName, cityName) {
  if (level === 'country') return countryName;
  if (level === 'state') return `${stateName}, ${countryName}`;
  return `${cityName}, ${countryName}`;
}

function buildServicePageSlug(level, serviceId, countrySlug, stateSlug, citySlug) {
  if (level === 'country') return `${serviceId}-in-${countrySlug}`;
  if (level === 'state') return `${countrySlug}-${serviceId}-in-${stateSlug}`;
  return `${countrySlug}-${serviceId}-in-${citySlug}`;
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseLocationCsv(csvText) {
  const lines = csvText
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase());
  const countryIndex = headers.indexOf('country');
  const stateIndex = headers.indexOf('state');
  const cityIndex = headers.indexOf('city');

  if (countryIndex === -1 || stateIndex === -1 || cityIndex === -1) {
    throw new Error('CSV header me country,state,city columns required hain.');
  }

  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line);

    return {
      rowNumber: index + 2,
      country: values[countryIndex] ?? '',
      state: values[stateIndex] ?? '',
      city: values[cityIndex] ?? '',
    };
  });
}

export async function createLocation(prevState, formData) {
  const type = getTextValue(formData, 'type');
  const name = getTextValue(formData, 'name');
  const parentId = getTextValue(formData, 'parentId');

  if (!type || !name) {
    return {
      success: false,
      message: 'Type and name are required.',
    };
  }

  const config = {
    country: {
      table: 'countries',
      fields: ['id', 'name', 'slug'],
      label: 'Country',
    },
    state: {
      table: 'states',
      fields: ['id', 'name', 'slug', 'country_id'],
      parentRequired: true,
      label: 'State',
    },
    city: {
      table: 'cities',
      fields: ['id', 'name', 'slug', 'state_id'],
      parentRequired: true,
      label: 'City',
    },
  }[type];

  if (!config) {
    return {
      success: false,
      message: 'Invalid location type.',
    };
  }

  if (config.parentRequired && !parentId) {
    return {
      success: false,
      message: `Please choose a parent ${type === 'state' ? 'country' : 'state'}.`,
    };
  }

  const slug = slugify(name);
  if (!slug) {
    return {
      success: false,
      message: 'Please enter a valid name.',
    };
  }

  try {
    const [existingRows] = await db.execute(
      `SELECT id FROM ${config.table} WHERE slug = ? LIMIT 1`,
      [slug]
    );

    if (existingRows.length > 0) {
      return {
        success: false,
        message: `${config.label} with this slug already exists.`,
      };
    }

    const customId = await getNextCustomId(config.table);
    const values = config.parentRequired
      ? [customId, name, slug, Number(parentId)]
      : [customId, name, slug];

    await db.execute(
      `INSERT INTO ${config.table} (${config.fields.join(', ')}) VALUES (${config.fields.map(() => '?').join(', ')})`,
      values
    );

    revalidatePath('/');

    return {
      success: true,
      message: `${config.label} added successfully.`,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Something went wrong while saving to the database.',
    };
  }
}

async function findBySlug(tableName, slug) {
  const [rows] = await db.execute(
    `SELECT id, name, slug FROM ${tableName} WHERE slug = ? LIMIT 1`,
    [slug]
  );

  return rows[0] ?? null;
}

async function insertLocation(tableName, fields, values) {
  await db.execute(
    `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`,
    values
  );
}

async function createLocationHierarchyRecord(source) {
  const countryName = getTextValueFromSource(source, 'country');
  const stateName = getTextValueFromSource(source, 'state');
  const cityName = getTextValueFromSource(source, 'city');

  if (!countryName || !stateName || !cityName) {
    return {
      ok: false,
      message: 'Country, state aur city tino fields required hain.',
    };
  }

  const countrySlug = slugify(countryName);
  const stateSlug = slugify(stateName);
  const citySlug = slugify(cityName);

  if (!countrySlug || !stateSlug || !citySlug) {
    return {
      ok: false,
      message: 'Please enter valid country, state, and city names.',
    };
  }

  try {
    let country = await findBySlug('countries', countrySlug);
    let createdCountry = false;

    if (!country) {
      const countryId = await getNextCustomId('countries');
      await insertLocation('countries', ['id', 'name', 'slug'], [
        countryId,
        countryName,
        countrySlug,
      ]);
      country = { id: countryId, name: countryName, slug: countrySlug };
      createdCountry = true;
    }

    const [stateRows] = await db.execute(
      'SELECT id, name, slug FROM states WHERE slug = ? AND country_id = ? LIMIT 1',
      [stateSlug, country.id]
    );
    let state = stateRows[0] ?? null;
    let createdState = false;

    if (!state) {
      const stateId = await getNextCustomId('states');
      await insertLocation('states', ['id', 'name', 'slug', 'country_id'], [
        stateId,
        stateName,
        stateSlug,
        country.id,
      ]);
      state = { id: stateId, name: stateName, slug: stateSlug };
      createdState = true;
    }

    const [cityRows] = await db.execute(
      'SELECT id, name, slug FROM cities WHERE slug = ? AND state_id = ? LIMIT 1',
      [citySlug, state.id]
    );
    let createdCity = false;

    if (cityRows.length === 0) {
      const cityId = await getNextCustomId('cities');
      await insertLocation('cities', ['id', 'name', 'slug', 'state_id'], [
        cityId,
        cityName,
        citySlug,
        state.id,
      ]);
      createdCity = true;
    }

    return {
      ok: true,
      countrySlug,
      stateSlug,
      citySlug,
      publicPath: `/services/${countrySlug}/${stateSlug}/${citySlug}`,
      message: createdCity || createdState || createdCountry
        ? 'Location page created successfully.'
        : 'Location already existed, opening the existing page.',
    };
  } catch (error) {
    return {
      ok: false,
      message: error.message || 'Database me data save karte waqt error aaya.',
    };
  }
}

export async function createLocationHierarchy(prevState, formData) {
  const result = await createLocationHierarchyRecord(formData);

  if (!result.ok) {
    return {
      success: false,
      message: result.message,
    };
  }

  revalidatePath('/');
  revalidatePath(result.publicPath);
  redirect(result.publicPath);
}

function buildServiceEntries({
  selectedServices,
  selectedPageLevels,
  result,
  countryName,
  stateName,
  cityName,
}) {
  return selectedServices
    .map((serviceId) => getServiceOptionById(serviceId))
    .filter(Boolean)
    .flatMap((service) =>
      selectedPageLevels.map((level) => {
        const slug = buildServicePageSlug(
          level,
          service.id,
          result.countrySlug,
          result.stateSlug,
          result.citySlug
        );

        return {
          slug,
          locationLevel: level,
          locationName: buildLocationLabel(level, countryName, stateName, cityName),
          serviceId: service.id,
          serviceName: service.name,
          serviceShortName: service.shortName,
          serviceBlurb: service.blurb,
          countryName,
          countrySlug: result.countrySlug,
          stateName,
          stateSlug: result.stateSlug,
          cityName,
          citySlug: result.citySlug,
          publicPath: `/${slug}`,
        };
      })
    );
}

export async function createAdminLocationPage(prevState, formData) {
  const result = await createLocationHierarchyRecord(formData);
  const selectedServices = getSelectedServices(formData);
  const selectedPageLevels = getSelectedPageLevels(formData);

  if (!result.ok) {
    return {
      success: false,
      message: result.message,
    };
  }

  if (selectedServices.length === 0) {
    return {
      success: false,
      message: 'Kam se kam ek service select karni hogi.',
    };
  }

  const countryName = getTextValue(formData, 'country');
  const stateName = getTextValue(formData, 'state');
  const cityName = getTextValue(formData, 'city');

  const serviceEntries = buildServiceEntries({
    selectedServices,
    selectedPageLevels,
    result,
    countryName,
    stateName,
    cityName,
  });

  if (serviceEntries.length === 0) {
    return {
      success: false,
      message: 'Selected services invalid hain. Please dobara try karo.',
    };
  }

  const { created, existing } = await upsertServicePages(serviceEntries);
  const primaryPage = created[0] ?? existing[0];

  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/dashboard/pages');
  revalidatePath(result.publicPath);

  for (const page of [...created, ...existing]) {
    revalidatePath(page.publicPath);
  }

  return {
    success: true,
    message: `${created.length} service page${created.length === 1 ? '' : 's'} ready${existing.length ? `, ${existing.length} pehle se existing` : ''}. Public URL: ${primaryPage?.publicPath ?? result.publicPath}`,
  };
}

export async function createAdminLocationPagesFromCsv(prevState, formData) {
  const selectedServices = getSelectedServices(formData);
  const selectedPageLevels = getSelectedPageLevels(formData);
  const file = formData.get('csvFile');

  if (selectedServices.length === 0) {
    return {
      success: false,
      message: 'Bulk upload ke liye kam se kam ek service select karni hogi.',
    };
  }

  if (!file || typeof file.text !== 'function' || file.size === 0) {
    return {
      success: false,
      message: 'Please ek CSV file upload karo.',
    };
  }

  try {
    const rows = parseLocationCsv(await file.text());

    if (rows.length === 0) {
      return {
        success: false,
        message: 'CSV me kam se kam ek location row honi chahiye.',
      };
    }

    const allEntries = [];
    const errors = [];

    for (const row of rows) {
      const result = await createLocationHierarchyRecord(row);

      if (!result.ok) {
        errors.push(`Row ${row.rowNumber}: ${result.message}`);
        continue;
      }

      allEntries.push(
        ...buildServiceEntries({
          selectedServices,
          selectedPageLevels,
          result,
          countryName: row.country.trim(),
          stateName: row.state.trim(),
          cityName: row.city.trim(),
        })
      );
    }

    if (allEntries.length === 0) {
      return {
        success: false,
        message: errors[0] ?? 'CSV se koi valid service page create nahi ho paya.',
      };
    }

    const { created, existing } = await upsertServicePages(allEntries);

    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/dashboard/pages');

    for (const page of [...created, ...existing]) {
      revalidatePath(page.publicPath);
    }

    const skippedMessage = errors.length ? ` ${errors.length} row skip hui.` : '';

    return {
      success: true,
      message: `${created.length} service page${created.length === 1 ? '' : 's'} ready, ${existing.length} pehle se existing.${skippedMessage}`,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'CSV upload process karte waqt error aaya.',
    };
  }
}

export async function deleteAdminServicePage(prevState, formData) {
  const slug = getTextValue(formData, 'slug');

  if (!slug) {
    return {
      success: false,
      message: 'Missing service page slug.',
    };
  }

  const deleted = await deleteServicePageBySlug(slug);

  if (!deleted) {
    return {
      success: false,
      message: 'Service page not found.',
    };
  }

  revalidatePath('/admin/dashboard/pages');
  revalidatePath(`/${slug}`);
  refresh();

  return {
    success: true,
    message: 'Service page deleted successfully.',
  };
}

export async function deleteAdminLocationPage(prevState, formData) {
  const countrySlug = getTextValue(formData, 'countrySlug');
  const stateSlug = getTextValue(formData, 'stateSlug');
  const citySlug = getTextValue(formData, 'citySlug');

  if (!countrySlug || !stateSlug || !citySlug) {
    return {
      success: false,
      message: 'Missing page information for delete.',
    };
  }

  try {
    const [rows] = await db.execute(
      `
        SELECT
          cities.id AS cityId,
          cities.name AS cityName,
          cities.slug AS citySlug,
          states.id AS stateId,
          states.name AS stateName,
          states.slug AS stateSlug,
          countries.id AS countryId,
          countries.name AS countryName,
          countries.slug AS countrySlug
        FROM cities
        JOIN states ON states.id = cities.state_id
        JOIN countries ON countries.id = states.country_id
        WHERE cities.slug = ? AND states.slug = ? AND countries.slug = ?
        LIMIT 1
      `,
      [citySlug, stateSlug, countrySlug]
    );

    const location = rows[0];

    if (!location) {
      return {
        success: false,
        message: 'Page not found. It may already be deleted.',
      };
    }

    await db.execute('DELETE FROM cities WHERE id = ?', [location.cityId]);

    const [cityCountRows] = await db.execute(
      'SELECT COUNT(*) AS total FROM cities WHERE state_id = ?',
      [location.stateId]
    );

    if ((cityCountRows[0]?.total ?? 0) === 0) {
      await db.execute('DELETE FROM states WHERE id = ?', [location.stateId]);

      const [stateCountRows] = await db.execute(
        'SELECT COUNT(*) AS total FROM states WHERE country_id = ?',
        [location.countryId]
      );

      if ((stateCountRows[0]?.total ?? 0) === 0) {
        await db.execute('DELETE FROM countries WHERE id = ?', [location.countryId]);
      }
    }

    const publicPath = `/services/${location.countrySlug}/${location.stateSlug}/${location.citySlug}`;

    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/dashboard/pages');
    revalidatePath(publicPath);
    refresh();

    return {
      success: true,
      message: `${location.cityName} page deleted successfully.`,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Page delete karte waqt error aaya.',
    };
  }
}
