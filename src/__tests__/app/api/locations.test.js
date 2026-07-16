import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/locations/route';
import { db } from '@/db';
import { auth } from '@/lib/auth';
import { validateLocation } from '@/lib/validation';
import { NextResponse } from 'next/server';

vi.mock('@/db', () => {
  const mockQuery = {
    savedLocations: {
      findMany: vi.fn(),
    },
  };
  const mockInsert = vi.fn(() => ({
    values: vi.fn().mockResolvedValue(true),
  }));
  const mockTransaction = vi.fn(async (cb) => {
    return cb({
      query: mockQuery,
      insert: mockInsert,
    });
  });

  return {
    db: {
      query: mockQuery,
      insert: mockInsert,
      transaction: mockTransaction,
    },
  };
});

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('@/lib/validation', () => ({
  validateLocation: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({}),
}));

describe('POST /api/locations limit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects POST if total locations >= 20', async () => {
    auth.api.getSession.mockResolvedValue({ user: { id: 'user-1' } });
    validateLocation.mockReturnValue({
      valid: true,
      data: { name: 'Test', lat: 1.2, lng: 3.4, zoom: 10 },
    });
    db.query.savedLocations.findMany.mockResolvedValue(Array(20).fill({}));

    const req = {
      json: vi.fn().mockResolvedValue({ name: 'Test', lat: 1.2, lng: 3.4, zoom: 10 }),
    };

    const response = await POST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBe('Limit bookmark tercapai');
  });

  it('allows POST if total locations < 20', async () => {
    auth.api.getSession.mockResolvedValue({ user: { id: 'user-1' } });
    validateLocation.mockReturnValue({
      valid: true,
      data: { name: 'Test', lat: 1.2, lng: 3.4, zoom: 10 },
    });
    db.query.savedLocations.findMany.mockResolvedValue(Array(19).fill({}));

    const req = {
      json: vi.fn().mockResolvedValue({ name: 'Test', lat: 1.2, lng: 3.4, zoom: 10 }),
    };

    const response = await POST(req);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.success).toBe(true);
  });
});
