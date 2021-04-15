import { ShimmerButtonProps } from './shimmer-button.interface';
import css from './shimmer-button.module.css';

export function ShimmerButton({ label, backgroundColor }: ShimmerButtonProps) {
  return (
    <button className={css.button} style={{ backgroundColor }}>
      {label}
    </button>
  );
}
