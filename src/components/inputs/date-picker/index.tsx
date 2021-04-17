import React, { useState, useRef, useEffect } from 'react';
import { DatePickerProps } from './date-picker.interface';
import { SimpleCalendar } from 'components/calendars/simple-calendar';
import { getDaysInMonth } from 'date-fns';
import { ReactComponent as CalendarIcon } from './calendar-alt-regular.svg';
import { debounce } from 'lodash';
import { zeroPad } from './date-picker.utils';

import css from './date-picker.module.css';

const YEAR_RANGE_DEFAULT = 2;
const monthsMax = [1, 3, 5, 8, 10];

export function DatePicker({
  date: dateProp,
  yearRange,
  disableFuture,
  disablePast,
  className = '',
  style,
}: DatePickerProps) {
  const [date, setDate] = useState(dateProp ?? new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const _yearRange = yearRange || YEAR_RANGE_DEFAULT;
  const minYear = new Date().getFullYear() - _yearRange;
  const maxYear = new Date().getFullYear() + _yearRange;

  useEffect(() => {
    if (yearRef.current) yearRef.current.value = date.getFullYear().toString();
    if (monthRef.current) monthRef.current.value = zeroPad(date.getMonth() + 1, 2);
    if (dayRef.current) dayRef.current.value = zeroPad(date.getDate(), 2);
  }, [date]);

  useEffect(() => {
    function handleOutsideClick(e: Event) {
      const target = e.target as HTMLElement;
      if (!datePickerRef.current?.contains(target) && isCalendarOpen) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isCalendarOpen]);

  function handleCalendarChange(date: Date) {
    setDate(date);
    if (monthRef.current) monthRef.current.value = zeroPad(date.getMonth() + 1, 2);
    if (dayRef.current) dayRef.current.value = zeroPad(date.getDate(), 2);
    if (yearRef.current) yearRef.current.value = date.getFullYear().toString();
  }

  function handleCalendarToggle() {
    setIsCalendarOpen(!isCalendarOpen);
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const month = date.getMonth();
    if (value) {
      let parsed = parseInt(value, 10);
      const newDate = new Date(date);
      if (parsed > maxYear) {
        newDate.setFullYear(maxYear);
      } else if (parsed < minYear) {
        newDate.setFullYear(minYear);
      } else {
        newDate.setFullYear(parsed);
      }

      const year = newDate.getFullYear();
      const daysInMonth = getDaysInMonth(new Date(year, month));
      if (getDaysInMonth(newDate) > daysInMonth) {
        newDate.setDate(daysInMonth);
        newDate.setMonth(month);
      }
      setDate(newDate);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value) {
      let parsed = parseInt(value, 10);
      let newDate = new Date(date);
      if (parsed > 12) {
        newDate.setMonth(11);
      } else if (parsed < 1) {
        newDate.setMonth(0);
      } else {
        if (monthsMax.includes(parsed - 1)) {
          const daysInMonth = getDaysInMonth(new Date(date.getFullYear(), parsed - 1));
          if (dayRef.current) {
            if (parseInt(dayRef.current.value, 10) > daysInMonth) {
              newDate.setDate(daysInMonth);
            }
          }
        }
        newDate.setMonth(parsed - 1);
      }

      const month = newDate.getMonth();
      if (monthRef.current) monthRef.current.value = zeroPad(month + 1, 2);
      setDate(newDate);
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const daysInMonth = getDaysInMonth(date);
    const { value } = e.target;
    if (value) {
      let parsed = parseInt(value, 10);
      const newDate = new Date(date);
      if (parsed > daysInMonth) {
        newDate.setDate(daysInMonth);
      } else if (parsed < 1) {
        newDate.setDate(1);
      } else {
        newDate.setDate(parsed);
      }
      const day = newDate.getDate();
      setDate(newDate);
    }
  };

  const debouncedYearChange = debounce(handleYearChange, 250);
  const debouncedMonthChange = debounce(handleMonthChange, 250);
  const debouncedDayChange = debounce(handleDayChange, 250);

  return (
    <div ref={datePickerRef} className={css.container}>
      <div className={[css.datePicker, className].join(' ')} style={style}>
        <div className={css.dateInputs}>
          <input
            ref={monthRef}
            type='number'
            step='1'
            min='01'
            max='12'
            className={[css.dateInput, css.mm].join(' ')}
            placeholder='MM'
            onChange={debouncedMonthChange}
          />
          <input
            ref={dayRef}
            type='number'
            step='1'
            min='01'
            max={getDaysInMonth(date)}
            className={[css.dateInput, css.dd].join(' ')}
            placeholder='DD'
            onChange={debouncedDayChange}
          />
          <input
            ref={yearRef}
            type='number'
            step='1'
            min={minYear}
            max={maxYear}
            className={[css.dateInput, css.yyyy].join(' ')}
            placeholder='YYYY'
            onChange={debouncedYearChange}
          />
        </div>
        <button className={css.icon} onClick={handleCalendarToggle}>
          <CalendarIcon />
        </button>
      </div>

      {isCalendarOpen && (
        <SimpleCalendar
          date={date}
          yearRange={_yearRange}
          disablePast={disablePast}
          disableFuture={disableFuture}
          weekDayFormat='short'
          onChange={handleCalendarChange}
          className={css.calendar}
          dayHeight={50}
        />
      )}
    </div>
  );
}
