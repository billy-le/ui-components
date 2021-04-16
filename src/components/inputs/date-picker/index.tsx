import { useMemo, useState, useEffect, useRef } from 'react';
import { DatePickerProps } from './date-picker.interface';
import * as dateFns from 'date-fns';
import css from './date-picker.module.css';

import { yearRange, months, weekDays, CALENDAR_WEEKS } from './date-picker.utils';

export function DatePicker(props: DatePickerProps) {
  const [month, setMonth] = useState(props.month ?? new Date().getMonth());
  const [year, setYear] = useState(props.year ?? new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(props.day ?? new Date().getDate());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.year != undefined) {
      setYear(props.year);
    }
    if (props.month != undefined) {
      setMonth(props.month);
    }
    if (props.day != undefined) {
      setSelectedDay(props.day);
    }
  }, [props.year, props.month, props.day]);

  const years = useMemo(() => {
    let years = yearRange(props.yearRange || 2, { includePast: !props.blockPast, includeFuture: !props.blockFuture });
    return years;
  }, [props.yearRange, props.blockPast, props.blockFuture]);

  const days = useMemo(() => {
    let date = dateFns.startOfWeek(new Date(year, month));
    let days = [];
    for (let i = 0; i < CALENDAR_WEEKS; i++) {
      let inner = [];
      for (let j = 0; j < 7; j++) {
        const dateMonth = dateFns.getMonth(date);
        const currentMonth = dateFns.getMonth(new Date(year, month));
        const dateDay = dateFns.getDate(date);
        const currentDay = dateFns.getDate(new Date(year, month, selectedDay));
        const day = {
          day: dateFns.getDate(date),
          isPrevMonth: dateMonth < currentMonth,
          isNextMonth: dateMonth > currentMonth,
          isPrevDay: dateDay < currentDay,
          isNextDay: dateDay > currentDay,
          isSameMonth: dateFns.isSameMonth(date, new Date(year, month)),
        };
        inner.push(day);
        date = dateFns.addDays(date, 1);
      }
      if (inner.every((day) => !day.isSameMonth)) {
        inner = [];
      }
      days.push(inner);
    }
    return days.flat();
  }, [month, year, selectedDay]);

  function handlePrevMonth() {
    const prevMonth = month > 0 ? month - 1 : 11;
    setMonth(prevMonth);
    setDateInputValue(year, prevMonth, selectedDay);
  }

  function handleNextMonth() {
    const nextMonth = month < 11 ? month + 1 : 0;
    setMonth(nextMonth);
    setDateInputValue(year, nextMonth, selectedDay);
  }

  function handleMonthChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = e.target;
    setMonth(parseInt(value, 10));
  }

  function handlePrevYear() {
    const prevYear = year - 1;
    const minYear = years[years.length - 1];
    const isWithinRange = years.includes(prevYear);
    const _year = isWithinRange ? prevYear : minYear;
    setYear(_year);
    setDateInputValue(_year, month, selectedDay);
  }

  function handleNextYear() {
    const nextYear = year + 1;
    const maxYear = years[0];
    const isWithinRange = years.includes(nextYear);
    const _year = isWithinRange ? nextYear : maxYear;
    setYear(_year);
    setDateInputValue(_year, month, selectedDay);
  }

  function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = e.target;
    setYear(parseInt(value, 10));
    setDateInputValue(parseInt(value, 10), month, selectedDay);
  }

  function handleDayClick(day: number) {
    return function (e: React.MouseEvent) {
      setSelectedDay(day);
      setDateInputValue(year, month, day);
    };
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) {
      return;
    }
    const date = e.target.value.split('-').map((numStr) => +numStr);
    const [year, month, day] = date;
    setYear(year);
    setMonth(month - 1); // subtract 1 because input value is not index zero-base but month state is
    setSelectedDay(day);
  }

  function setDateInputValue(year: number, month: number, day: number) {
    if (inputRef.current) {
      inputRef.current.value = dateFns.format(new Date(year, month, day), 'yyyy-MM-dd');
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type='date'
        className={css.dateInput}
        onChange={handleDateChange}
        min={`${years[years.length - 1]}-01-01`}
        max={`${years[0]}-12-31`}
      />
      <div className={css.row}>
        <button onClick={handlePrevYear}>prev</button>

        <select onChange={handleYearChange} defaultValue={year} value={year}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button onClick={handleNextYear}>next</button>
      </div>
      <div className={css.row}>
        <button onClick={handlePrevMonth}>prev</button>
        <select onChange={handleMonthChange} defaultValue={month} value={month}>
          {months.map(({ month, longName }) => (
            <option key={month} value={month}>
              {longName}
            </option>
          ))}
        </select>
        <button onClick={handleNextMonth}>next</button>
      </div>
      <div className={css.calendar}>
        {weekDays.map(([long, short]) => {
          return (
            <h3 key={short} className={css.dayOfWeek}>
              {long}
            </h3>
          );
        })}

        {days.map(({ day, isPrevMonth, isNextMonth, isSameMonth }, index) => {
          return (
            <div
              className={css.day}
              key={index}
              style={{
                backgroundColor:
                  selectedDay === day && isSameMonth
                    ? '#E9EAEC'
                    : isSameMonth
                    ? undefined
                    : isPrevMonth
                    ? `#9FA3AC`
                    : isNextMonth
                    ? '#9FA3AC'
                    : undefined,
              }}
              onClick={handleDayClick(day)}
            >
              <div className={css.dayNumber}>{day}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
