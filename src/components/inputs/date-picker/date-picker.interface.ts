export interface DatePickerProps {
  date?: Date;
  disablePast?: boolean;
  disableFuture?: boolean;
  yearRange?: number;
  className?: string;
  style?: React.CSSProperties;
}
