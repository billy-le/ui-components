import React from 'react';

export interface SimpleCalendarProps {
  date: Date;
  onChange: (date: Date) => void;
  yearRange?: number;
  disablePast?: boolean;
  disableFuture?: boolean;
  weekDayFormat?: 'long' | 'short';
  dayHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}
