import moment from "moment";

export function e8sToIcp(x) {
  if (!x) return 0;
  return x / Math.pow(10, 8);
}

export function icpToE8s(x) {
  try {
    return BigInt(Math.round(x * 100000000));
  } catch (e) {
    return 0n;
  }
}

export function convertSecondsToDays(seconds) {
  const days = moment.duration(seconds, "seconds").asDays();
  return days;
}

export function convertNanosecondsToDays(nanoseconds) {
  const seconds = nanoseconds / 1e9;
  const days = moment.duration(seconds, "seconds").asDays();
  return days;
}

export function convertNanoToFormattedDate(timestampNanos, format = 'MMMM Do') {
  // Convert nanoseconds to milliseconds
  const timestampMillis = Math.floor(timestampNanos / 1_000_000);
  
  // Create a moment object from the milliseconds
  const momentDate = moment(timestampMillis);
  
  // Format the date as needed
  return momentDate.format(format);
}

export function convertSecondsToDaysOrHours(seconds) {
  const duration = moment.duration(seconds, "seconds");

  if (duration.asDays() <= 1) {
    // If less than or equal to one day, return hours
    const hours = duration.asHours();
    // Check if it's exactly 1 hour to adjust the unit
    return hours <= 1
      ? `${Math.ceil(hours)} hour`
      : `${Math.ceil(hours)} hours`;
  } else {
    // Otherwise, return days
    return `${Math.ceil(duration.asDays())} days`;
  }
}

export function deepConvertToString(obj) {
  // Base case: if obj is already a primitive type
  if (obj === null || typeof obj !== "object") {
    return String(obj);
  }

  // Special case: BigInt
  if (typeof obj === "bigint") {
    return obj.toString();
  }

  // Special case: Array
  if (Array.isArray(obj)) {
    return obj.map(deepConvertToString);
  }

  // Recursive case: object
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    // Special case: handle the "winner" key
    if (key === "winner") {
      newObj[key] = value.toString();
    } else {
      newObj[key] = deepConvertToString(value);
    }
  }

  return newObj;
}
