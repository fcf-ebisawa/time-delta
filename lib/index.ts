import { SignedTime } from './SignedTime';

/** Types that can be treated as dates (Date, string, number) */
type DateLike = Date | string | number;

/**
 * Calculates the time difference between two dates
 *
 * @param {DateLike} from - Start date/time
 * @param {DateLike} to - End date/time
 * @returns {SignedTime} SignedTime instance representing the time difference
 * @throws {Error} When invalid dates are specified
 *
 * @example
 * ```typescript
 * const diff = duration(
 *   new Date('2024-01-01T10:00:00'),
 *   new Date('2024-01-01T12:30:00')
 * );
 * console.log(diff.toString()); // "02:30:00.000"
 * ```
 */
export const duration = (from: DateLike, to: DateLike): SignedTime => {
  // null や undefined のチェックを追加
  if (from == null || to == null) {
    throw new Error('Invalid Date');
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  // 無効な日付のチェック
  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    throw new Error('Invalid Date');
  }

  const fromTime = SignedTime.fromDate(fromDate);
  const toTime = SignedTime.fromDate(toDate);
  return toTime.subtract(fromTime);
};

/**
 * Calculates the time difference between two dates and processes it based on options
 *
 * @param {DateLike} from - Start date/time
 * @param {DateLike} to - End date/time
 * @param {Object} options - Calculation options
 * @param {boolean} [options.absolute] - If true, converts the result to absolute value (default: false)
 * @param {('hour'|'minute'|'second'|'millisecond')} [options.roundTo] - Rounding unit
 * @returns {SignedTime} SignedTime instance representing the processed time difference
 *
 * @example
 * ```typescript
 * // Basic usage
 * const diff = timeDiff(
 *   new Date('2024-01-01T10:00:00'),
 *   new Date('2024-01-01T12:30:00')
 * );
 *
 * // Get absolute value
 * const absDiff = timeDiff(
 *   new Date('2024-01-01T12:00:00'),
 *   new Date('2024-01-01T10:00:00'),
 *   { absolute: true }
 * );
 *
 * // Round to hours
 * const roundedDiff = timeDiff(
 *   new Date('2024-01-01T10:00:00'),
 *   new Date('2024-01-01T12:30:00'),
 *   { roundTo: 'hour' }
 * );
 * ```
 */
export function timeDiff(
  from: DateLike,
  to: DateLike,
  options: {
    /** If true, converts the result to absolute value */
    absolute?: boolean;
    /** Rounding unit */
    roundTo?: 'hour' | 'minute' | 'second' | 'millisecond';
  } = {},
): SignedTime {
  let diff = duration(from, to);

  if (options.absolute) {
    diff = diff.abs();
  }

  switch (options.roundTo) {
    case 'hour':
      return diff.roundToHour();
    case 'minute':
      return diff.roundToMinute();
    case 'second':
      return diff.roundToSecond();
    default:
      return diff;
  }
}

export { SignedTime };
