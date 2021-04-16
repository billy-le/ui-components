import { DatePicker } from './';
import { DatePickerProps } from './date-picker.interface';
import { Story } from '@storybook/react';

export default {
  title: 'Inputs/DatePicker',
  component: DatePicker,
};

const Template: Story<DatePickerProps> = (args) => <DatePicker {...args} />;
export const Default = Template.bind({});
Default.storyName = 'DatePicker';
