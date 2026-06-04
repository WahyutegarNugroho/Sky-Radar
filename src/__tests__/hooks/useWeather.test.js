import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWeather } from '../../hooks/useWeather';

const mockGetClientCache = vi.fn(() => null);
const mockSetClientCache = vi.fn();

vi.mock('../../lib/client-cache', () => ({
  getClientCache: (...args) => mockGetClientCache(...args),
  setClientCache: (...args) => mockSetClientCache(...args),
}));

const mockRawWeatherData = {
  current: {
    temperature_2m: 25,
    weather_code: 0,
  },
  utc_offset_seconds: 25200,
  timezone_abbreviation: 'WIB',
  daily: {
    time: ['2026-06-04'],
    weather_code: [0],
    temperature_2m_max: [30],
    temperature_2m_min: [22],
    precipitation_sum: [0],
  },
  hourly: {
    time: ['2026-06-04T12:00'],
    temperature_2m: [25],
    precipitation: [0],
    weather_code: [0],
    wind_speed_10m: [10],
  },
};

const mockMappedWeatherData = {
  temperature_2m: 25,
  weather_code: 0,
  us_aqi: 42,
  utcOffsetSeconds: 25200,
  timezoneAbbr: 'WIB',
  daily: [
    {
      time: '2026-06-04',
      weather_code: 0,
      temp_max: 30,
      temp_min: 22,
      precip_sum: 0,
    },
  ],
  hourly: [
    {
      time: '2026-06-04T12:00',
      temperature_2m: 25,
      precipitation: 0,
      weather_code: 0,
      wind_speed_10m: 10,
    },
  ],
};

describe('useWeather', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch?.mockRestore?.();
  });

  it('returns null states when coords are null', () => {
    const { result } = renderHook(() => useWeather(null, null));
    expect(result.current.loading).toBe(false);
    expect(result.current.weather).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('fetches weather data and sets state', async () => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('air-quality')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ current: { us_aqi: 42 } }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockRawWeatherData),
      });
    });

    const { result } = renderHook(() => useWeather(-6.2, 106.8));
    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 3000 });
    expect(result.current.weather).toEqual(mockMappedWeatherData);
  });

  it('sets error on fetch failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    const { result } = renderHook(() => useWeather(-6.2, 106.8));
    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 3000 });
    expect(result.current.error).toContain('500');
  });

  it('uses cached data when available', () => {
    global.fetch = vi.fn();
    mockGetClientCache.mockReturnValue(mockMappedWeatherData);
    const { result } = renderHook(() => useWeather(-6.2, 106.8));
    expect(result.current.weather).toEqual(mockMappedWeatherData);
    expect(result.current.loading).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
