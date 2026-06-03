# SkyRadar 📡⛈️

### Deskripsi Singkat
**SkyRadar** adalah aplikasi pemantau cuaca presisi tinggi dengan peta radar curah hujan real-time (RainViewer) dan citra satelit Himawari-9 milik NASA. Dashboard modern ini dirancang untuk menampilkan data cuaca secara interaktif, cepat, dan presisi di Indonesia dengan antarmuka premium berbasis Next.js dan Tailwind CSS v4.

---

### Problem yang Diselesaikan
1. **Prakiraan Cuaca Lambat & Kurang Interaktif**: Aplikasi cuaca konvensional seringkali hanya menampilkan teks/angka statis. SkyRadar menyajikan data melalui visualisasi dinamis (peta satelit & radar hujan aktual).
2. **Keterbatasan Informasi Lingkungan**: Menyediakan data lengkap terpadu mulai dari prakiraan suhu harian, kelembaban, radiasi, arah/kecepatan angin, hingga indeks kualitas udara (AQI).
3. **Sinkronisasi Preferensi Lokasi**: Pengguna sering kehilangan lokasi favorit mereka saat berganti perangkat. SkyRadar mengintegrasikan sistem autentikasi cloud yang aman untuk menyimpan bookmark lokasi dan preferensi peta.

---

### Fitur Utama
1. **Interactive Weather Map**: Peta interaktif menggunakan Leaflet dengan visualisasi lapisan radar curah hujan (RainViewer) dan animasi pergerakan awan.
2. **Live Satellite Feed**: Simulasi citra satelit Himawari-9 (NASA GIBS) real-time berfokus di atas wilayah Jakarta, ID, dengan indikator target presisi.
3. **Open-Meteo Integration**: Prakiraan cuaca real-time yang mencakup suhu, kelembaban, angin, curah hujan, radiasi matahari, dan visualisasi grafik tren suhu mingguan (**Weather Trends**).
4. **Air Quality Index (AQI)**: Telemetri tingkat kualitas udara Jakarta berbasis standar US AQI.
5. **Autentikasi & Penyimpanan Cloud**: Registrasi & Login aman (Better-Auth) terintegrasi dengan database cloud PostgreSQL untuk menyimpan bookmark lokasi favorit dan kustomisasi peta.

---

### Kelebihan & Kekurangan
#### Kelebihan:
- **Aesthetic Dark Theme**: Antarmuka premium modern dengan gaya glassmorphism dan transisi animasi mikro yang interaktif.
- **Server-Side API Proxying**: Mengurangi beban kuota API eksternal dan meningkatkan keamanan endpoint melalui proxy internal Next.js App Router dengan caching 5 menit.
- **Progressive TypeScript**: Struktur kode modular berbasis komponen yang bersih dan teratur.
- **Responsive Layout**: Optimal untuk perangkat mobile maupun desktop.

#### Kekurangan:
- Tergantung pada ketersediaan koneksi internet aktif untuk memuat tile peta eksternal dan data API.

---

### Tech Stack + Alasan
- **Next.js 15 (App Router)**: Framework React utama untuk rendering sisi server (SSR), optimasi halaman statis, dan API routes proxy bawaan.
- **Tailwind CSS v4 + Shadcn UI**: Sistem styling generasi terbaru yang sangat cepat dengan performa tinggi untuk membangun antarmuka premium dan responsif.
- **Leaflet & React-Leaflet v5**: Library peta open-source yang ringan dan fleksibel untuk rendering peta radar dan satelit secara efisien di sisi browser.
- **Better-Auth**: Solusi autentikasi modern yang aman, berfitur lengkap, dan mudah dikonfigurasi.
- **PostgreSQL (Supabase) + Drizzle ORM**: Database relasional tangguh dengan ORM tipe aman (*type-safe*) untuk kecepatan migrasi skema data.
- **In-Memory Cache (Map)**: Menjamin waktu respons API yang sangat cepat dengan in-memory cache TTL (5 menit di server, 10 menit di client).

---

### Cara Install & Run

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/WahyutegarNugroho/Sky-Radar.git
   cd Sky-Radar
   ```

2. **Instalasi Dependensi**:
   Instal dengan menggunakan bendera `--legacy-peer-deps` untuk menghindari konflik versi antar paket:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Konfigurasi Environment Variable**:
   Buat file `.env.local` di direktori utama lalu masukkan kredensial berikut:
   ```env
   DATABASE_URL=your-database-url
   DIRECT_URL=your-direct-connection-url
   BETTER_AUTH_SECRET=your-auth-secret
   BETTER_AUTH_URL=http://localhost:3000
   ```

4. **Jalankan Migrasi Database**:
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

5. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan secara lokal di [http://localhost:3000](http://localhost:3000).

6. **Menjalankan Pengujian (Testing)**:
   ```bash
   npm test
   ```
