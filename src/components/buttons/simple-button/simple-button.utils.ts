import { SimpleButtonProps } from './simple-button.interface';

type size = SimpleButtonProps['size'];

export const simpleButtonSize: { [key: string]: string } = {
  xs: 'small',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  undefined: '',
};
