import React from 'react';
import PropTypes from 'prop-types';
import { CloudRain, RefreshCw, Compass, Sun, MapPin, Wind, Navigation, Cloud, CloudDrizzle, CloudLightning } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { getWindDirection } from '@/utils/helpers';

// Helper to get day name
function getDayName(dateStr) {
  const date = new Date(dateStr);
  return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()];
}

// Helper to get weather icon
function getWeatherIcon(code, sizeClass = 'w-4.5 h-4.5') {
  if (code === 0 || code === 1) return <Sun className={`${sizeClass} text-amber-500`} />;
  if (code === 2 || code === 3) return <Cloud className={`${sizeClass} text-neutral-400`} />;
  if (code >= 51 && code <= 55) return <CloudDrizzle className={`${sizeClass} text-sky-400`} />;
  if (code >= 61 && code <= 65) return <CloudRain className={`${sizeClass} text-sky-500`} />;
  if (code >= 80 && code <= 82) return <CloudRain className={`${sizeClass} text-blue-500`} />;
  if (code >= 95) return <CloudLightning className={`${sizeClass} text-violet-400`} />;
  return <Cloud className={`${sizeClass} text-neutral-450 text-neutral-400`} />;
}

// Helper to generate a smooth Bezier path for chart lines
function generateBezierPath(points) {
  if (points.length === 0) return '';
  return points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const cpX1 = points[i - 1].x + 14;
    const cpY1 = points[i - 1].y;
    const cpX2 = p.x - 14;
    const cpY2 = p.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
  }, '');
}

function LandingPage({ onGuestAccess, onLoginClick, onRegisterClick }) {
  // Fetch real-time weather data for Jakarta
  const { weather, loading, error } = useWeather(-6.2088, 106.8456);

  // Fallbacks for data loading / empty states
  const currentTemp = weather ? Math.round(weather.temperature_2m) : 32;
  const currentHum = weather ? weather.relative_humidity_2m : 75;
  const currentWindSpeed = weather ? Math.round(weather.wind_speed_10m) : 14;
  const currentWindDir = weather ? getWindDirection(weather.wind_direction_10m) : 'NE';
  const currentWindAngle = weather ? weather.wind_direction_10m : 45;
  const currentAQI = weather && weather.us_aqi !== null ? weather.us_aqi : 42;

  // Determine AQI label
  let aqiLabel = 'Baik';
  let aqiColor = 'text-emerald-400';
  let aqiProgress = 42;
  if (weather && weather.us_aqi !== null) {
    aqiProgress = weather.us_aqi;
    if (weather.us_aqi <= 50) {
      aqiLabel = 'Baik';
      aqiColor = 'text-emerald-400';
    } else if (weather.us_aqi <= 100) {
      aqiLabel = 'Sedang';
      aqiColor = 'text-amber-400';
    } else {
      aqiLabel = 'Tidak Sehat';
      aqiColor = 'text-red-400';
    }
  }

  // Daily Forecast Mapping
  const dailyForecast = weather?.daily && weather.daily.length > 0
    ? weather.daily.slice(0, 7)
    : [
        { time: '2026-06-01', weather_code: 0, temp_min: 24, temp_max: 32, precip_sum: 10 },
        { time: '2026-06-02', weather_code: 1, temp_min: 23, temp_max: 31, precip_sum: 20 },
        { time: '2026-06-03', weather_code: 51, temp_min: 22, temp_max: 29, precip_sum: 40 },
        { time: '2026-06-04', weather_code: 61, temp_min: 21, temp_max: 27, precip_sum: 85 },
        { time: '2026-06-05', weather_code: 80, temp_min: 21, temp_max: 26, precip_sum: 90 },
        { time: '2026-06-06', weather_code: 1, temp_min: 23, temp_max: 30, precip_sum: 15 },
        { time: '2026-06-07', weather_code: 0, temp_min: 25, temp_max: 33, precip_sum: 5 },
      ];

  // Weather Trends calculations (using max & min temp of the week for double line chart)
  const maxVals = dailyForecast.map(d => d.temp_max);
  const minVals = dailyForecast.map(d => d.temp_min);
  const highest = Math.max(...maxVals);
  const lowest = Math.min(...minVals);
  const range = (highest - lowest) || 1;

  const highestMax = Math.max(...maxVals);
  const lowestMax = Math.min(...maxVals);
  const rangeMax = (highestMax - lowestMax) || 1;

  const highestMin = Math.max(...minVals);
  const lowestMin = Math.min(...minVals);
  const rangeMin = (highestMin - lowestMin) || 1;

  const tempMaxPoints = maxVals.map((val, idx) => ({
    x: (idx * 240) / 6,
    y: 22 + ((highestMax - val) / (rangeMax > 4 ? rangeMax : 4)) * 16,
    val,
  }));
  const tempMinPoints = minVals.map((val, idx) => ({
    x: (idx * 240) / 6,
    y: 52 + ((highestMin - val) / (rangeMin > 4 ? rangeMin : 4)) * 16,
    val,
  }));

  const allTemps = [...maxVals, ...minVals];
  const avgTemp = allTemps.reduce((a, b) => a + b, 0) / allTemps.length;
  const avgLineY = 12 + ((highest - avgTemp) / range) * 28;

  const maxPath = generateBezierPath(tempMaxPoints);
  const minPath = generateBezierPath(tempMinPoints);

  return (
    <div className="relative min-h-screen w-screen bg-[url('https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3')] bg-cover bg-center bg-no-repeat flex flex-col overflow-y-auto select-none font-sans pb-24">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/85 z-0" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 flex flex-col gap-16">
        
        {/* Top Hero Section - Brand Info & 4 Grid Boxes on Left, Sleek Action Card on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column - Brand Info & 4 Grid Boxes (7/12 width) */}
          <div className="md:col-span-7 flex flex-col gap-6 justify-between">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 bg-neutral-900/60 border border-white/10 rounded-full px-4.5 py-2 w-max backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-300">Live Radar & Satelit Cuaca</span>
              </div>
              
              <div className="flex flex-col gap-2.5">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white m-0">
                  SkyRadar
                </h1>
                <h2 className="text-base md:text-lg font-medium text-neutral-300 m-0 leading-relaxed">
                  Sistem Radar & Citra Satelit Cuaca Real-Time Indonesia
                </h2>
              </div>
              
              <p className="text-neutral-400 text-xs leading-relaxed m-0">
                Aplikasi pemantauan cuaca presisi tinggi. Rasakan pengalaman memantau pergerakan awan secara live menggunakan satelit Himawari-9 (Band 13 IR Clean) milik Jepang, pemetaan radar curah hujan terintegrasi, arah angin, suhu udara global, serta sinkronisasi preferensi dalam satu dashboard modern.
              </p>
            </div>

            {/* 4 Grid Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="bg-white/3 backdrop-blur-md border border-white/8 rounded-2xl p-5 flex flex-col gap-3.5 hover:bg-white/5 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group hover:border-white/15 hover:shadow-lg hover:shadow-black/20">
                <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Radar Curah Hujan</span>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <CloudRain className="w-4.5 h-4.5 text-blue-400" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-200 group-hover:text-white transition-colors">RainViewer Live</span>
                </div>
              </div>

              <div className="bg-white/3 backdrop-blur-md border border-white/8 rounded-2xl p-5 flex flex-col gap-3.5 hover:bg-white/5 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group hover:border-white/15 hover:shadow-lg hover:shadow-black/20">
                <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Citra Satelit</span>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <RefreshCw className="w-4.5 h-4.5 text-blue-400 animate-spin-slow" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-200 group-hover:text-white transition-colors">Himawari-9 (NASA)</span>
                </div>
              </div>

              <div className="bg-white/3 backdrop-blur-md border border-white/8 rounded-2xl p-5 flex flex-col gap-3.5 hover:bg-white/5 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group hover:border-white/15 hover:shadow-lg hover:shadow-black/20">
                <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Prakiraan Cuaca & AQI</span>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <Sun className="w-4.5 h-4.5 text-blue-400" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-200 group-hover:text-white transition-colors">Open-Meteo Metrics</span>
                </div>
              </div>

              <div className="bg-white/3 backdrop-blur-md border border-white/8 rounded-2xl p-5 flex flex-col gap-3.5 hover:bg-white/5 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group hover:border-white/15 hover:shadow-lg hover:shadow-black/20">
                <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Bookmark Lokasi</span>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <MapPin className="w-4.5 h-4.5 text-blue-400" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-200 group-hover:text-white transition-colors">Simpan & Sinkron</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sleek Access Card (5/12 width) */}
          <div className="md:col-span-5 bg-white/3 backdrop-blur-md border border-white/8 rounded-2xl p-6 flex flex-col justify-center gap-6 shadow-lg shadow-black/10 self-stretch">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-white m-0">Akses Platform</h3>
              <p className="text-xs text-neutral-400 leading-normal m-0">
                Pilih opsi di bawah untuk masuk ke dashboard utama SkyRadar atau mulai eksplorasi langsung.
              </p>
            </div>
            
            <div className="flex flex-col gap-3.5">
              <button
                onClick={onLoginClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11.5 font-bold text-xs rounded-xl transition-all shadow-lg hover:shadow-blue-600/20 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                Masuk ke Akun
              </button>
              <button
                onClick={onRegisterClick}
                className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 h-11.5 font-bold text-xs rounded-xl transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                Daftar Baru
              </button>
              
              <div className="flex items-center justify-center gap-2 py-1 text-neutral-500 font-semibold text-[10px]">
                <span className="w-10 h-px bg-white/5"></span>
                <span>ATAU</span>
                <span className="w-10 h-px bg-white/5"></span>
              </div>
              
              <button
                onClick={onGuestAccess}
                className="w-full h-11.5 border border-white/10 hover:bg-white/5 text-neutral-300 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Compass className="w-4 h-4 text-neutral-400" />
                Eksplorasi Peta Tanpa Login
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Bottom Section - Command Center */}
        <div className="flex flex-col gap-6 w-full">
          
          {/* Command Center Header */}
          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-white m-0">Command Center</h3>
              <p className="text-xs text-neutral-400 mt-1 m-0">Sistem Telemetri Cuaca Real-Time</p>
            </div>
            <div className="flex items-center gap-2 bg-neutral-900/80 px-4 py-2 rounded-full border border-white/10 shadow-[0_0_15px_rgba(37,99,235,0.15)] backdrop-blur-md">
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              )}
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-mono text-xs font-semibold text-neutral-200">Jakarta, ID</span>
            </div>
          </div>

          {/* Live Satellite Feed Visualization Box */}
          <div className="bg-white/3 backdrop-blur-md border border-white/8 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group shadow-lg shadow-black/10">
            <div className="flex justify-between items-center z-10 relative">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-neutral-400 animate-spin-slow" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-300">Live Satellite Feed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.7)]"></span>
                <span className="font-mono text-[10px] text-red-500 font-bold tracking-wider">REC</span>
              </div>
            </div>

            <div className="h-64 w-full bg-neutral-950 rounded-xl relative overflow-hidden border border-white/10">
              {/* Map background simulation (Esri World Satellite view of Jakarta) */}
              <div className="absolute inset-0 bg-[url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=106.75,-6.25,106.95,-6.15&bboxSR=4326&imageSR=4326&size=800,500&format=jpg&f=image')] bg-cover bg-center opacity-50 mix-blend-luminosity grayscale"></div>
              {/* Precipitation layers */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-red-500/20 opacity-60 mix-blend-overlay blur-sm"></div>
              
              {/* Radar grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 scale-50"></div>
              <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 scale-75"></div>
              <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 scale-100"></div>
              <div className="absolute top-1/2 left-0 w-full h-px bg-white/5"></div>
              <div className="absolute top-0 left-1/2 w-px h-full bg-white/5"></div>
              
              {/* Jakarta Target Crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-20">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-8 h-8 rounded-full border border-blue-400 animate-ping opacity-60"></div>
                  <div className="absolute w-5 h-5 rounded-full border border-blue-400/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.9)] animate-pulse"></div>
                </div>
                <div className="bg-neutral-900/90 border border-white/10 px-2 py-0.5 rounded text-[8px] font-mono text-emerald-400 backdrop-blur-xs flex flex-col items-center select-none pointer-events-none">
                  <span className="font-bold">Jakarta, ID</span>
                  <span className="text-[7px] text-neutral-400 font-normal">6.2088° S, 106.8456° E</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weather Trends Chart */}
            <div className="bg-[#0c0d0e] border border-white/5 rounded-3xl p-6.5 flex flex-col gap-6 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center px-1">
                <span className="text-xl font-medium text-neutral-500 tracking-tight">Weather Trends</span>
                <span className="text-[#00a8e8] font-sans text-2xl font-normal">°C</span>
              </div>

              <div className="w-full relative select-none" style={{ aspectRatio: '24/8' }}>
                <svg className="w-full h-full overflow-visible" viewBox="0 0 240 85" preserveAspectRatio="none">
                  {/* Dashed Average/Base Line */}
                  <line x1="0" y1="46" x2="240" y2="46" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" strokeWidth="1.5" />
                  
                  {/* Min and Max Curve Lines */}
                  {maxPath && <path d={maxPath} fill="none" stroke="#e28704" strokeWidth="2.5" strokeLinecap="round" />}
                  {minPath && <path d={minPath} fill="none" stroke="#00a8e8" strokeWidth="2.5" strokeLinecap="round" />}
                  
                  {/* Max Temp dots and labels */}
                  {tempMaxPoints.map((p, idx) => (
                    <g key={`max-dot-${idx}`}>
                      <circle cx={p.x} cy={p.y} r="3.5" fill="#e28704" stroke="#0c0d0e" strokeWidth="1.5" />
                      <text x={p.x} y={p.y - 7} fontSize="7.5" fill="#e28704" fontWeight="bold" textAnchor="middle" className="font-sans">{Math.round(p.val)}°</text>
                    </g>
                  ))}

                  {/* Min Temp dots and labels */}
                  {tempMinPoints.map((p, idx) => (
                    <g key={`min-dot-${idx}`}>
                      <circle cx={p.x} cy={p.y} r="3.5" fill="#00a8e8" stroke="#0c0d0e" strokeWidth="1.5" />
                      <text x={p.x} y={p.y + 14} fontSize="7.5" fill="#00a8e8" fontWeight="bold" textAnchor="middle" className="font-sans">{Math.round(p.val)}°</text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Wind & AQI Telemetry */}
            <div className="bg-white/3 backdrop-blur-md border border-white/8 rounded-2xl p-5.5 flex flex-col gap-4 shadow-lg shadow-black/10">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-neutral-400" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-300">Wind & AQI Telemetry</span>
              </div>

              <div className="flex flex-col gap-3.5 justify-center flex-1">
                <div className="flex items-center gap-4 bg-neutral-950/40 p-3 rounded-xl border border-white/5">
                  {/* Compass gauge */}
                  <div className="relative w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.15)]">
                    <Navigation
                      className="w-4 h-4 text-blue-400 transition-transform duration-500"
                      style={{ transform: `rotate(${currentWindAngle}deg)` }}
                    />
                    <div className="absolute top-0 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-xl text-white font-bold leading-none">
                      {currentWindSpeed} <span className="text-xs text-neutral-400 font-normal">km/h</span>
                    </span>
                    <span className="text-[9px] text-neutral-400 mt-1 font-semibold">Direction: {currentWindDir} ({currentWindAngle}&deg;)</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-neutral-950/40 p-3 rounded-xl border border-white/5">
                  {/* AQI gauge */}
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3"></circle>
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke={currentAQI <= 50 ? '#10b981' : currentAQI <= 100 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="3"
                        strokeDasharray={`${Math.min(currentAQI, 100)}, 100`}
                        className="drop-shadow-[0_0_4px_rgba(16,185,129,0.5)] transition-all duration-500"
                      ></circle>
                    </svg>
                    <span className={`absolute font-mono text-xs font-bold ${aqiColor}`}>{currentAQI}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white font-bold leading-none">
                      {aqiLabel} <span className="text-[10px] text-neutral-400 font-normal">AQI</span>
                    </span>
                    <span className="text-[9px] text-neutral-400 mt-1 font-semibold">Status: Jakarta Real-time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="bg-white/3 backdrop-blur-md border border-white/8 rounded-2xl p-5.5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-300">7-Day Forecast</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {dailyForecast.map((item, idx) => (
                <div key={idx} className="bg-neutral-900/40 p-2.5 border border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-neutral-900/60 transition-colors">
                  <span className="text-[9px] text-neutral-400 font-semibold">{getDayName(item.time)}</span>
                  {getWeatherIcon(item.weather_code, 'w-4.5 h-4.5')}
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[8px] font-mono text-sky-400 font-medium">
                      {item.precip_sum ? `${Math.round(item.precip_sum)}mm` : '0mm'}
                    </span>
                    <span className="text-[9px] font-mono text-white font-bold leading-tight mt-0.5">
                      {Math.round(item.temp_max)}&deg; / {Math.round(item.temp_min)}&deg;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-6 mt-4 flex items-center gap-2 font-mono text-[9px] text-neutral-500 pointer-events-none z-20">
        <span>&copy; 2026 SkyRadar</span>
        <span>v1.2.0</span>
      </div>
    </div>
  );
}

LandingPage.propTypes = {
  onGuestAccess: PropTypes.func.isRequired,
  onLoginClick: PropTypes.func.isRequired,
  onRegisterClick: PropTypes.func.isRequired,
};

export default LandingPage;
