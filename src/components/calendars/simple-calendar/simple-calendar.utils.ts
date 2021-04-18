import * as dateFns from 'date-fns';

const CALENDAR_WEEKS = 6;

function getYearRange(
  range: number,
  options: {
    includePast?: boolean;
    includeFuture?: boolean;
  } = { includePast: true, includeFuture: false }
) {
  const { includePast, includeFuture } = options;
  let year = new Date().getFullYear();
  let pastYear = year;
  let futureYear = year;
  let years: number[] = [];
  for (let i = 0; i <= range; i++) {
    if (includePast || (!includePast && !includeFuture)) {
      if (!years.includes(pastYear)) {
        years = [...years, pastYear];
      }
      pastYear--;
    }
    if (includeFuture) {
      if (!years.includes(futureYear)) {
        years = [futureYear, ...years];
      }
      futureYear++;
    }
  }
  return years;
}

const months = (function () {
  let months = [];
  let date = dateFns.startOfYear(dateFns.startOfMonth(new Date()));
  for (let i = 0; i < 12; i++) {
    const month = {
      month: dateFns.getMonth(date) + 1,
      longName: date.toLocaleString(window.navigator.language, { month: 'long' }),
      shortName: date.toLocaleString(window.navigator.language, { month: 'short' }),
    };
    months.push(month);
    date = dateFns.addMonths(date, 1);
  }
  return months;
})();

const weekDays = (function () {
  const weekDays = new Map<string, string>();

  for (let i = 0; i < 7; i++) {
    let weekDay = dateFns.setDay(new Date(), i);
    const long = weekDay.toLocaleString(window.navigator.language, { weekday: 'long' });
    const short = weekDay.toLocaleString(window.navigator.language, { weekday: 'short' });
    weekDays.set(long, short);
  }
  return Object.entries(Object.fromEntries(weekDays));
})();

export { CALENDAR_WEEKS, getYearRange, months, weekDays };
