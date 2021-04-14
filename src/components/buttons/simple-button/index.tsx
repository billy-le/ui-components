import { SimpleButtonProps } from './simple-button.interface';
import styles from './simple-button.module.css';

export function SimpleButton({ label, size, type, className = '', ...props }: SimpleButtonProps) {
  const classNames = [styles.button, size ? styles[`button-${size}`] : null, type ? styles[type] : null, className]
    .filter(Boolean)
    .join(' ');
  return (
    <button className={classNames} {...props}>
      {label}
    </button>
  );
}
