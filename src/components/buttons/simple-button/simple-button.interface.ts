export type SimpleButtonProps = Pick<JSX.IntrinsicElements['button'], 'onClick' | 'className' | 'style'> & {
  label: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'success' | 'danger';
};
