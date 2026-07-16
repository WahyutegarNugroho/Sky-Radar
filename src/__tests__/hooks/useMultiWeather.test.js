import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMultiWeather } from '../../hooks/useMultiWeather';
import { getClientCache, setClientCache } from '@/lib/client-cache';

vi.mock('@/lib/client-cache', () => ({
  getClientCache: vi.fn(),
  setClientCache: vi.fn(),
}));

global.fetch = vi.fn();

describe('useMultiWeather concurrency', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('limits concurrency to max 5 requests at a time', async () => {
    const locations = Array.from({ length: 12 }, (_, i) => ({
      name: `Loc ${i}`,
      lat: i,
      lng: i,
    }));

    let concurrentCount = 0;
    let maxConcurrent = 0;

    global.fetch.mockImplementation(() => {
      concurrentCount++;
      maxConcurrent = Math.max(maxConcurrent, concurrentCount);
      return new Promise((resolve) => {
        setTimeout(() => {
          concurrentCount--;
          resolve({
            ok: true,
            json: async () => ({ temp: 20 }),
          });
        }, 50);
      });
    });

    let result;
    act(() => {
      const hook = renderHook(() => useMultiWeather(locations));
      result = hook.result;
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.weatherData).toHaveLength(12);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(maxConcurrent).toBeLessThanOrEqual(5);
    expect(result.current.loading).toBe(false);
  });
});
