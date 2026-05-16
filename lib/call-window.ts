/**
 * KSA confirmation-call window helper.
 *
 * Sales/CX dials COD customers from **9:00 AM to 9:00 PM Asia/Riyadh** (UTC+3, no DST).
 * Inside the window we promise a call within ~10 minutes of order creation.
 * Outside the window we promise a call the next morning at 9:00 AM KSA.
 *
 * Everything is computed from a single reference instant + the order's `created_at`
 * so the banner reads consistently on the client even if the user keeps the page open.
 */

const KSA_OFFSET_MINUTES = 3 * 60;
const CALL_WINDOW_START_HOUR = 9;
const CALL_WINDOW_END_HOUR = 21;
const PROMISE_MINUTES = 10;

export interface CallWindowState {
  /** True if KSA local time is currently inside 9:00–21:00. */
  insideWindow: boolean;
  /** Estimated wall-clock instant the customer should expect the call. */
  expectedCallAt: Date;
  /** Minutes from `now` to `expectedCallAt`; 0 means "any moment now". */
  minutesUntilCall: number;
  /** Hours portion of `minutesUntilCall` for human-friendly outside-window copy. */
  hoursUntilCall: number;
  /** True when the promised 10-minute window has elapsed for this order. */
  promiseElapsed: boolean;
  /** Pre-formatted KSA local time strings for display. */
  ksaNowLabel: string;
  expectedCallLabel: string;
  /** True when the expected call is on the next KSA calendar day. */
  isTomorrow: boolean;
}

interface KsaParts {
  year: number;
  month: number; // 1–12
  day: number;
  hour: number; // 0–23
  minute: number;
  second: number;
}

/**
 * Convert any `Date` to its KSA calendar parts.
 * KSA has no DST so a fixed +03:00 offset is exact.
 */
function toKsaParts(when: Date): KsaParts {
  const ksaMs = when.getTime() + KSA_OFFSET_MINUTES * 60_000;
  const shifted = new Date(ksaMs);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    second: shifted.getUTCSeconds(),
  };
}

/** Build a real `Date` from KSA calendar parts (treating them as Asia/Riyadh local). */
function fromKsaParts(parts: KsaParts): Date {
  const utcMs = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );
  return new Date(utcMs - KSA_OFFSET_MINUTES * 60_000);
}

function formatKsaClock(parts: KsaParts): string {
  const hh = String(parts.hour).padStart(2, "0");
  const mm = String(parts.minute).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * Compute the call-window state at the given `now`, anchored to when the order was placed.
 *
 * @param now Reference instant (defaults to `new Date()`).
 * @param orderCreatedAt Order placement timestamp; the 10-minute promise counts from here.
 */
export function computeCallWindow(
  now: Date = new Date(),
  orderCreatedAt?: Date | null
): CallWindowState {
  const ksaNow = toKsaParts(now);
  const insideWindow =
    ksaNow.hour >= CALL_WINDOW_START_HOUR && ksaNow.hour < CALL_WINDOW_END_HOUR;

  let expectedCallAt: Date;
  let isTomorrow = false;

  if (insideWindow) {
    /* Anchor the 10-min promise to the order timestamp so the banner stays honest
       even if the customer reloads or comes back later. */
    const anchor = orderCreatedAt ?? now;
    expectedCallAt = new Date(anchor.getTime() + PROMISE_MINUTES * 60_000);
  } else {
    /* Next 9:00 AM KSA — today if pre-9, tomorrow if post-21. */
    const target: KsaParts = {
      year: ksaNow.year,
      month: ksaNow.month,
      day: ksaNow.day,
      hour: CALL_WINDOW_START_HOUR,
      minute: 0,
      second: 0,
    };
    if (ksaNow.hour >= CALL_WINDOW_END_HOUR) {
      /* roll forward one calendar day */
      const advanced = new Date(
        Date.UTC(target.year, target.month - 1, target.day + 1)
      );
      target.year = advanced.getUTCFullYear();
      target.month = advanced.getUTCMonth() + 1;
      target.day = advanced.getUTCDate();
      isTomorrow = true;
    }
    expectedCallAt = fromKsaParts(target);
  }

  const diffMs = expectedCallAt.getTime() - now.getTime();
  const minutesUntilCall = Math.max(0, Math.ceil(diffMs / 60_000));
  const hoursUntilCall = Math.max(0, Math.floor(minutesUntilCall / 60));

  const promiseElapsed = insideWindow && diffMs <= 0;

  return {
    insideWindow,
    expectedCallAt,
    minutesUntilCall,
    hoursUntilCall,
    promiseElapsed,
    ksaNowLabel: formatKsaClock(ksaNow),
    expectedCallLabel: formatKsaClock(toKsaParts(expectedCallAt)),
    isTomorrow,
  };
}

/** Parse an ISO string into a Date, returning null on failure. */
export function safeParseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
