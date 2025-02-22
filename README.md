# Time delta

A TypeScript library for time calculations. Provides functionality for calculating time differences, time arithmetic operations, and format conversions.

## Features

- ⚡️ Time difference calculations and operations
- 🎯 Type safety with TypeScript
- ✅ Comprehensive test coverage with Vitest
- 📦 Supports both ES Modules and CommonJS

## Installation

```bash
npm install @fcf-ebisawa/time-delta
```

## Basic Usage

### Calculating Time Differences

```typescript
import { duration, timeDiff } from '@fcf-ebisawa/time-delta';

// Basic time difference calculation
const diff = duration(new Date('2024-01-01T10:00:00'), new Date('2024-01-01T12:30:00'));
console.log(diff.toString()); // "02:30:00.000"

// Time difference calculation with options
const roundedDiff = timeDiff(new Date('2024-01-01T10:00:00'), new Date('2024-01-01T12:30:45'), {
  roundTo: 'hour',
});
console.log(roundedDiff.toString()); // "03:00:00.000"
```

### Using SignedTime Class

```typescript
import { SignedTime } from '@fcf-ebisawa/time-delta';

// Creating an instance
const time = new SignedTime(1, 30, 45, 500); // 1 hour 30 minutes 45 seconds 500 milliseconds
console.log(time.toString()); // "01:30:45.500"

// Adding time
const time1 = new SignedTime(1, 30, 0);
const time2 = new SignedTime(0, 45, 0);
const sum = time1.add(time2);
console.log(sum.toString()); // "02:15:00.000"

// Custom format
console.log(time.toString('h hours m minutes s seconds')); // "1 hours 30 minutes 45 seconds"

// Comparing times
const isGreater = time1.isGreaterThan(time2); // true
```

## API Reference

### duration(from: DateLike, to: DateLike): SignedTime

Calculates the time difference between two dates.

- **Parameters**
  - `from`: Start date/time (Date, string, or number)
  - `to`: End date/time (Date, string, or number)
- **Returns**: SignedTime instance

### timeDiff(from: DateLike, to: DateLike, options?): SignedTime

Calculates the time difference between two dates and processes it based on options.

- **Parameters**
  - `from`: Start date/time
  - `to`: End date/time
  - `options`:
    - `absolute`: If true, converts the result to absolute value
    - `roundTo`: Rounding unit ('hour' | 'minute' | 'second')
- **Returns**: SignedTime instance

### SignedTime

A class representing time that provides the following features:

- Time addition, subtraction, multiplication, and division
- Time comparison
- Format conversion
- Rounding operations
- Absolute value calculation
- Sign inversion

For detailed methods and properties, please refer to the JSDoc comments in the source code.

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test
npm run test:coverage

# Lint and format
npm run lint
npm run lint:fix
npm run format

# Build
npm run build
```

## License

[Apache-2.0](LICENSE)

---

> [!NOTE]
> Please report bugs and feature requests through GitHub Issues.
