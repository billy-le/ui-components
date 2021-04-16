export interface SimpleCalendarProps {
  date: Date;
  onChange: (date: Date) => void;
  yearRange?: number;
  disablePast?: boolean;
  disableFuture?: boolean;
}
