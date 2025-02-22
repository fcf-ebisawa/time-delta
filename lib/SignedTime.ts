/**
 * Class representing signed time
 *
 * Handles time in hours, minutes, seconds, and milliseconds units,
 * supporting signed values, arithmetic operations, and comparison operations.
 *
 * @example
 * ```typescript
 * // Basic usage
 * const time = new SignedTime(1, 30, 45, 500); // 1 hour 30 minutes 45 seconds 500 milliseconds
 * console.log(time.toString()); // "01:30:45.500"
 *
 * // Negative time
 * const negativeTime = new SignedTime(-1, -30, 0, 0); // -1 hour 30 minutes
 * console.log(negativeTime.toString()); // "-01:30:00.000"
 *
 * // Adding time
 * const sum = time.add(SignedTime.minutes(30));
 * console.log(sum.toString()); // "02:00:45.500"
 * ```
 */
export class SignedTime {
  /** Internal time representation (milliseconds) */
  #totalMilliseconds: number;

  /**
   * Creates a SignedTime instance
   *
   * @param {number} hours - Hours (default: 0)
   * @param {number} minutes - Minutes (default: 0)
   * @param {number} seconds - Seconds (default: 0)
   * @param {number} milliseconds - Milliseconds (default: 0)
   *
   * @example
   * ```typescript
   * const time = new SignedTime(1, 30, 45, 500);
   * ```
   */
  constructor(
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    milliseconds: number = 0,
  ) {
    this.#totalMilliseconds = hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
  }

  /**
   * Creates a SignedTime instance from milliseconds
   *
   * @param {number} milliseconds - Milliseconds
   * @returns {SignedTime} New SignedTime instance
   *
   * @example
   * ```typescript
   * const time = SignedTime.fromMilliseconds(5000); // 5 seconds
   * ```
   */
  static fromMilliseconds(milliseconds: number): SignedTime {
    return new SignedTime(0, 0, 0, milliseconds);
  }

  /**
   * Creates a SignedTime instance from hours
   *
   * @param {number} hours - Hours
   * @returns {SignedTime} New SignedTime instance
   *
   * @example
   * ```typescript
   * const time = SignedTime.fromHours(2); // 2 hours
   * ```
   */
  static fromHours(hours: number): SignedTime {
    return new SignedTime(hours, 0, 0, 0);
  }

  /**
   * Creates a SignedTime instance from minutes
   *
   * @param {number} minutes - Minutes
   * @returns {SignedTime} New SignedTime instance
   *
   * @example
   * ```typescript
   * const time = SignedTime.fromMinutes(30); // 30 minutes
   * ```
   */
  static fromMinutes(minutes: number): SignedTime {
    return new SignedTime(0, minutes, 0, 0);
  }

  /**
   * Creates a SignedTime instance from seconds
   *
   * @param {number} seconds - Seconds
   * @returns {SignedTime} New SignedTime instance
   *
   * @example
   * ```typescript
   * const time = SignedTime.fromSeconds(45); // 45 seconds
   * ```
   */
  static fromSeconds(seconds: number): SignedTime {
    return new SignedTime(0, 0, seconds, 0);
  }

  /**
   * Creates a SignedTime instance from the time portion of a Date object
   *
   * @param {Date} date - Date object
   * @returns {SignedTime} New SignedTime instance
   *
   * @example
   * ```typescript
   * const now = new Date();
   * const time = SignedTime.fromDate(now);
   * ```
   */
  static fromDate(date: Date): SignedTime {
    return new SignedTime(
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    );
  }

  /**
   * Creates a SignedTime instance from a time string based on a format string
   *
   * @param {string} timeString - Time string to parse
   * @param {string} format - Format string (default: 'hh:mm:ss.SSS')
   * @returns {SignedTime} New SignedTime instance
   * @throws {Error} When format is invalid
   *
   * @example
   * ```typescript
   * const time = SignedTime.fromFormat('01:30:45.500');
   * const customTime = SignedTime.fromFormat('1h30m', 'h\h m\m');
   * ```
   */
  static fromFormat(timeString: string, format: string = 'hh:mm:ss.SSS'): SignedTime {
    // Check if the string is negative
    const isNegative = timeString.startsWith('-');
    const cleanTimeString = isNegative ? timeString.slice(1) : timeString;

    // Create regex pattern from format
    const pattern = format
      .replace(/hh/g, '(\\d{2})')
      .replace(/h/g, '(\\d{1,2})')
      .replace(/mm/g, '(\\d{2})')
      .replace(/m/g, '(\\d{1,2})')
      .replace(/ss/g, '(\\d{2})')
      .replace(/s/g, '(\\d{1,2})')
      .replace(/SSS/g, '(\\d{3})')
      .replace(/S/g, '(\\d{1,3})')
      .replace(/[/:.\s]/g, '\\$&');

    const regex = new RegExp(`^${pattern}$`);
    const match = cleanTimeString.match(regex);

    if (!match) {
      throw new Error(`Invalid time string format. Expected format: ${format}`);
    }

    // Extract values using format tokens
    let hours = 0,
      minutes = 0,
      seconds = 0,
      milliseconds = 0;
    let matchIndex = 1;

    const formatTokenMatches = format.match(/(hh|h|mm|m|ss|s|SSS|S)/g);
    const formatTokens: string[] = formatTokenMatches ? formatTokenMatches : [];

    for (const token of formatTokens) {
      const matchValue = match[matchIndex];
      if (matchValue === undefined) {
        throw new Error(`Invalid match index: ${matchIndex} for format: ${format}`);
      }
      const value = parseInt(matchValue, 10);
      matchIndex++;

      switch (token) {
        case 'hh':
        case 'h':
          hours = value;
          break;
        case 'mm':
        case 'm':
          minutes = value;
          break;
        case 'ss':
        case 's':
          seconds = value;
          break;
        case 'SSS':
        case 'S':
          milliseconds = value;
          break;
      }
    }

    // Normalize values
    if (milliseconds >= 1000) {
      seconds += Math.floor(milliseconds / 1000);
      milliseconds %= 1000;
    }

    if (seconds >= 60) {
      minutes += Math.floor(seconds / 60);
      seconds %= 60;
    }

    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes %= 60;
    }

    const time = new SignedTime(hours, minutes, seconds, milliseconds);
    return isNegative ? time.negate() : time;
  }

  /**
   * Adds two times together
   *
   * @param {SignedTime} other - Time to add
   * @returns {SignedTime} New SignedTime instance representing the sum
   *
   * @example
   * ```typescript
   * const time1 = new SignedTime(1, 30, 0);
   * const time2 = new SignedTime(0, 45, 0);
   * const sum = time1.add(time2); // 2 hours 15 minutes
   * ```
   */
  add(other: SignedTime): SignedTime {
    return SignedTime.fromMilliseconds(this.#totalMilliseconds + other.#totalMilliseconds);
  }

  /**
   * Subtracts one time from another
   *
   * @param {SignedTime} other - Time to subtract
   * @returns {SignedTime} New SignedTime instance representing the difference
   */
  subtract(other: SignedTime): SignedTime {
    return SignedTime.fromMilliseconds(this.#totalMilliseconds - other.#totalMilliseconds);
  }

  /**
   * Multiplies time by a scalar value
   *
   * @param {number} scalar - Multiplier
   * @returns {SignedTime} New SignedTime instance representing the product
   */
  multiply(scalar: number): SignedTime {
    return SignedTime.fromMilliseconds(this.#totalMilliseconds * scalar);
  }

  /**
   * Divides time by a scalar value
   *
   * @param {number} scalar - Divisor (non-zero)
   * @returns {SignedTime} New SignedTime instance representing the quotient
   * @throws {Error} When divisor is zero
   */
  divide(scalar: number): SignedTime {
    if (scalar === 0) {
      throw new Error('Division by zero is not allowed');
    }
    return SignedTime.fromMilliseconds(this.#totalMilliseconds / scalar);
  }

  /**
   * Negates the time value
   *
   * @returns {SignedTime} New SignedTime instance with negated value
   */
  negate(): SignedTime {
    return SignedTime.fromMilliseconds(-this.#totalMilliseconds);
  }

  /**
   * Gets the absolute value of the time
   *
   * @returns {SignedTime} New SignedTime instance with absolute value
   */
  abs(): SignedTime {
    return SignedTime.fromMilliseconds(Math.abs(this.#totalMilliseconds));
  }

  /**
   * Checks if two times are equal
   *
   * @param {SignedTime} other - Time to compare
   * @returns {boolean} True if equal, false otherwise
   */
  equals(other: SignedTime): boolean {
    return this.#totalMilliseconds === other.#totalMilliseconds;
  }

  /**
   * Checks if this time is greater than another
   *
   * @param {SignedTime} other - Time to compare
   * @returns {boolean} True if greater, false otherwise
   */
  isGreaterThan(other: SignedTime): boolean {
    return this.#totalMilliseconds > other.#totalMilliseconds;
  }

  /**
   * Checks if this time is less than another
   *
   * @param {SignedTime} other - Time to compare
   * @returns {boolean} True if less, false otherwise
   */
  isLessThan(other: SignedTime): boolean {
    return this.#totalMilliseconds < other.#totalMilliseconds;
  }

  /**
   * Checks if the time is zero
   *
   * @returns {boolean} True if zero, false otherwise
   */
  isZero(): boolean {
    return this.#totalMilliseconds === 0;
  }

  /**
   * Checks if the time is negative
   *
   * @returns {boolean} True if negative, false otherwise
   */
  isNegative(): boolean {
    return this.#totalMilliseconds < 0;
  }

  /**
   * Checks if the time is positive
   *
   * @returns {boolean} True if positive, false otherwise
   */
  isPositive(): boolean {
    return this.#totalMilliseconds > 0;
  }

  /**
   * Checks if the time is between two values
   *
   * @param {SignedTime} min - Minimum value
   * @param {SignedTime} max - Maximum value
   * @returns {boolean} True if between min and max, false otherwise
   */
  isBetween(min: SignedTime, max: SignedTime): boolean {
    return !this.isLessThan(min) && !this.isGreaterThan(max);
  }

  /**
   * Converts time to string
   *
   * @param {string} format - Format string (default: 'hh:mm:ss.SSS')
   * @returns {string} Formatted time string
   *
   * @example
   * ```typescript
   * const time = new SignedTime(1, 30, 45, 500);
   * console.log(time.toString()); // "01:30:45.500"
   * console.log(time.toString('h\h m\m s\s')); // "1h 30m 45s"
   * ```
   */
  toString(format: string = 'hh:mm:ss.SSS'): string {
    return SignedTime.formatMilliseconds(this.#totalMilliseconds, format);
  }

  /**
   * Formats milliseconds to a string according to the specified format
   *
   * Format patterns:
   * - hh: Hours with leading zero
   * - h: Hours without leading zero
   * - mm: Minutes with leading zero
   * - m: Minutes without leading zero
   * - ss: Seconds with leading zero
   * - s: Seconds without leading zero
   * - SSS: Milliseconds with leading zeros
   * - S: Milliseconds without leading zeros
   *
   * @param {number} milliseconds - Milliseconds to format
   * @param {string} format - Format string (default: 'hh:mm:ss.SSS')
   * @returns {string} Formatted time string
   */
  static formatMilliseconds(milliseconds: number, format: string = 'hh:mm:ss.SSS'): string {
    const isNegative = milliseconds < 0;
    const absMs = Math.abs(milliseconds);

    const hours = Math.floor(absMs / 3600000);
    const minutes = Math.floor((absMs % 3600000) / 60000);
    const seconds = Math.floor((absMs % 60000) / 1000);
    const ms = absMs % 1000;

    const result = format
      .replace('hh', hours.toString().padStart(2, '0'))
      .replace('h', hours.toString())
      .replace('mm', minutes.toString().padStart(2, '0'))
      .replace('m', minutes.toString())
      .replace('ss', seconds.toString().padStart(2, '0'))
      .replace('s', seconds.toString())
      .replace('SSS', ms.toString().padStart(3, '0'))
      .replace('S', ms.toString());

    return isNegative ? `-${result}` : result;
  }

  /**
   * Rounds time to the nearest second
   *
   * @returns {SignedTime} New SignedTime instance rounded to seconds
   */
  roundToSecond(): SignedTime {
    const rounded = Math.round(this.#totalMilliseconds / 1000) * 1000;
    return SignedTime.fromMilliseconds(rounded);
  }

  /**
   * Rounds time to the nearest minute
   *
   * @returns {SignedTime} New SignedTime instance rounded to minutes
   */
  roundToMinute(): SignedTime {
    const rounded = Math.round(this.#totalMilliseconds / 60000) * 60000;
    return SignedTime.fromMilliseconds(rounded);
  }

  /**
   * Rounds time to the nearest hour
   *
   * @returns {SignedTime} New SignedTime instance rounded to hours
   */
  roundToHour(): SignedTime {
    const rounded = Math.round(this.#totalMilliseconds / 3600000) * 3600000;
    return SignedTime.fromMilliseconds(rounded);
  }

  /**
   * Clamps time between minimum and maximum values
   *
   * @param {SignedTime} min - Minimum value
   * @param {SignedTime} max - Maximum value
   * @returns {SignedTime} New SignedTime instance clamped between min and max
   */
  clamp(min: SignedTime, max: SignedTime): SignedTime {
    if (this.isLessThan(min)) return min;
    if (this.isGreaterThan(max)) return max;
    return this;
  }

  /**
   * Gets the total milliseconds
   *
   * @returns {number} Total milliseconds
   */
  get totalMilliseconds(): number {
    return this.#totalMilliseconds;
  }

  /**
   * Gets the hours component
   *
   * @returns {number} Hours
   */
  get hours(): number {
    return (
      Math.floor(Math.abs(this.#totalMilliseconds) / 3600000) * Math.sign(this.#totalMilliseconds)
    );
  }

  /**
   * Gets the minutes component
   *
   * @returns {number} Minutes
   */
  get minutes(): number {
    return (
      Math.floor((Math.abs(this.#totalMilliseconds) % 3600000) / 60000) *
      Math.sign(this.#totalMilliseconds)
    );
  }

  /**
   * Gets the seconds component
   *
   * @returns {number} Seconds
   */
  get seconds(): number {
    return (
      Math.floor((Math.abs(this.#totalMilliseconds) % 60000) / 1000) *
      Math.sign(this.#totalMilliseconds)
    );
  }

  /**
   * Gets the milliseconds component
   *
   * @returns {number} Milliseconds
   */
  get milliseconds(): number {
    return (Math.abs(this.#totalMilliseconds) % 1000) * Math.sign(this.#totalMilliseconds);
  }
}
