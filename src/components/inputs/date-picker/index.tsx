import React, { useState, useRef, useEffect } from 'react';
import { DatePickerProps } from './date-picker.interface';
import { SimpleCalendar } from 'components/calendars/simple-calendar';
import { getDaysInMonth } from 'date-fns';
import { ReactComponent as CalendarIcon } from './calendar-alt-regular.svg';
import { debounce } from 'lodash';
import { zeroPad } from './date-picker.utils';

import css from './date-picker.module.css';

const YEAR_RANGE_DEFAULT = 2;
const DEBOUNCE_DELAY = 500;
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
  const calendarButtonRef = useRef<HTMLButtonElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const _yearRange = yearRange || YEAR_RANGE_DEFAULT;
  const minYear = new Date().getFullYear() - _yearRange;
  const maxYear = new Date().getFullYear() + _yearRange;
  const keyDownMap = useRef({
    year: {
      ArrowRight() {
        calendarButtonRef.current?.focus();
      },
      ArrowLeft() {
        dayRef.current?.focus();
      },
    },
    month: {
      ArrowRight() {
        dayRef.current?.focus();
      },
      ArrowLeft() {
        // do nothing
      },
    },
    day: {
      ArrowRight() {
        yearRef.current?.focus();
      },
      ArrowLeft() {
        monthRef.current?.focus();
      },
    },
    button: {
      ArrowRight() {
        // do nothing
      },
      ArrowLeft() {
        yearRef.current?.focus();
      },
    },
  });

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
      setDate(newDate);
    }
  };

  const debouncedYearChange = debounce(handleYearChange, DEBOUNCE_DELAY);
  const debouncedMonthChange = debounce(handleMonthChange, DEBOUNCE_DELAY);
  const debouncedDayChange = debounce(handleDayChange, DEBOUNCE_DELAY);

  function handleKeyDown(input: 'year' | 'month' | 'day' | 'button') {
    return function (e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>) {
      const { code } = e;
      if (code === 'ArrowRight' || code === 'ArrowLeft') {
        keyDownMap.current[input][code]();
      }
    };
  }

  return (
    <>
      <div ref={datePickerRef} className={css.container}>
        <div className={[css.datePicker, className].join(' ')} style={style}>
          <div className={css.dateInputs}>
            <label htmlFor='month' className={css.srOnly} aria-label='month' />
            <input
              ref={monthRef}
              id='month'
              type='number'
              step='1'
              min='1'
              max='12'
              className={[css.dateInput, css.mm].join(' ')}
              placeholder='MM'
              inputMode='numeric'
              onChange={debouncedMonthChange}
              onKeyDown={handleKeyDown('month')}
            />
            <label htmlFor='day' className={css.srOnly} aria-label='day' />
            <input
              ref={dayRef}
              id='day'
              type='number'
              step='1'
              min='1'
              max={getDaysInMonth(date)}
              className={[css.dateInput, css.dd].join(' ')}
              placeholder='DD'
              inputMode='numeric'
              onChange={debouncedDayChange}
              onKeyDown={handleKeyDown('day')}
            />
            <label htmlFor='year' className={css.srOnly} aria-label='year' />
            <input
              ref={yearRef}
              id='year'
              type='number'
              step='1'
              min={minYear}
              max={maxYear}
              className={[css.dateInput, css.yyyy].join(' ')}
              placeholder='YYYY'
              inputMode='numeric'
              onChange={debouncedYearChange}
              onKeyDown={handleKeyDown('year')}
            />
          </div>
          <button
            ref={calendarButtonRef}
            className={css.icon}
            onClick={handleCalendarToggle}
            onKeyDown={handleKeyDown('button')}
          >
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
    </>
  );
}
