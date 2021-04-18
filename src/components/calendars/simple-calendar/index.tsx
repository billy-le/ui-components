import { useEffect, useMemo, useRef, MouseEvent, ChangeEvent, KeyboardEvent } from 'react';
import * as dateFns from 'date-fns';
import { SimpleCalendarProps } from './simple-calendar.interface';
import { getYearRange, months, weekDays, CALENDAR_WEEKS } from './simple-calendar.utils';
import css from './simple-calendar.module.css';

export function SimpleCalendar({
  date: dateProp = new Date(),
  yearRange,
  disablePast,
  disableFuture,
  weekDayFormat,
  onChange,
  dayHeight = 100,
  className = '',
  style,
}: SimpleCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const keyDownActions = useRef({
    ArrowRight(element: HTMLDivElement) {
      const nextElementSibling = element.nextElementSibling as HTMLDivElement;
      const nextRowElement = element.parentElement?.nextElementSibling?.firstElementChild as HTMLDivElement;
      if (nextElementSibling) {
        nextElementSibling.focus();
      } else if (nextRowElement) {
        nextRowElement.focus();
      }
    },
    ArrowLeft(element: HTMLDivElement) {
      const previousElementSibling = element.previousElementSibling as HTMLDivElement;
      const previousRowLastElement = element.parentElement?.previousElementSibling?.lastElementChild as HTMLDivElement;
      if (previousElementSibling) {
        previousElementSibling.focus();
      } else if (previousRowLastElement) {
        previousRowLastElement.focus();
      }
    },
    ArrowUp(element: HTMLDivElement) {
      const parentElement = element.parentElement as HTMLDivElement;
      if (parentElement) {
        const index = Array.from(parentElement.children).indexOf(element);
        (parentElement.previousElementSibling?.children?.[index] as HTMLDivElement)?.focus();
      }
    },
    ArrowDown(element: HTMLDivElement) {
      const parentElement = element.parentElement as HTMLDivElement;
      if (parentElement) {
        const index = Array.from(parentElement.children).indexOf(element);
        (parentElement.nextElementSibling?.children?.[index] as HTMLDivElement)?.focus();
      }
    },
    Space(element: HTMLDivElement) {
      element.click();
      setDayFocus();
    },
    Enter(element: HTMLDivElement) {
      element.click();
      setDayFocus();
    },
  });

  useEffect(() => {
    setDayFocus();
  }, []);

  const years = useMemo(() => {
    let years = getYearRange(yearRange || 20, {
      includePast: !disablePast,
      includeFuture: !disableFuture,
    });
    return years;
  }, [yearRange, disablePast, disableFuture]);

  const calendar = useMemo(() => {
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
    return days;
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

  function handleYearChange(e: ChangeEvent<HTMLSelectElement>) {
    const month = dateProp.getMonth();
    const day = dateProp.getDate();
    const { value } = e.target;
    onChange(new Date(parseInt(value, 10), month, day));
  }

  function handleDayClick(date: Date) {
    return function (e: MouseEvent) {
      let year = date.getFullYear();
      const maxYear = new Date().getFullYear() + (yearRange || 20);
      const minYear = new Date().getFullYear() - (yearRange || 20);
      // prevent user from clicking outside of year range
      if (year > maxYear || year < minYear) {
        return;
      }
      let month = date.getMonth();
      let day = date.getDate();
      onChange(new Date(year, month, day));
      setDayFocus();
    };
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const { code } = e;
    const target = e.target as HTMLDivElement;
    if (
      code === 'ArrowRight' ||
      code === 'ArrowLeft' ||
      code === 'ArrowUp' ||
      code === 'ArrowDown' ||
      code === 'Space' ||
      code === 'Enter'
    ) {
      keyDownActions.current[code](target);
    }
  }

  function setDayFocus() {
    setTimeout(() => {
      (document.querySelector('[aria-selected="true"]') as HTMLDivElement)?.focus();
    }, 0);
  }

  return (
    <div ref={containerRef} className={[css.calendarContainer, className].join(' ')} style={style}>
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
      <div role='grid' className={css.calendar}>
        <div role='row' className={css.subgrid}>
          {weekDays.map(([long, short]) => {
            return (
              <h3 role='gridcell' key={short} className={css.dayOfWeek}>
                {!weekDayFormat || weekDayFormat === 'long' ? long : short}
              </h3>
            );
          })}
        </div>

        {calendar.map((week, weekIndex) => (
          <div key={weekIndex} role='row' className={css.subgrid}>
            {week.map(({ calendarDate, calendarDay, isPrevMonth, isNextMonth, isSameMonth }) => {
              let selectedDate =
                calendarDay !== dateProp.getDate()
                  ? false
                  : dateFns.isSameDay(
                      new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate()),
                      new Date(dateProp.getFullYear(), dateProp.getMonth(), calendarDay)
                    );

              return (
                <div
                  key={calendarDate.getTime()}
                  tabIndex={selectedDate ? 0 : -1}
                  role='gridcell'
                  aria-selected={selectedDate}
                  className={css.day}
                  style={{
                    backgroundColor: isSameMonth
                      ? undefined
                      : isPrevMonth
                      ? `#9FA3AC`
                      : isNextMonth
                      ? '#9FA3AC'
                      : undefined,
                    height: dayHeight,
                  }}
                  onClick={handleDayClick(calendarDate)}
                  onKeyDown={handleKeyDown}
                >
                  <div className={css.dayNumber}>{calendarDay}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
