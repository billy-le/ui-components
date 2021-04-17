import { useMemo } from 'react';
import * as dateFns from 'date-fns';
import { SimpleCalendarProps } from './simple-calendar.interface';
import { yearRange, months, weekDays, CALENDAR_WEEKS } from './simple-calendar.utils';
import css from './simple-calendar.module.css';

export function SimpleCalendar({
  date: dateProp = new Date(),
  yearRange: yearRangeProp,
  disablePast,
  disableFuture,
  weekDayFormat,
  onChange,
  dayHeight = 100,
  className = '',
  style,
}: SimpleCalendarProps) {
  const years = useMemo(() => {
    let years = yearRange(yearRangeProp || 20, {
      includePast: !disablePast,
      includeFuture: !disableFuture,
    });
    return years;
  }, [yearRangeProp, disablePast, disableFuture]);

  const days = useMemo(() => {
    const month = dateProp.getMonth();
    const year = dateProp.getFullYear();
    const day = dateProp.getDate();
    let date = dateFns.startOfWeek(dateFns.startOfMonth(dateProp));
    let days = [];
    for (let i = 0; i < CALENDAR_WEEKS; i++) {
      let inner = [];
      for (let j = 0; j < 7; j++) {
        const dateMonth = dateFns.getMonth(date);
        const currentMonth = dateFns.getMonth(new Date(year, month));
        const dateDay = dateFns.getDate(date);
        const currentDay = dateFns.getDate(new Date(year, month, day));
        const calendarDay = {
          calendarDate: date,
          calendarDay: dateFns.getDate(date),
          isPrevMonth: dateMonth < currentMonth,
          isNextMonth: dateMonth > currentMonth,
          isPrevDay: dateDay < currentDay,
          isNextDay: dateDay > currentDay,
          isSameMonth: dateFns.isSameMonth(date, new Date(year, month)),
        };
        inner.push(calendarDay);
        date = dateFns.addDays(date, 1);
      }
      if (inner.every((day) => !day.isSameMonth)) {
        inner = [];
      }
      days.push(inner);
    }
    return days.flat();
  }, [dateProp]);

  function handlePrevMonth() {
    const month = dateProp.getMonth();
    const year = dateProp.getFullYear();
    const day = dateProp.getDate();
    const prevMonth = month > 0 ? month - 1 : 11;
    const daysInMonth = dateFns.getDaysInMonth(new Date(year, prevMonth));
    onChange(new Date(year, prevMonth, day > daysInMonth ? daysInMonth : day));
  }

  function handleNextMonth() {
    const month = dateProp.getMonth();
    const year = dateProp.getFullYear();
    const day = dateProp.getDate();
    const nextMonth = month < 11 ? month + 1 : 0;
    const daysInMonth = dateFns.getDaysInMonth(new Date(year, nextMonth));
    onChange(new Date(year, nextMonth, day > daysInMonth ? daysInMonth : day));
  }

  function handleMonthChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const year = dateProp.getFullYear();
    const day = dateProp.getDate();
    const { value } = e.target;
    const month = parseInt(value, 10);
    const daysInMonth = dateFns.getDaysInMonth(new Date(year, month - 1));
    onChange(new Date(year, month - 1, day > daysInMonth ? daysInMonth : day));
  }

  function handlePrevYear() {
    const month = dateProp.getMonth();
    const year = dateProp.getFullYear();
    const day = dateProp.getDate();
    const prevYear = year - 1;
    const minYear = years[years.length - 1];
    const isWithinRange = years.includes(prevYear);
    const _year = isWithinRange ? prevYear : minYear;
    onChange(new Date(_year, month, day));
  }

  function handleNextYear() {
    const month = dateProp.getMonth();
    const year = dateProp.getFullYear();
    const day = dateProp.getDate();
    const nextYear = year + 1;
    const maxYear = years[0];
    const isWithinRange = years.includes(nextYear);
    const _year = isWithinRange ? nextYear : maxYear;
    onChange(new Date(_year, month, day));
  }

  function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const month = dateProp.getMonth();
    const day = dateProp.getDate();
    const { value } = e.target;
    onChange(new Date(parseInt(value, 10), month, day));
  }

  function handleDayClick(day: number) {
    return function (e: React.MouseEvent) {
      const month = dateProp.getMonth();
      const year = dateProp.getFullYear();
      onChange(new Date(year, month, day));
    };
  }

  return (
    <div className={[css.calendarContainer, className].join(' ')} style={style}>
      <div className={css.controls}>
        <div className={css.row}>
          <button onClick={handlePrevMonth} aria-label='previous month'>
            prev
          </button>
          <select onChange={handleMonthChange} value={dateProp.getMonth() + 1}>
            {months.map(({ month, longName }) => (
              <option key={month} value={month}>
                {longName}
              </option>
            ))}
          </select>
          <button onClick={handleNextMonth} aria-label='next month'>
            next
          </button>
        </div>
        <div className={css.row}>
          <button onClick={handlePrevYear} aria-label='previous year'>
            prev
          </button>
          <select onChange={handleYearChange} value={dateProp.getFullYear()}>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button onClick={handleNextYear} aria-label='next year'>
            next
          </button>
        </div>
      </div>
      <div className={css.calendar}>
        {weekDays.map(([long, short]) => {
          return (
            <h3 key={short} className={css.dayOfWeek}>
              {!weekDayFormat || weekDayFormat === 'long' ? long : short}
            </h3>
          );
        })}

        {days.map(({ calendarDate, calendarDay, isPrevMonth, isNextMonth, isSameMonth }, index) => {
          let selectedDate =
            calendarDay !== dateProp.getDate()
              ? false
              : dateFns.isSameDay(
                  new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate()),
                  new Date(dateProp.getFullYear(), dateProp.getMonth(), calendarDay)
                );

          return (
            <div
              tabIndex={0}
              className={css.day}
              key={index}
              style={{
                backgroundColor: selectedDate
                  ? '#E9EAEC'
                  : isSameMonth
                  ? undefined
                  : isPrevMonth
                  ? `#9FA3AC`
                  : isNextMonth
                  ? '#9FA3AC'
                  : undefined,
                height: dayHeight,
              }}
              onClick={handleDayClick(calendarDay)}
              role='gridcell'
              aria-selected={selectedDate}
            >
              <div className={css.dayNumber}>{calendarDay}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
