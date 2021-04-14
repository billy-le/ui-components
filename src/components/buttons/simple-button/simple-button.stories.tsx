import { SimpleButton } from './';
import { SimpleButtonProps } from './simple-button.interface';
import { Story } from '@storybook/react';

export default {
  title: 'Buttons/SimpleButton',
  component: SimpleButton,
};

const Template: Story<SimpleButtonProps> = (args) => <SimpleButton {...args} />;
export const Default = Template.bind({});

Default.args = {
  label: 'Hello',
  size: 'lg',
  type: 'danger',
};

Default.storyName = 'SimpleButton';
