// Override the auto-computed festival year by setting NEXT_PUBLIC_ZZ_FESTIVAL_YEAR
// in your env (e.g. to preview the next edition early). Leave unset to derive
// from today — rolls to the next year the day after the last Sunday of July.
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

export type IImageCard = {
  title: string;
  subtitle: string;
  imgSrc: string;
  description?: string;
  date?: string;
  link?: string;
};

type FestivalDay = "friday" | "saturday" | "sunday";

const DAY_TO_DATE: Record<FestivalDay, string> = {
  friday: ZZ_DATE_FRIDAY,
  saturday: ZZ_DATE_SATURDAY,
  sunday: ZZ_DATE_SUNDAY,
};

export const getDateByDayString = (day: FestivalDay) => DAY_TO_DATE[day];

export const isSignupOpen = (now: Date = new Date()) =>
  now >= new Date(ENABLE_LINKS_DATE) && now <= new Date(ZZ_DATE_SUNDAY);
