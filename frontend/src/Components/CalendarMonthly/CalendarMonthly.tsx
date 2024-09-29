import React, { Fragment, useCallback, useMemo } from 'react';
import moment from 'moment';
import {
  Calendar,
  Views,
  momentLocalizer,
  DateLocalizer,
  View,
  CalendarProps,
} from 'react-big-calendar';
import events from './events';
import "./CalendarMonthly.scss";

const mLocalizer = momentLocalizer(moment);

const ColoredDateCellWrapper: React.FC<any> = ({ children }) =>
  React.cloneElement(React.Children.only(children) as React.ReactElement, {
    style: {
      backgroundColor: 'lightblue',
    },
  });

interface BasicProps extends Partial<CalendarProps> {
  localizer?: DateLocalizer;
  showDemoLink?: boolean;
}

interface Event {
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
  }

const Basic: React.FC<BasicProps> = ({ localizer = mLocalizer, showDemoLink = true, ...props }) => {
  const { components, defaultDate, max, views } = useMemo(() => ({
    components: {
      timeSlotWrapper: ColoredDateCellWrapper,
    },
    defaultDate: new Date(2015, 3, 1),
    max: new Date(2047, 7, 1),
    views: Object.keys(Views).map((k) => Views[k as keyof typeof Views]) as View[],
  }), []);

  const eventPropGetter = useCallback(
    (event:Event, start:Date, end:Date, isSelected:boolean) => ({
      ...(isSelected && {
        style: {
          backgroundColor: '#000',
        },
      }),
      ...(moment(start).hour() < 12 && {
        className: 'powderBlue',
      }),
      ...(event.title.includes('Meeting') && {
        className: 'darkGreen',
      }),
    }),
    []
  )

  const customViews = {
    month: true,
    week: true,
    day: true,
  }

  return (
    <Fragment>
        <div>test</div>
        <div className="height600">
      <Calendar
        defaultDate={new Date(2015, 3, 13)}
        defaultView={Views.MONTH}
        eventPropGetter={eventPropGetter}
        events={events}
        localizer={mLocalizer}
        views={customViews}
        step={240}
        timeslots={1}
      />
    </div>
      {/* {showDemoLink && <DemoLink fileName="basic" />}
      <div className="height600">
        <Calendar
          components={components}
          defaultDate={defaultDate}
          events={events}
          eventPropGetter={eventPropGetter}
          localizer={localizer}
          max={max}
          showMultiDayTimes
          step={60}
          views={views}
          {...props} // Spread props here into Calendar component
        />
      </div> */}
    </Fragment>
  );
};

export default Basic;
