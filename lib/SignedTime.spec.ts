import { describe, it, expect } from 'vitest';
import { SignedTime } from './SignedTime';

describe('SignedTime', () => {
  // Constructor and Factory Methods
  describe('constructor and factory methods', () => {
    it('should correctly initialize with default values', () => {
      const time = new SignedTime();
      expect(time.toString()).toBe('00:00:00.000');
    });

    it('should correctly initialize with positive values', () => {
      const time = new SignedTime(2, 30, 45, 500);
      expect(time.hours).toBe(2);
      expect(time.minutes).toBe(30);
      expect(time.seconds).toBe(45);
      expect(time.milliseconds).toBe(500);
      expect(time.toString()).toBe('02:30:45.500');
    });

    it('should correctly initialize with negative values', () => {
      const time = new SignedTime(-1, -30, -45, -500);
      expect(time.hours).toBe(-1);
      expect(time.minutes).toBe(-30);
      expect(time.seconds).toBe(-45);
      expect(time.milliseconds).toBe(-500);
      expect(time.toString()).toBe('-01:30:45.500');
    });

    it('should create time from milliseconds', () => {
      const time = SignedTime.fromMilliseconds(5432100); // 1:30:32.100
      expect(time.hours).toBe(1);
      expect(time.minutes).toBe(30);
      expect(time.seconds).toBe(32);
      expect(time.milliseconds).toBe(100);
    });

    it('should create time from Date object', () => {
      const date = new Date(2024, 0, 1, 14, 30, 45, 500);
      const time = SignedTime.fromDate(date);
      expect(time.hours).toBe(14);
      expect(time.minutes).toBe(30);
      expect(time.seconds).toBe(45);
      expect(time.milliseconds).toBe(500);
    });

    it('should create time using convenience factory methods', () => {
      expect(SignedTime.fromHours(2).toString()).toBe('02:00:00.000');
      expect(SignedTime.fromMinutes(30).toString()).toBe('00:30:00.000');
      expect(SignedTime.fromSeconds(45).toString()).toBe('00:00:45.000');
      expect(SignedTime.fromMilliseconds(500).toString()).toBe('00:00:00.500');
    });
  });

  // Arithmetic Operations
  describe('arithmetic operations', () => {
    it('should correctly add times', () => {
      const time1 = new SignedTime(1, 30, 0, 500);
      const time2 = new SignedTime(2, 45, 30, 750);
      const result = time1.add(time2);
      expect(result.toString()).toBe('04:15:31.250');
    });

    it('should correctly subtract times', () => {
      const time1 = new SignedTime(2, 30, 0, 500);
      const time2 = new SignedTime(1, 45, 30, 750);
      const result = time1.subtract(time2);
      expect(result.toString()).toBe('00:44:29.750');
    });

    it('should correctly multiply time by scalar', () => {
      const time = new SignedTime(1, 30, 0, 500);
      expect(time.multiply(2).toString()).toBe('03:00:01.000');
      expect(time.multiply(-2).toString()).toBe('-03:00:01.000');
    });

    it('should correctly divide time by scalar', () => {
      const time = new SignedTime(2, 0, 0, 0);
      expect(time.divide(2).toString()).toBe('01:00:00.000');
      expect(time.divide(-2).toString()).toBe('-01:00:00.000');
      expect(() => time.divide(0)).toThrow('Division by zero is not allowed');
    });

    it('should correctly negate time', () => {
      const time = new SignedTime(1, 30, 45, 500);
      expect(time.negate().toString()).toBe('-01:30:45.500');
    });

    it('should correctly get absolute value', () => {
      const time = new SignedTime(-1, -30, -45, -500);
      expect(time.abs().toString()).toBe('01:30:45.500');
    });
  });

  // Comparison Methods
  describe('comparison methods', () => {
    it('should correctly compare times for equality', () => {
      const time1 = new SignedTime(1, 30, 0);
      const time2 = new SignedTime(1, 30, 0);
      const time3 = new SignedTime(2, 0, 0);
      expect(time1.equals(time2)).toBe(true);
      expect(time1.equals(time3)).toBe(false);
    });

    it('should correctly compare times for greater/less than', () => {
      const time1 = new SignedTime(1, 30, 0);
      const time2 = new SignedTime(2, 0, 0);
      expect(time1.isLessThan(time2)).toBe(true);
      expect(time2.isGreaterThan(time1)).toBe(true);
    });

    it('should correctly check for zero', () => {
      expect(new SignedTime().isZero()).toBe(true);
      expect(new SignedTime(1, 0, 0).isZero()).toBe(false);
    });

    it('should correctly check for negative/positive', () => {
      const positiveTime = new SignedTime(1, 0, 0);
      const negativeTime = new SignedTime(-1, 0, 0);
      expect(positiveTime.isPositive()).toBe(true);
      expect(negativeTime.isNegative()).toBe(true);
    });

    it('should correctly check if time is between range', () => {
      const min = new SignedTime(1, 0, 0);
      const max = new SignedTime(3, 0, 0);
      const time = new SignedTime(2, 0, 0);
      expect(time.isBetween(min, max)).toBe(true);
      expect(min.isBetween(min, max)).toBe(true);
      expect(max.isBetween(min, max)).toBe(true);
      expect(new SignedTime(0, 30, 0).isBetween(min, max)).toBe(false);
    });
  });

  // Formatting
  describe('formatting', () => {
    it('should format time with default format', () => {
      const time = new SignedTime(25, 30, 45, 500);
      expect(time.toString()).toBe('25:30:45.500');
    });

    it('should format time with custom format', () => {
      const time = new SignedTime(1, 30, 45, 500);
      expect(time.toString('h:m:s')).toBe('1:30:45');
      expect(time.toString('hh時mm分ss秒SSS')).toBe('01時30分45秒500');
    });
  });

  describe('fromFormat', () => {
    it('should create time from string with default format', () => {
      const time = SignedTime.fromFormat('01:30:45.500');
      expect(time.toString()).toBe('01:30:45.500');
    });

    it('should create time from string with custom format', () => {
      const time = SignedTime.fromFormat('1時30分', 'h時m分');
      expect(time.toString('h時m分')).toBe('1時30分');
    });

    it('should handle negative times', () => {
      const time = SignedTime.fromFormat('-01:30:00.000');
      expect(time.toString()).toBe('-01:30:00.000');
    });

    it('should throw error for invalid format', () => {
      expect(() => SignedTime.fromFormat('invalid')).toThrow();
      expect(() => SignedTime.fromFormat('25:00:00')).toThrow();
    });
  });

  // Utility Methods
  describe('utility methods', () => {
    it('should correctly round to second', () => {
      expect(new SignedTime(0, 0, 1, 499).roundToSecond().toString()).toBe('00:00:01.000');
      expect(new SignedTime(0, 0, 1, 500).roundToSecond().toString()).toBe('00:00:02.000');
    });

    it('should correctly round to minute', () => {
      expect(new SignedTime(0, 1, 29, 0).roundToMinute().toString()).toBe('00:01:00.000');
      expect(new SignedTime(0, 1, 30, 0).roundToMinute().toString()).toBe('00:02:00.000');
    });

    it('should correctly round to hour', () => {
      expect(new SignedTime(1, 29, 0, 0).roundToHour().toString()).toBe('01:00:00.000');
      expect(new SignedTime(1, 30, 0, 0).roundToHour().toString()).toBe('02:00:00.000');
    });

    it('should correctly clamp time', () => {
      const min = new SignedTime(1, 0, 0);
      const max = new SignedTime(3, 0, 0);
      expect(new SignedTime(0, 0, 0).clamp(min, max).equals(min)).toBe(true);
      expect(new SignedTime(2, 0, 0).clamp(min, max).toString()).toBe('02:00:00.000');
      expect(new SignedTime(4, 0, 0).clamp(min, max).equals(max)).toBe(true);
    });
  });

  // Getters
  describe('getters', () => {
    it('should correctly get total milliseconds', () => {
      const time = new SignedTime(1, 30, 45, 500);
      expect(time.totalMilliseconds).toBe(5445500);
    });

    it('should correctly get components of negative time', () => {
      const time = new SignedTime(-1, -30, -45, -500);
      expect(time.hours).toBe(-1);
      expect(time.minutes).toBe(-30);
      expect(time.seconds).toBe(-45);
      expect(time.milliseconds).toBe(-500);
    });
  });
});
