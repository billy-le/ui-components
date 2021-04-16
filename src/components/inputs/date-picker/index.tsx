import { useState, useRef, useEffect, useMemo } from 'react';
import { DatePickerProps } from './date-picker.interface';
import { SimpleCalendar } from 'components/calendars/simple-calendar';
import { startOfYear, endOfYear, addYears, subYears, format } from 'date-fns';
import { ReactComponent as CalendarIcon } from './calendar-alt-regular.svg';
import { debounce } from 'lodash';

import css from './date-picker.module.css';

const YEAR_RANGE_DEFAULT = 2;

export function DatePicker(props: DatePickerProps) {
  const [date, setDate] = useState(props.date ?? new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = format(date, 'yyyy-MM-dd');
    }
  }, [date]);

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) {
      return;
    }
    const date = e.target.value.split('-').map((numStr) => +numStr);
    const [year, month, day] = date;
    setDate(new Date(year, month - 1, day));
  }

  const debouncedDateChangeHandler = debounce(handleDateChange, 250);

  function handleCalendarChange(date: Date) {
    setDate(date);
  }

  function handleCalendarToggle() {
    setIsCalendarOpen(!isCalendarOpen);
  }

  const minYear = useMemo(
    () =>
      props.disablePast
        ? format(new Date(), 'yyyy-MM-dd')
        : format(startOfYear(subYears(new Date(), props.yearRange || YEAR_RANGE_DEFAULT)), 'yyyy-MM-dd'),
    [props.disablePast]
  );
  const maxYear = useMemo(
    () =>
      props.disableFuture
        ? format(new Date(), 'yyyy-MM-dd')
        : format(endOfYear(addYears(new Date(), props.yearRange || YEAR_RANGE_DEFAULT)), 'yyyy-MM-dd'),
    [props.disableFuture]
  );

  return (
    <>
      <div className={css.datePicker}>
        <input
          ref={inputRef}
          type='date'
          className={css.dateInput}
          onChange={debouncedDateChangeHandler}
          min={minYear}
          max={maxYear}
        />
        <div className={css.icon} onClick={handleCalendarToggle}>
          <CalendarIcon />
        </div>
      </div>

      {isCalendarOpen && (
        <SimpleCalendar
          {...props}
          yearRange={props.yearRange || YEAR_RANGE_DEFAULT}
          date={date}
          onChange={handleCalendarChange}
        />
      )}
    </>
  );
}
