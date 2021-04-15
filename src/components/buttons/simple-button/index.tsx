import { useMemo } from 'react';
import { SimpleButtonProps } from './simple-button.interface';
import css from './simple-button.module.css';

export function SimpleButton({ label, size, type, className = '', inverted, ...props }: SimpleButtonProps) {
  const classNames = useMemo(() => {
    let classes = [css.button];

    if (size) {
      classes.push(css[`button-${size}`]);
    } else {
      classes.push(css['button-md']);
    }

    if (type) {
      classes.push(css[type]);
    } else {
      classes.push(css.primary);
    }

    if (inverted) {
      classes.push(css.inverted);
    }
    classes.push(className);
    return classes.join(' ');
  }, [size, type, inverted, className]);

  return (
    <button className={classNames} {...props}>
      {label}
    </button>
  );
}
