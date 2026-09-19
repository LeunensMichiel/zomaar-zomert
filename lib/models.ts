// Override the auto-computed festival year via NEXT_PUBLIC_ZZ_FESTIVAL_YEAR.
// Leave unset to derive from today — rolls over the day after the last Sunday of July.
const overrideYearEnv = process.env.NEXT_PUBLIC_ZZ_FESTIVAL_YEAR;
const OVERRIDE_FESTIVAL_YEAR = overrideYearEnv ? Number(overrideYearEnv) : null;

// Days before Friday at which signup forms become active. Tweak if the
// festival's signup window shifts.
const SIGNUP_OPEN_DAYS_BEFORE = 30;

const toIsoDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const lastSundayOfJuly = (year: number) => {
  const julyEnd = new Date(year, 6, 31);
  return new Date(year, 6, 31 - julyEnd.getDay());
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const computeFestivalYear = (now: Date) => {
  const calendarYear = now.getFullYear();
  const dayAfterFestival = addDays(lastSundayOfJuly(calendarYear), 1);
  return now >= dayAfterFestival ? calendarYear + 1 : calendarYear;
};

export const ZZ_YEAR =
  OVERRIDE_FESTIVAL_YEAR ?? computeFestivalYear(new Date());

const sunday = lastSundayOfJuly(ZZ_YEAR);

export const ZZ_DATE_SUNDAY = toIsoDate(sunday);
export const ZZ_DATE_SATURDAY = toIsoDate(addDays(sunday, -1));
export const ZZ_DATE_FRIDAY = toIsoDate(addDays(sunday, -2));
export const ZZ_DATE_MONDAY = toIsoDate(addDays(sunday, 1));
export const ZZ_DATES = [ZZ_DATE_FRIDAY, ZZ_DATE_SATURDAY, ZZ_DATE_SUNDAY];
export const ENABLE_LINKS_DATE = toIsoDate(
  addDays(addDays(sunday, -2), -SIGNUP_OPEN_DAYS_BEFORE),
);
export const ZZ_DATE_FRIDAY_NEXT_YEAR = toIsoDate(
  addDays(lastSundayOfJuly(ZZ_YEAR + 1), -2),
);

type FestivalDay = "friday" | "saturday" | "sunday";

const DAY_TO_DATE: Record<FestivalDay, string> = {
  friday: ZZ_DATE_FRIDAY,
  saturday: ZZ_DATE_SATURDAY,
  sunday: ZZ_DATE_SUNDAY,
};

export const getDateByDayString = (day: FestivalDay) => DAY_TO_DATE[day];

export const isSignupOpen = (now: Date = new Date()) =>
  now >= new Date(ENABLE_LINKS_DATE) && now <= new Date(ZZ_DATE_SUNDAY);

// A Sanity-configured moment that has passed and belongs to the current
// edition. Dates left over from a past edition count as not set.
const isReachedThisEdition = (from?: string | null, now: Date = new Date()) =>
  !!from &&
  new Date(from) >= new Date(`${String(ZZ_YEAR)}-01-01T00:00:00Z`) &&
  now >= new Date(from);

// Per-event signup gate: open from a Sanity-configured `enabledFrom` moment
// through the end of the festival.
export const isSignupEnabled = (
  enabledFrom?: string | null,
  now: Date = new Date(),
) => isReachedThisEdition(enabledFrom, now) && now <= new Date(ZZ_DATE_SUNDAY);

// Per-event details gate: until `visibleFrom` is set for this edition, the
// activity shows a TBA state instead of last year's times and prices.
export const isDetailsVisible = (
  visibleFrom?: string | null,
  now: Date = new Date(),
) => isReachedThisEdition(visibleFrom, now);

// Off-season recap window: from the day after the previous edition until
// 1 March. Gate the Sanity fetch on this so the query stops running once the window closes.
export const ZZ_RECAP_YEAR = ZZ_YEAR - 1;
export const isRecapWindow = (now: Date = new Date()) =>
  now >= addDays(lastSundayOfJuly(ZZ_RECAP_YEAR), 1) &&
  now < new Date(ZZ_YEAR, 2, 1);

export const isGpxDownloadOpen = (
  visibleFrom?: string | null,
  visibleUntil?: string | null,
  now: Date = new Date(),
) =>
  !!visibleFrom &&
  now >= new Date(visibleFrom) &&
  (!visibleUntil || now <= new Date(visibleUntil));

export const ZZ_LATITUDE = 50.831583;
export const ZZ_LONGITUDE = 4.234742;
export const ZZ_MAPS_URL = `https://www.google.com/maps?q=${String(ZZ_LATITUDE)},${String(ZZ_LONGITUDE)}`;
