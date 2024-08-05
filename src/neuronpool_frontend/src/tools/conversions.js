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

export function convertNanoToFormattedDate(timestampNanos, format = "MMM Do") {
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

export const getWinningChanceIncrease = (
  oldStakeE8s,
  newAmountIcp,
  totalStakeE8s,
  networkFeeE8s = 20000n
) => {
  // Validate input
  if (
    isNaN(oldStakeE8s) ||
    isNaN(newAmountIcp) ||
    isNaN(totalStakeE8s) ||
    oldStakeE8s < 0 ||
    newAmountIcp <= 0 ||
    totalStakeE8s <= 0
  ) {
    return `+ ??%`;
  }

  // Calculate the old percentage chance of winning based on the old stake and total stake
  const oldPercentageChance =
    (Number(oldStakeE8s) / Number(totalStakeE8s)) * 100;

  // Convert the new amount of ICP to e8s (smallest unit of ICP)
  const newAmount = Number(icpToE8s(newAmountIcp)) - Number(networkFeeE8s);

  // Calculate the new total stake after adding the new amount
  const newtotalStake = Number(totalStakeE8s) + newAmount;

  // Calculate the new stake after adding the new amount to the old stake
  const newStake = Number(oldStakeE8s) + newAmount;

  // Calculate the new percentage chance of winning based on the new stake and new total stake
  const newPercentageChance = (Number(newStake) / Number(newtotalStake)) * 100;

  // Return the increase in winning chance
  return `+ ${(newPercentageChance - oldPercentageChance).toFixed(4)}%`;
};
