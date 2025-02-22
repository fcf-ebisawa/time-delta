import { describe, it, expect } from 'vitest';
import { duration, timeDiff } from './index';

describe('duration', () => {
  it('should calculate duration between two dates', () => {
    const from = new Date('2024-01-01T10:00:00');
    const to = new Date('2024-01-01T12:30:00');
    const diff = duration(from, to);
    expect(diff.toString()).toBe('02:30:00.000');
  });

  it('should handle negative duration', () => {
    const from = new Date('2024-01-01T12:00:00');
    const to = new Date('2024-01-01T10:00:00');
    const diff = duration(from, to);
    expect(diff.toString()).toBe('-02:00:00.000');
  });

  it('should accept string dates', () => {
    const diff = duration('2024-01-01T10:00:00', '2024-01-01T12:30:00');
    expect(diff.toString()).toBe('02:30:00.000');
  });

  it('should accept timestamps', () => {
    const from = new Date('2024-01-01T10:00:00').getTime();
    const to = new Date('2024-01-01T12:30:00').getTime();
    const diff = duration(from, to);
    expect(diff.toString()).toBe('02:30:00.000');
  });

  it('should handle milliseconds precision', () => {
    const from = new Date('2024-01-01T10:00:00.000');
    const to = new Date('2024-01-01T10:00:00.500');
    const diff = duration(from, to);
    expect(diff.toString()).toBe('00:00:00.500');
  });

  describe('error handling', () => {
    it('should throw error for invalid date string', () => {
      expect(() => duration('invalid', '2024-01-01')).toThrow('Invalid Date');
      expect(() => duration('2024-01-01', 'invalid')).toThrow('Invalid Date');
      expect(() => duration('invalid', 'invalid')).toThrow('Invalid Date');
    });

    it('should throw error for invalid Date objects', () => {
      expect(() => duration(new Date('invalid'), new Date())).toThrow('Invalid Date');
      expect(() => duration(new Date(), new Date('invalid'))).toThrow('Invalid Date');
    });

    it('should throw error for NaN timestamps', () => {
      expect(() => duration(NaN, Date.now())).toThrow('Invalid Date');
      expect(() => duration(Date.now(), NaN)).toThrow('Invalid Date');
    });

    it('should throw error for invalid input types', () => {
      // @ts-expect-error: Testing invalid input type
      expect(() => duration(null, new Date())).toThrow('Invalid Date');
      // @ts-expect-error: Testing invalid input type
      expect(() => duration(undefined, new Date())).toThrow('Invalid Date');
      // @ts-expect-error: Testing invalid input type
      expect(() => duration({}, new Date())).toThrow('Invalid Date');
    });
  });
});

describe('timeDiff', () => {
  describe('basic functionality', () => {
    it('should calculate time difference', () => {
      const from = new Date('2024-01-01T10:00:00');
      const to = new Date('2024-01-01T12:30:00');
      const diff = timeDiff(from, to);
      expect(diff.toString()).toBe('02:30:00.000');
    });

    it('should handle negative difference', () => {
      const from = new Date('2024-01-01T12:00:00');
      const to = new Date('2024-01-01T10:00:00');
      const diff = timeDiff(from, to);
      expect(diff.toString()).toBe('-02:00:00.000');
    });
  });

  describe('absolute option', () => {
    it('should return absolute value when absolute is true', () => {
      const from = new Date('2024-01-01T12:00:00');
      const to = new Date('2024-01-01T10:00:00');
      const diff = timeDiff(from, to, { absolute: true });
      expect(diff.toString()).toBe('02:00:00.000');
    });

    it('should preserve sign when absolute is false', () => {
      const from = new Date('2024-01-01T12:00:00');
      const to = new Date('2024-01-01T10:00:00');
      const diff = timeDiff(from, to, { absolute: false });
      expect(diff.toString()).toBe('-02:00:00.000');
    });
  });

  describe('roundTo option', () => {
    const from = new Date('2024-01-01T10:00:00');
    const to = new Date('2024-01-01T12:30:45.500');

    it('should round to hour', () => {
      const diff = timeDiff(from, to, { roundTo: 'hour' });
      expect(diff.toString()).toBe('03:00:00.000');
    });

    it('should round to minute', () => {
      const diff = timeDiff(from, to, { roundTo: 'minute' });
      expect(diff.toString()).toBe('02:31:00.000');
    });

    it('should round to second', () => {
      const diff = timeDiff(from, to, { roundTo: 'second' });
      expect(diff.toString()).toBe('02:30:46.000');
    });

    it('should not round when roundTo is not specified', () => {
      const diff = timeDiff(from, to);
      expect(diff.toString()).toBe('02:30:45.500');
    });
  });

  describe('combined options', () => {
    it('should handle both absolute and roundTo options', () => {
      const from = new Date('2024-01-01T12:00:00');
      const to = new Date('2024-01-01T10:30:45.500');
      const diff = timeDiff(from, to, { absolute: true, roundTo: 'hour' });
      expect(diff.toString()).toBe('01:00:00.000');
    });
  });

  describe('error handling', () => {
    it('should handle invalid dates', () => {
      expect(() => timeDiff('invalid', 'invalid')).toThrow('Invalid Date');
    });

    it('should handle undefined options', () => {
      const from = new Date('2024-01-01T10:00:00');
      const to = new Date('2024-01-01T12:30:00');
      const diff = timeDiff(from, to, undefined);
      expect(diff.toString()).toBe('02:30:00.000');
    });
  });
});
