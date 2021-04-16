import { SimpleCalendar } from '.';
import { SimpleCalendarProps } from './simple-calendar.interface';
import { Story } from '@storybook/react';

export default {
  title: 'Calendars/SimpleCalendar',
  component: SimpleCalendar,
};

const Template: Story<SimpleCalendarProps> = (args) => <SimpleCalendar {...args} />;
export const Default = Template.bind({});
Default.args = {
  onChange: console.log,
};
Default.storyName = 'SimpleCalendar';
