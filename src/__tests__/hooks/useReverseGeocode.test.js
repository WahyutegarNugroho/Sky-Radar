import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReverseGeocode } from '../../hooks/useReverseGeocode'; const mockGetClientCache = vi.fn(() =>null);
const mockSetClientCache = vi.fn(); vi.mock('../../lib/client-cache', () =>({ getClientCache: (...args) =>mockGetClientCache(...args), setClientCache: (...args) =>mockSetClientCache(...args),
})); const mockLocationName = 'Jakarta'; describe('useReverseGeocode', () =>{ afterEach(() =>{ vi.restoreAllMocks(); global.fetch?.mockRestore?.(); }); it('initializes with default name', () =>{ const { result } = renderHook(() =>useReverseGeocode()); expect(result.current.locationName).toBe('Pusat Peta'); }); it('uses cached value', () =>{ global.fetch = vi.fn(); mockGetClientCache.mockReturnValue(mockLocationName); const { result } = renderHook(() =>useReverseGeocode()); act(() =>{ result.current.fetchLocationName(-6.2, 106.8); }); expect(result.current.locationName).toBe(mockLocationName); expect(global.fetch).not.toHaveBeenCalled(); });
});
