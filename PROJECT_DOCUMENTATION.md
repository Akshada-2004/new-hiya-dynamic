# Project Documentation

## Project ka purpose

Yeh project location aur service based landing pages generate karta hai.

User admin dashboard me:

- country enter karta hai
- state enter karta hai
- city enter karta hai
- ek ya multiple services select karta hai

Uske baad system:

- database me country/state/city ko create ya reuse karta hai
- selected services ke liye public landing pages generate karta hai
- generated pages ko admin panel me list karta hai

Current public page slug format:

```txt
/country-service-in-city
```

Example:

```txt
/india-web-development-services-in-mumbai
```

Important:
Current codebase me public route abhi pure nested `/country/state/city` format par nahi chal raha. Abhi active flow service-based flat slug use karta hai.

---

## High level architecture

Project ke 3 main parts hain:

1. Location database layer
2. Service page store layer
3. Public and admin UI layer

### 1. Location database layer

Yeh country, state, city ka data manage karti hai.

Main file:

- [src/lib/db.js](/abs/path/c:/hiya/src/lib/db.js)

Is file ka kaam:

- agar MySQL config available hai to MySQL use karega
- agar MySQL available nahi hai to `.data/locations.json` ko fallback store ki tarah use karega
- common interface deta hai: `db.execute()` aur `db.query()`

Iska matlab:

- development me bina MySQL ke bhi app chal sakta hai
- production me MySQL use ho sakta hai

### 2. Service page store layer

Location alag store hota hai, aur generated service pages alag file me store hote hain.

Main file:

- [src/app/services/service-page-store.js](/abs/path/c:/hiya/src/app/services/service-page-store.js)

Yeh file `.data/service-pages.json` ko manage karti hai.

Isme yeh kaam hote hain:

- saare generated pages read karna
- location ke basis par pages group karna
- slug ke basis par single page nikalna
- duplicate slug ko skip karna
- page delete karna

Important functions:

- `getAllServicePages()`
- `getGroupedServiceLocations()`
- `getServicePagesByLocation(countrySlug, stateSlug, citySlug)`
- `getServicePageBySlug(slug)`
- `upsertServicePages(entries)`
- `deleteServicePageBySlug(slug)`

### 3. UI layer

UI layer do parts me divided hai:

- admin side
- public side

---

## Data flow ka full journey

### Step 1: Admin form se data aata hai

Main file:

- [src/app/components/admin-create-page-form.js](/abs/path/c:/hiya/src/app/components/admin-create-page-form.js)

Yeh component:

- country input leta hai
- state input leta hai
- city input leta hai
- services ke checkboxes dikhata hai
- form submit hone par `createAdminLocationPage` ko call karta hai

Form ka UI fancy hai, lekin backend ke liye important fields yeh hain:

- `country`
- `state`
- `city`
- `services`

### Step 2: Server action run hoti hai

Main file:

- [src/app/actions/location-actions.js](/abs/path/c:/hiya/src/app/actions/location-actions.js)

Yahan sabse important function hai:

- `createAdminLocationPage`

Aur uske peeche helper hai:

- `createLocationHierarchyRecord`

---

## `createLocationHierarchyRecord` kya karta hai

File:

- [src/app/actions/location-actions.js](/abs/path/c:/hiya/src/app/actions/location-actions.js)

Yeh function pehle sirf location hierarchy create/reuse karta hai.

### Iske steps

1. `country`, `state`, `city` formData se read karta hai
2. `slugify()` se inka slug banata hai
3. `countries` table me same country slug search karta hai
4. Agar country nahi milta to naya country insert karta hai
5. `states` table me same `state slug + country_id` check karta hai
6. Agar state nahi milta to naya state insert karta hai
7. `cities` table me same `city slug + state_id` check karta hai
8. Agar city nahi milta to naya city insert karta hai
9. End me result object return karta hai

Return object me important values:

- `countrySlug`
- `stateSlug`
- `citySlug`
- `publicPath`
- `message`

Current `publicPath` format:

```txt
/services/country/state/city
```

Note:
Yeh path hierarchy function return kar raha hai, lekin admin generated service pages actually ek alag flat slug use karte hain. Is wajah se codebase me do alag concepts chal rahe hain:

- location hierarchy path
- service landing page flat slug

Isi wajah se confusion ho raha hai.

---

## `createAdminLocationPage` kya karta hai

Yeh aapka current main function hai.

File:

- [src/app/actions/location-actions.js](/abs/path/c:/hiya/src/app/actions/location-actions.js)

### Is function ka exact flow

1. Sabse pehle `createLocationHierarchyRecord(formData)` call hota hai
2. Isse ensure hota hai ki country/state/city DB me exist kare
3. Phir `getSelectedServices(formData)` selected services nikalta hai
4. Agar koi service select nahi hui to error return karta hai
5. Har selected service ke liye `getServiceOptionById(serviceId)` se service details li jati hain
6. Har service ke liye ek entry banayi jati hai

Generated entry me yeh fields hoti hain:

- `slug`
- `serviceId`
- `serviceName`
- `serviceShortName`
- `serviceBlurb`
- `countryName`
- `countrySlug`
- `stateName`
- `stateSlug`
- `cityName`
- `citySlug`
- `publicPath`

### Slug kaise banta hai

Current slug format:

```txt
countrySlug-serviceId-in-citySlug
```

Example:

```txt
india-web-development-services-in-mumbai
```

### Uske baad kya hota hai

1. Saari entries `upsertServicePages(serviceEntries)` ko di jati hain
2. Yeh function `.data/service-pages.json` me entries save karta hai
3. Agar same slug already exist ho to duplicate create nahi hota
4. `created` aur `existing` arrays return hoti hain
5. Relevant pages `revalidatePath()` se refresh hoti hain
6. Final success message return hota hai

Simple words me:
`createAdminLocationPage` location ko DB me save karta hai aur service pages ko JSON store me save karta hai.

---

## Admin dashboard pages ka role

### Admin create page screen

File:

- [src/app/admin/dashboard/page.js](/abs/path/c:/hiya/src/app/admin/dashboard/page.js)

Yeh bas `AdminCreatePageForm` ko render karta hai.

### Admin all pages listing

File:

- [src/app/admin/dashboard/pages/page.js](/abs/path/c:/hiya/src/app/admin/dashboard/pages/page.js)

Yeh `getGroupedServiceLocations()` call karta hai.

Is page par:

- same location ke multiple service pages ek row me grouped dikhte hain
- country, state, city dikhte hain
- total pages count dikhte hain
- services list dikhte hain
- "Show all" button hota hai

### Admin city detail page

File:

- [src/app/admin/dashboard/pages/[countrySlug]/[stateSlug]/[citySlug]/page.js](/abs/path/c:/hiya/src/app/admin/dashboard/pages/[countrySlug]/[stateSlug]/[citySlug]/page.js)

Yeh ek specific city ke saare generated service pages dikhata hai.

Is page par:

- selected city ke sab service pages list hote hain
- har page ka public URL dikhata hai
- view/delete action milta hai

---

## Public page kaise render hota hai

Main file:

- [src/app/[servicePageSlug]/page.jsx](/abs/path/c:/hiya/src/app/[servicePageSlug]/page.jsx)

Yeh dynamic route hai.

Matlab:

- URL ka ek slug aata hai
- us slug ke basis par page lookup hota hai

Flow:

1. `params.servicePageSlug` read hota hai
2. `getServicePageBySlug(servicePageSlug)` call hota hai
3. `.data/service-pages.json` me matching entry search hoti hai
4. Agar entry nahi milti to `notFound()` call hota hai
5. Agar mil jati hai to UI render hota hai

UI same template use karta hai, lekin location/service values dynamic hoti hain:

- `page.countryName`
- `page.stateName`
- `page.cityName`
- `page.serviceName`

Isliye same layout multiple landing pages ke liye reuse hota hai.

---

## Location helper functions

File:

- [src/app/services/location-data.js](/abs/path/c:/hiya/src/app/services/location-data.js)

Yeh helpers database se location data fetch karte hain.

Important functions:

- `getCountry(countrySlug)`
- `getState(countrySlug, stateSlug)`
- `getCity(countrySlug, stateSlug, citySlug)`
- `getStatesByCountry(countryId)`
- `getCitiesByState(stateId)`

Yeh mostly location hierarchy pages ya location-based lookups ke liye useful hain.

---

## Services kahan defined hain

File:

- [src/app/services/service-catalog.js](/abs/path/c:/hiya/src/app/services/service-catalog.js)

Yahan service options hardcoded array me defined hain:

- `id`
- `name`
- `shortName`
- `blurb`

Example:

- `web-development-services`
- `seo-services`
- `domain-name-registration`

Admin form me jo checkboxes aap dekh rahe ho, woh isi file se aa rahe hain.

---

## Delete flow kaise kaam karta hai

File:

- [src/app/actions/location-actions.js](/abs/path/c:/hiya/src/app/actions/location-actions.js)

Do delete concepts hain:

### 1. `deleteAdminServicePage`

Yeh service page JSON store se delete karta hai.

Matlab:

- `.data/service-pages.json` se page remove hota hai
- location DB untouched reh sakta hai

### 2. `deleteAdminLocationPage`

Yeh actual city DB se delete karta hai.

Flow:

1. countrySlug, stateSlug, citySlug receive hota hai
2. matching location DB se fetch hota hai
3. city delete hota hai
4. agar state me aur cities nahi bachti to state delete hota hai
5. agar country me aur states nahi bachte to country delete hota hai

Yani yeh cascading cleanup jaisa behavior hai.

---

## Duplicate handling kahan ho rahi hai

### Location duplicates

`createLocationHierarchyRecord` me:

- country by `slug`
- state by `slug + country_id`
- city by `slug + state_id`

Iska matlab:

- same country dubara create nahi hota
- same country ke andar same state dubara create nahi hota
- same state ke andar same city dubara create nahi hota

### Service page duplicates

`upsertServicePages()` me:

- duplicate check `page.slug === entry.slug` se hota hai

Iska matlab:

- same public service slug dobara save nahi hota

---

## Current confusion ka root cause

Abhi project me 2 alag URL ideas mix ho rahe hain:

### Idea 1: Location hierarchy

```txt
/services/country/state/city
```

Yeh `createLocationHierarchyRecord()` aur `location-data.js` wale flow me dikh raha hai.

### Idea 2: Service landing page slug

```txt
/country-service-in-city
```

Yeh `createAdminLocationPage()`, `service-page-store.js`, aur `[servicePageSlug]/page.jsx` me active hai.

Isliye aapko lag raha hoga ki project kya kar raha hai, kyunki:

- location tables ek tarah se kaam kar rahi hain
- public service pages dusri tarah se generate ho rahe hain

---

## Agar simple words me samjhein to abhi project kya karta hai

Current project ka actual behavior yeh hai:

1. Admin form me location + services select hoti hain
2. Country/state/city database me create ya reuse hote hain
3. Har service ke liye ek SEO page slug banta hai
4. Yeh service page entries JSON file me save hoti hain
5. Public dynamic route slug ke basis par page render karta hai
6. Admin dashboard generated pages ko list karta hai

---

## Important files quick map

### Core logic

- [src/app/actions/location-actions.js](/abs/path/c:/hiya/src/app/actions/location-actions.js)

### Admin UI

- [src/app/components/admin-create-page-form.js](/abs/path/c:/hiya/src/app/components/admin-create-page-form.js)
- [src/app/admin/dashboard/page.js](/abs/path/c:/hiya/src/app/admin/dashboard/page.js)
- [src/app/admin/dashboard/pages/page.js](/abs/path/c:/hiya/src/app/admin/dashboard/pages/page.js)
- [src/app/admin/dashboard/pages/[countrySlug]/[stateSlug]/[citySlug]/page.js](/abs/path/c:/hiya/src/app/admin/dashboard/pages/[countrySlug]/[stateSlug]/[citySlug]/page.js)

### Public UI

- [src/app/[servicePageSlug]/page.jsx](/abs/path/c:/hiya/src/app/[servicePageSlug]/page.jsx)

### Data helpers

- [src/app/services/location-data.js](/abs/path/c:/hiya/src/app/services/location-data.js)
- [src/app/services/service-page-store.js](/abs/path/c:/hiya/src/app/services/service-page-store.js)
- [src/app/services/service-catalog.js](/abs/path/c:/hiya/src/app/services/service-catalog.js)
- [src/lib/db.js](/abs/path/c:/hiya/src/lib/db.js)

---

## Short summary

Agar ek line me bolun:

This project admin form se location + service leta hai, location ko DB me save karta hai, aur service landing pages ko slug-based JSON store ke through public route par render karta hai.

---

## Recommended next step

Agar aap chaho to next step me main aapke liye ek aur doc bana sakta hoon:

1. `FUNCTION_WISE_EXPLANATION.md`
2. `FLOWCHART.md`
3. current code ko simplify karke kaunsa part hataana chahiye uska cleanup plan

Sabse useful abhi shayad option 1 ya 3 hoga.
