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
