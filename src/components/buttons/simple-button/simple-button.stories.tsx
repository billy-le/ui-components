import { SimpleButton } from './';
import { SimpleButtonProps } from './simple-button.interface';
import { Story } from '@storybook/react';

export default {
  title: 'Buttons/SimpleButton',
  component: SimpleButton,
  args: {
    label: 'Save',
    inverted: false,
    disabled: false,
  },
  argTypes: {
    label: { control: { type: 'text' } },
    size: { options: ['xs', 'sm', 'md', 'lg'] },
    type: { options: ['primary', 'secondary', 'success', 'warning', 'danger'] },
  },
};

const Template: Story<SimpleButtonProps> = (args) => <SimpleButton {...args} />;
export const Default = Template.bind({});
Default.storyName = 'SimpleButton';
