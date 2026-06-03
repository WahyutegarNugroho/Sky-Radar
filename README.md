# SkyRadar — Platform Pemantau Cuaca & Peta Radar Hujan Real-time

### Deskripsi Singkat
SkyRadar adalah aplikasi pemantau cuaca presisi tinggi dengan visualisasi peta radar curah hujan real-time (RainViewer) dan citra satelit Himawari-9 (NASA GIBS). Aplikasi ini menjembatani kebutuhan informasi cuaca aktual dengan antarmuka peta interaktif, pencarian lokasi presisi, bookmark berbasis cloud, serta sistem alarm ambang batas (threshold) cuaca ekstrem kustom — semua dikemas dalam satu platform yang modern, responsif, aman, dan PWA-ready.

### Problem yang Diselesaikan
* **Prakiraan Cuaca Statis** — Aplikasi cuaca konvensional hanya menyajikan angka tanpa visualisasi dinamis. SkyRadar menyediakan peta animasi radar/satelit langsung.
* **Kehilangan Data Bookmark** — Pengguna sering kehilangan koordinat lokasi favorit saat berganti browser. SkyRadar menyinkronkan bookmark lokasi dan preferensi peta secara cloud.
* **Tidak Ada Peringatan Kustom** — Warga tidak memiliki kontrol atas apa yang dikategorikan sebagai cuaca ekstrem. Fitur Threshold Editor kami memungkinkan kustomisasi ambang batas alarm angin kencang dan curah hujan lebat secara personal.

---

### Fitur Utama

#### 1. Sistem Authentication & Keamanan
* Registrasi dan Login aman menggunakan **Better-Auth**.
* Pengamanan API dengan internal server-side proxying untuk menyembunyikan query eksternal.
* Rate Limiting berbasis IP pada *middleware* Next.js untuk mencegah spamming requests.
* Validasi input yang ketat pada preferensi dan bookmark di tingkat API menggunakan skema validasi terpusat.

#### 2. Interactive Map & Timeline Animation
* Peta interaktif berbasis **Leaflet** + **React-Leaflet v5** dengan penanda kluster (*marker clustering*).
* Lapisan radar cuaca aktual (RainViewer) dengan timeline player animasi pergerakan awan.
* Lapisan citra satelit Himawari-9 NASA GIBS (IR Clean) dengan target koordinat presisi.
* Pilihan visualisasi peta yang adaptif (*Dark Mode*, *Light Mode*, *Satellite Imagery*).

#### 3. Open-Meteo Integration & Detail Weather Card
* Telemetri cuaca lengkap: suhu saat ini, kelembaban, curah hujan, radiasi matahari, kecepatan/arah angin, dan US AQI (Kualitas Udara).
* Weather Card modular dengan chart tren suhu per-jam (**Hourly Trend Chart**), chart variasi suhu harian (**Weather Chart**), serta prakiraan cuaca 7 hari (**Weather Daily**).
* Penanganan visual terpadu yang adaptif terhadap *dark/light mode* dan jenis cuaca saat ini.

#### 4. Dashboard Lokasi Favorit (Multi-Location Weather)
* Panel dashboard khusus yang menampilkan ikhtisar cuaca terkini untuk semua lokasi yang disimpan (bookmark) warga.
* Inisialisasi status memuat (*loading state*) yang instan dan independen per lokasi untuk mencegah kebingungan pengguna.
* Pencegahan siklus pembaruan tak terbatas (*render loop*) menggunakan caching dan perbandingan dependensi berbasis string.

#### 5. Custom Alert & Threshold Editor
* Indikator peringatan dini (*warning banner*) pada Weather Card jika parameter cuaca melampaui batas aman.
* Editor interaktif bagi pengguna terautentikasi untuk mengonfigurasi ambang batas personal untuk alarm angin kencang (km/h) dan curah hujan lebat (mm).

#### 6. Pencarian Lokasi & Map Picker
* Pencarian lokasi cepat berbasis proxy Nominatim dengan dukungan pencarian geografis.
* Fitur klik peta langsung (*Map Picker*) untuk menjatuhkan marker koordinat apa saja sekaligus menyimpan lokasi tersebut ke bookmark cloud.

#### 7. PWA (Progressive Web App)
* Dukungan Service Worker untuk caching aset statis dan navigasi saat luring (*offline support*).
* Manifest standar untuk pengalaman instalasi aplikasi seluler (*standalone mobile display*).

#### 8. CI/CD & Quality Assurance
* Pengujian unit lengkap dengan **Vitest** (71 tests terlewati) untuk menguji utilitas, caching, hooks, dan skema validasi data.
* Dukungan TypeScript progresif untuk keamanan tipe data (*type safety*).

---

### Tech Stack

| Teknologi | Peran | Alasan |
|---|---|---|
| **Next.js 15 (App Router)** | Framework | SSR optimal, API route proxying, middleware, routing berbasis folder. |
| **React 18 / 19** | Library UI | Ekosistem kuat, state management, render performatif. |
| **TypeScript** | Bahasa | Type safety, self-documenting code, mempercepat deteksi error sebelum build. |
| **Tailwind CSS v4** | Styling | Utility-first, rendering sangat cepat, konfigurasi CSS modern berbasis `@import`. |
| **Better-Auth** | Authentication | Keamanan mutakhir, konfigurasi mudah, terintegrasi database. |
| **PostgreSQL (Supabase)** | Database | Keandalan relasional, persistensi cloud terpercaya. |
| **Drizzle ORM** | Database ORM | Type-safe query builder, migrasi database instan dan ringan. |
| **Leaflet / React-Leaflet** | Peta | Library pemetaan open-source yang ringan untuk penanganan ribuan marker. |
| **Vitest** | Testing | Eksekusi unit test super cepat dengan kompatibilitas Next.js modern. |

---

### Kelebihan & Kekurangan

#### Kelebihan:
* **Premium Design & Micro-Animations** — Tampilan modern berbasis glassmorphism, warna harmonis, hover dinamis, dan transisi Framer Motion.
* **Server-Side API Proxying** — Meningkatkan privasi serta efisiensi API pihak ketiga melalui proxy internal Next.js dengan cache server-side.
* **Client & Server Cache Layer** — Penggunaan in-memory Map cache dengan TTL (5 menit server, 10 menit client) untuk respons secepat kilat.
* **Zero Eslint & Build Errors** — Kode bersih bebas dari linting warning, menjamin kompatibilitas penuh saat kompilasi.

#### Kekurangan:
* **Ketergantungan Internet** — Membutuhkan koneksi internet aktif untuk memuat tile peta eksternal dan melacak pembaruan cuaca.
* **Belum Mendukung Multi-bahasa** | Hanya menyediakan antarmuka dalam Bahasa Indonesia (ID) saat ini.

---

### Cara Install / Run

#### Prasyarat
* Node.js v18+
* npm atau yarn
* Database PostgreSQL (Supabase / lokal)

#### Langkah-Langkah

```bash
# 1. Clone repositori
git clone https://github.com/WahyutegarNugroho/Sky-Radar.git
cd Sky-Radar

# 2. Install dependensi (menggunakan legacy-peer-deps jika terjadi konflik versi)
npm install --legacy-peer-deps

# 3. Buat file .env.local di root direktori
cp .env.example .env.local

# 4. Inisialisasi migrasi database
npx drizzle-kit generate
npx drizzle-kit migrate

# 5. Jalankan development server
npm run dev
# Buka http://localhost:3000
```

---

### Environment Variables (.env.local)

```env
DATABASE_URL="postgresql://user:pass@host:6543/db?pgbouncer=true"
DIRECT_URL="postgresql://user:pass@host:5432/db"
BETTER_AUTH_SECRET="your-better-auth-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
```

---

### Scripts yang Tersedia

| Script | Deskripsi |
|---|---|
| `npm run dev` | Menjalankan server Next.js lokal untuk pengembangan |
| `npm run build` | Melakukan kompilasi aplikasi untuk rilis produksi |
| `npm start` | Menjalankan server produksi yang telah di-build |
| `npm test` | Menjalankan unit test dengan Vitest |
| `npx drizzle-kit generate` | Membuat file migrasi SQL baru dari skema data |
| `npx drizzle-kit migrate` | Menjalankan migrasi SQL ke database |

---

### Struktur Dataset (Database Schema)

* **`user`** — Informasi pengguna utama (Nama, Email, Avatar, Tanggal Pembuatan).
* **`session`** — Manajemen sesi otentikasi aktif pengguna.
* **`account`** — Data provider otentikasi Better-Auth.
* **`verification`** — Token verifikasi keamanan email.
* **`user_preferences`** — Menyimpan pengaturan kustom peta pengguna (titik pusat, level zoom, opacity radar, skema warna peta, dan konfigurasi ambang batas cuaca personal).
* **`search_history`** — Rekaman riwayat kueri pencarian lokasi pengguna.
* **`saved_locations`** — Data koordinat lokasi favorit (bookmark) pengguna.

---

### Lisensi
MIT License — © 2026 Wahyutegar Nugroho.
