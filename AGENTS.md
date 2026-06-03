# AGENTS.md — AI Agent Knowledge Base
> **SkyRadar Weather Viewer** | Next.js + Tailwind CSS v4 | Versi: 1.0 | Bahasa: Bilingual (ID/EN)
> Dokumen ini adalah *single source of truth* bagi AI Agent yang bekerja di proyek ini.
> Server: `http://localhost:3000`

---

## PROJECT OVERVIEW

SkyRadar adalah aplikasi web pemantau cuaca real-time dengan peta interaktif. Menampilkan data radar hujan (RainViewer), citra satelit (NASA GIBS Himawari-9), dan data cuaca (Open-Meteo) dengan kontrol animasi timeline, bookmark lokasi, serta autentikasi pengguna.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | JavaScript (JSX) + TypeScript (progresif, 5 file `.ts`) |
| Styling | Tailwind CSS v4 + shadcn/ui + tw-animate-css |
| Map | Leaflet + react-leaflet v5 |
| Animation | Framer Motion |
| Icons | lucide-react |
| Auth | Better-Auth |
| Database | PostgreSQL (Supabase) + Drizzle ORM + Kysely |
| Cache | In-memory Map (server), in-memory Map TTL (client) |
| Testing | Vitest + Testing Library |
| Lint | ESLint v10 (skip during build) |

### Commands

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan Next.js dev server (port 3000) |
| `npm run build` | Build production |
| `npm start` | Jalankan production server |
| `npm test` | Jalankan Vitest (semua file `*.test.*`) |
| `npm run test:watch` | Jalankan Vitest dalam watch mode |
| `npx drizzle-kit generate` | Generate migration dari schema |
| `npx drizzle-kit migrate` | Apply migration ke database |

### Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── layout.js            # Root layout (MapProvider → AuthProvider)
│   ├── page.js              # Halaman utama map
│   └── api/
│       ├── auth/[...better-auth]/route.js
│       ├── geocode/reverse/route.js
│       ├── geocode/search/route.js
│       ├── locations/route.js
│       ├── preferences/route.js
│       └── weather/route.js
├── components/
│   ├── auth/                # AuthModal, dll
│   ├── controls/            # OpenMeteoCard, SearchBar, TimelinePlayer, GeoLocationButton, OpacitySlider, ColorSchemeToggle
│   ├── landing/             # LandingPage
│   ├── map/                 # MapView, RadarLayer, Legend
│   ├── ui/                  # button, dialog, slider, switch (shadcn)
│   └── OnboardingOverlay.jsx
├── contexts/                # AuthContext, MapContext (React Context)
├── db/                      # schema.js, index.js, migrations/
├── hooks/                   # useAnimation, useGeolocation, useLocalStorage, useRadarData, useReverseGeocode, useWeather
├── lib/                     # auth.js, auth-client.js, api-cache.ts, client-cache.js, errors.js, validation.ts, utils.js
├── utils/                   # constants.ts, helpers.ts, api.ts
├── __tests__/               # lib/validation.test.js, utils/constants.test.js, utils/helpers.test.js
├── index.css                # Global styles (Tailwind v4 directives)
└── middleware.js             # Rate limiting (in-memory Map, IP-based)
```

### Routing (Next.js App Router)

| Route | Type | Deskripsi |
|-------|------|-----------|
| `/` | Page | Landing page (if not authed) atau map utama |
| `/api/auth/[...better-auth]` | API | Better-Auth endpoints (login, register, session, dll) |
| `/api/weather` | API | Proxy Open-Meteo (cache 5 menit) |
| `/api/geocode/search` | API | Proxy Nominatim search (cache 5 menit) |
| `/api/geocode/reverse` | API | Proxy Nominatim reverse (cache 5 menit) |
| `/api/preferences` | API | CRUD preferensi user (map center, zoom, style, dll) |
| `/api/locations` | API | CRUD bookmark lokasi |

### Halaman Utama (`page.js`)

Alur render:
```
isMounted? → No → Loading spinner
           → Yes → view === 'landing'? → LandingPage
                   → view === 'map'?    → MapView + controls
```

Komponen yang dirender di mode map:
- Header: SkyRadar logo, AuthModal, Help button (onboarding)
- SearchBar + Bookmark menu
- Layer toggle: Radar / Satellite
- Error banners: radar error, geo error
- MapView (dynamic import, Leaflet)
- GeoLocationButton
- ColorSchemeToggle + OpacitySlider + Legend
- OpenMeteoCard (weather card, collapsed by default)
- TimelinePlayer (jika layer radar)
- OnboardingOverlay (first visit + help button)

### Apps (fitur utama)

| Fitur | Komponen | File |
|-------|----------|------|
| Peta interaktif | MapView | `components/map/MapView.jsx` |
| Lapisan radar | RadarLayer | `components/map/RadarLayer.jsx` |
| Cuaca | OpenMeteoCard | `components/controls/OpenMeteoCard.jsx` |
| Timeline radar | TimelinePlayer | `components/controls/TimelinePlayer.jsx` |
| Cari lokasi | SearchBar | `components/controls/SearchBar.jsx` |
| Bookmark lokasi | (inline di page.js) | `app/page.js` |
| Auth modal | AuthModal | `components/auth/AuthModal.jsx` |
| Landing page | LandingPage | `components/landing/LandingPage.jsx` |
| Onboarding | OnboardingOverlay | `components/OnboardingOverlay.jsx` |

---

## 🧭 KNOWLEDGE ITEMS

| ID | Kategori | Judul |
|----|----------|-------|
| K-01 | Arsitektur | 3-Tier Agent Architecture |
| K-02 | Fondasi | Clean Code & Industry Standards |
| K-03 | Workflow | Build from Scratch — 4-Phase Protocol |
| K-04 | Workflow | Maintenance & Evolution Protocol |
| K-05 | Keamanan | Security & Anti-Regression Rules |
| K-06 | Keamanan | Lock Critical Core Logic |
| K-07 | Proses | Self-Correction & Troubleshooting Protocol |
| K-08 | Proses | Context-First Reading Mandate |
| K-09 | Output | Code Output Standards |
| K-10 | Output | Response Format Contract |

---

## K-01 · 3-Tier Agent Architecture

Setiap pekerjaan coding dikategorikan ke dalam salah satu dari tiga tier. Agent **wajib** mengidentifikasi tier sebelum mengeksekusi.

```
TIER 1 — BLUEPRINT (Arsitektur & Perencanaan)
  Non-deterministik. Output: dokumen, diagram, struktur folder.
  DILARANG menulis logika bisnis.

TIER 2 — BRAIN (Konfigurasi & Integrasi)
  Semi-deterministik. Output: config files, wiring antar komponen,
  service layer, koneksi API.

TIER 3 — BODY (Implementasi Logika Bisnis)
  Deterministik penuh. Output: kode produksi yang siap jalan.
  WAJIB bebas bug.
```

**Aturan Tier Transition:**
- Jangan loncat dari Tier 1 ke Tier 3 tanpa persetujuan user di Tier 2.
- Jika user minta Tier 3, pastikan Tier 1 & 2 sudah selesai atau diasumsikan secara eksplisit.

---

## K-02 · Clean Code & Industry Standards

### Penamaan (Naming Conventions)

```
Variables & Functions : camelCase       → getUserById, cartItems
Components            : PascalCase      → OpenMeteoCard, MapView
Files (komponen)      : PascalCase.jsx  → OpenMeteoCard.jsx
Files (hooks)         : camelCase.js    → useWeather.js
Files (utils/lib)     : kebab-case.js   → client-cache.js, api-cache.ts
Files (TypeScript)    : *.ts / *.tsx    → constants.ts, helpers.ts
Constants             : SCREAMING_SNAKE → API_TIMEOUT, STORAGE_KEYS
Database columns      : snake_case      → created_at, temp_max (via Drizzle)
CSS classes           : kebab-case      → custom-scrollbar, radar-card
```

### Prinsip Wajib

1. **Single Responsibility** — Satu fungsi/komponen hanya melakukan satu hal.
2. **DRY** — Ekstrak logika duplikat ke utility/helper (contoh: `client-cache.js` dipakai ulang oleh hooks).
3. **YAGNI** — Jangan buat abstraksi yang belum dibutuhkan.
4. **Fail Fast** — Validasi input di awal fungsi (guard clauses).
5. **No Magic Numbers** — Semua angka/string literal harus named constant di `constants.ts`.

### PropTypes (bukan TypeScript)

Project saat ini menggunakan **PropTypes** untuk komponen `.jsx`. Untuk komponen baru, pertahankan konsistensi.

```jsx
import PropTypes from 'prop-types';

function OpenMeteoCard({ weather, loading, error, latitude, longitude, locationName }) {
  // ...
}

OpenMeteoCard.propTypes = {
  weather: PropTypes.shape({ temperature_2m: PropTypes.number }),
  loading: PropTypes.bool,
  error: PropTypes.string,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  locationName: PropTypes.string,
};
```

Untuk file `.ts` / `.tsx`, gunakan TypeScript strict dengan interface eksplisit (no `any`).

### React Context (bukan Zustand/Redux)

Semua state management global menggunakan React Context:
- `MapContext` — mapCenter, mapZoom, mapStyle, opacity, colorSchemeId, layerType (6 state, localStorage persist)
- `AuthContext` — currentUser, view, savedLocs, savePrefsToCloud, handleSaveLocation, handleDeleteLocation

### Client Cache Pattern

```js
import { clientCache } from '../../lib/client-cache';

const CACHE_KEY = `weather_${lat}_${lon}`;
const cached = clientCache.get(CACHE_KEY);
if (cached) return cached;

// ... fetch data ...
clientCache.set(CACHE_KEY, result, 10 * 60 * 1000); // TTL 10 menit
```

### Server Cache Pattern (API routes)

```js
import { apiCache } from '@/lib/api-cache';

const cacheKey = `weather_${lat}_${lon}`;
const cached = apiCache.get(cacheKey);
if (cached) return Response.json(cached);

// ... fetch from external API ...
apiCache.set(cacheKey, data, 5 * 60 * 1000); // TTL 5 menit
```

---

## K-03 · Build from Scratch — 4-Phase Protocol

Ikuti protokol yang sama seperti di template AGENTS.md original (K-03). Penyesuaian untuk proyek ini:

### Struktur Folder untuk Fitur Baru

```
src/
├── app/api/[nama-fitur]/route.js    # API route (Next.js App Router)
├── components/[nama-fitur]/          # UI components
├── hooks/use[NamaFitur].js           # Custom hook
├── lib/[nama-fitur].js               # Business logic / utilities
└── __tests__/[nama-fitur].test.js    # Unit tests
```

### Template API Route

```js
// src/app/api/[nama]/route.js
import { NextResponse } from 'next/server';
import { apiCache } from '@/lib/api-cache';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const param = searchParams.get('param');

  if (!param) {
    return NextResponse.json({ error: 'Parameter param wajib diisi' }, { status: 400 });
  }

  const cacheKey = `nama_${param}`;
  const cached = apiCache.get(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const data = await fetchExternalData(param);
    apiCache.set(cacheKey, data, 5 * 60 * 1000);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
```

### Template Custom Hook

```js
// src/hooks/use[NamaFitur].js
import { useState, useEffect, useRef } from 'react';
import { clientCache } from '../lib/client-cache';

export function useNamaFitur(param) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!param) return;

    const cacheKey = `nama_${param}`;
    const cached = clientCache.get(cacheKey);
    if (cached) { setData(cached); setLoading(false); return; }

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/nama?param=${param}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        clientCache.set(cacheKey, json, 10 * 60 * 1000);
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce 500ms
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(fetchData, 500);

    return () => { controller.abort(); clearTimeout(timerRef.current); };
  }, [param]);

  return { data, loading, error };
}
```

---

## K-04 · Maintenance & Evolution Protocol

Identik dengan template AGENTS.md original (K-04). Poin penting untuk proyek ini:

### Bug Fixing Priority

| Severity | Contoh | Response Time |
|----------|--------|---------------|
| Blocker | Map tidak render, build gagal | Immediate fix |
| Critical | Weather card error loop, auth broken | Dalam 1 sesi |
| Minor | Styling tidak rapi, typo | Bisa backlog |

### Regression Checklist (wajib setelah perubahan)

- [ ] `npm run build` lulus (0 error, 0 warning CSS)
- [ ] `npm test` lulus (semua test yang ada)
- [ ] Console browser bebas error (test manual di localhost:3000)
- [ ] Loading state muncul saat data belum siap
- [ ] Error state muncul saat fetch gagal
- [ ] Empty state handle data kosong dengan benar

---

## K-05 · Security & Anti-Regression Rules

### Anti-Deletion Protocol

Agent **DILARANG KERAS** menghapus/memodifikasi kode berikut tanpa instruksi eksplisit user:

```
🔒 PROTECTED:
  • Middleware rate limiting (src/middleware.js)
  • Validasi input (src/lib/validation.ts)
  • Error handling di API routes
  • Environment variable references (.env.local)
  • Database transaction blocks
  • Auth-related code (better-auth, auth.js, auth-client.js)
  • Service worker registration (jika ada)
  • Komentar yang menjelaskan "mengapa" (bukan "apa")
  • @ts-ignore dengan komentar penjelasan
  • eslint-disable dengan komentar penjelasan
```

### Phantom Cleanup — DILARANG

Jangan menghapus kode yang *terlihat* tidak dipakai tanpa investigasi:

```js
// ❌ JANGAN hapus tanpa grep global:
const DEBUG_MODE = false;
const _unusedVar = require('./init');

// ✅ Lakukan dulu: grep -r "DEBUG_MODE" src/
// Hanya hapus jika hasilnya 0 baris selain definisi
```

### Aturan Khusus Proyek

1. **Tidak ada emoji di kode** — UI text dalam Bahasa Indonesia tanpa emoji.
2. **Inline SVG > icon font** — Gunakan `lucide-react` untuk icons.
3. **`npm install` pakai `--legacy-peer-deps`** — Karena konflik better-auth/drizzle-orm/kysely.
4. **CSS Tailwind v4** — Pakai `@import "tailwindcss"` bukan `@tailwind` directives. Konfigurasi di `src/index.css`.
5. **TypeScript progresif** — File `.ts` untuk utils/lib, komponen tetap `.jsx`.

---

## K-06 · Lock Critical Core Logic

Blok yang **selalu dikunci** secara default (jangan dimodifikasi tanpa izin):

```js
// LOCKED: Rate Limiter — src/middleware.js
// LOCKED: Auth — src/lib/auth.js, src/lib/auth-client.js
// LOCKED: Validation schemas — src/lib/validation.ts
// LOCKED: DB schema — src/db/schema.js
// LOCKED: Map Context — src/contexts/MapContext.jsx
// LOCKED: Auth Context — src/contexts/AuthContext.jsx
```

---

## K-07 · Self-Correction & Troubleshooting Protocol

Identik dengan template AGENTS.md original (K-07).

### Error Classification Khusus Proyek

| Tipe | Contoh | Tindakan |
|------|--------|----------|
| Next.js build error | Module not found, syntax error | Fix immediate |
| Tailwind v4 API | @apply tidak jalan, @screen error | Ganti dengan CSS native |
| Better-Auth error | Session null, token invalid | Cek .env.local, cek DB migration |
| Leaflet error | Map blank, tiles tidak load | Cek API key, cek network tab |
| Vitest error | Test gagal, mock tidak match | Update test atau fix logic |

---

## K-08 · Context-First Reading Mandate

**Sebelum** menulis/memodifikasi kode, agent **WAJIB**:

```
CHECKLIST PRA-CODING:
□ Baca seluruh file yang akan dimodifikasi
□ Baca file yang diimport (satu level)
□ Cek test file yang meng-cover kode tersebut
□ Identifikasi semua caller/consumer fungsi yang diubah
□ Pahami PropTypes/interface yang sudah ada
```

### Prioritas File yang Sering Dirubah

1. `src/app/page.js` — Halaman utama, sering ditambah fitur
2. `src/components/controls/OpenMeteoCard.jsx` — Weather card
3. `src/components/map/MapView.jsx` — Peta interaktif
4. `src/hooks/*.js` — Custom hooks
5. `src/lib/errors.js` — Error message helper
6. `src/index.css` — Global styles

---

## K-09 · Code Output Standards

### Format Output Kode

````markdown
**File:** `src/components/controls/OpenMeteoCard.jsx`
**Action:** MODIFY
**Affects:** page.js (consumer)

```jsx
// kode di sini
```

**Perubahan:**
- Baris 12: Tambah state `isMinimized` default true
- Baris 45-60: Render minimized card
````

### Surgical Modification Format

Untuk modifikasi pada file yang sudah ada, tunjukkan diff:

```diff
// File: src/hooks/useWeather.js

-  const debounceTimer = setTimeout(fetchWeather, 200);
+  const debounceTimer = setTimeout(fetchWeather, 500); // FIX: rate limit Open-Meteo
```

---

## K-10 · Response Format Contract

### Untuk Analisis/Review (Read-Only)
```
RINGKASAN    → 3-5 kalimat
TEMUAN       → List dengan severity
REKOMENDASI  → Langkah selanjutnya
PERTANYAAN   → Maks 1 pertanyaan jika ambigu
```

### Untuk Implementasi (Write)
```
KONFIRMASI PEMAHAMAN → Ulangi apa yang dibuat/diubah
ASUMSI               → Daftar asumsi eksplisit
KODE                 → Output format K-09
INSTRUKSI PENGGUNAAN → Cara pakai / integrasi
REGRESSION CHECK     → 3-5 langkah verifikasi
```

### Checkpoint Wajib (STOP & ASK)

Agent **wajib berhenti** dan minta konfirmasi user ketika:
- Akan menghapus >10 baris kode
- Akan mengubah PropTypes/interface yang dipakai banyak tempat
- Akan mengubah schema database
- Akan memodifikasi file konfigurasi keamanan (middleware, auth)
- Tidak yakin dengan requirement
- Perubahan memengaruhi >3 file

---

## 📋 QUICK REFERENCE

| Perintah | Efek |
|----------|------|
| `@phase1` | Mulai Fase 1: Blueprint |
| `@phase2 [fitur]` | Fase 2: Buat komponen UI |
| `@phase3 [fitur]` | Fase 3: Buat API route |
| `@phase4 [komponen] → [endpoint]` | Fase 4: Integrasi FE-BE |
| `@fix [gejala]` | Bug fix protocol |
| `@add [fitur] to [file]` | Feature addition protocol |
| `@refactor [file]` | Refactoring protocol |
| `@audit [file]` | Security audit |
| `@upgrade [package]` | Dependency upgrade plan |

---

## 🔗 Referensi Cepat Konteks Proyek

### Variabel Lingkungan (.env.local)
```
DATABASE_URL       → Supabase pooler (port 6543)
DIRECT_URL         → Direct connection (port 5432) untuk migrasi
BETTER_AUTH_SECRET → Secret key Better-Auth
BETTER_AUTH_URL    → http://localhost:3000
```

### Test Coverage (28 tests)
```
src/__tests__/
├── lib/validation.test.js    → Validasi preferences & locations
├── utils/constants.test.js   → Konstanta map, color scheme, storage keys
└── utils/helpers.test.js     → Fungsi utilitas
```

### Build Notes
- ESLint skip selama build (`ignoreDuringBuilds: true`)
- TypeScript 6.0.3, `baseUrl` deprecation silenced dengan `ignoreDeprecations: "6.0"`
- `npm install` butuh `--legacy-peer-deps`
- CSS warning = `@screen` not supported di Tailwind v4 (gunakan media query biasa)

### Key Decisions
- React Context (bukan Zustand/Redux) untuk state management
- Server-side proxy API dengan in-memory Map cache (bukan Redis)
- Single TileLayer (bukan 4 preload layers) — browser CDN cache handle tile loading
- Weather card collapsed by default — expand on click
- Onboarding slides di localStorage — shown once, re-trigger via help button
- UI text dalam Bahasa Indonesia
- Path alias `@/` → `./src/*` (di tsconfig.json dan jsconfig.json)

---

*Dokumen ini adalah living document. Update versi setiap ada perubahan signifikan pada standar/arsitektur proyek.*
*Last updated: 2026-06-02 | Format: Markdown*
