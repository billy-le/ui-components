import { ShimmerButton } from './';
import { ShimmerButtonProps } from './shimmer-button.interface';
import { Story } from '@storybook/react';

export default {
  title: 'Buttons/ShimmerButton',
  component: ShimmerButton,
  argTypes: {
    label: {
      control: { type: 'text' },
      defaultValue: 'Shimmer',
    },
    backgroundColor: {
      control: { type: 'color' },
      defaultValue: '#6e16ff',
    },
  },
};

const Template: Story<ShimmerButtonProps> = (args) => <ShimmerButton {...args} />;
export const Default = Template.bind({});
Default.storyName = 'ShimmerButton';
