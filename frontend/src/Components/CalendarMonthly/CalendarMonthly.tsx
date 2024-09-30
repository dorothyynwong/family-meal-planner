import React, { Fragment, useCallback, useMemo } from 'react';
import moment from 'moment';
import {
  Calendar,
  Views,
  momentLocalizer,
  DateLocalizer,
  CalendarProps,
} from 'react-big-calendar';
import events from './events2';
import "./CalendarMonthly.scss";

const mLocalizer = momentLocalizer(moment);

interface BasicProps extends Partial<CalendarProps> {
  localizer?: DateLocalizer;
  showDemoLink?: boolean;
}

// interface Event {
//   title: string;
//   start: Date;
//   end: Date;
//   allDay?: boolean;
// }

interface Event {
  title: string[];
  start: Date;
  end: Date;
  type: string[];
}

interface CustomEventProps {
  event: Event;
}


const CustomMonthlyEvent: React.FC<CustomEventProps> = ({ event }) => {
  const types = event.type;
  return (
    <div className="dot-wrapper">
    {types.map(type => (<div className="dot"></div>))}
    </div>
  )
}
const CustomWeeklyEvent: React.FC<CustomEventProps> = ({ event }) => {
  const titles = event.title;
  return (
    <>
    {titles.map(title => (<div>{title}</div>))}
    </>
  )
}

const Basic: React.FC<BasicProps> = ({ localizer = mLocalizer, showDemoLink = true, ...props }) => {
    const { components} = useMemo(
    () => ({
      components: {
        week: {
          event: CustomWeeklyEvent
        },
        month: {
          event: CustomMonthlyEvent,
        },
        event: CustomWeeklyEvent,
        timeSlotWrapper: () => null,
        
      },
    }),
    []
  )

  const eventPropGetter = useCallback(
    (event: Event, start: Date, end: Date, isSelected: boolean) => ({
      ...(isSelected && {
        style: {
          backgroundColor: '#000',
        },
      }),
      // ...(moment(start).hour() < 12 && {
      //   className: 'powderBlue',
      // }),
      // ...(event.title.includes('Meeting') && {
      //   className: 'darkGreen',
      // }),
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
          defaultDate={new Date(2024, 9, 29)}
          defaultView={Views.MONTH}
          eventPropGetter={eventPropGetter}
          events={events}
          localizer={mLocalizer}
          views={customViews}
          step={240}
          timeslots={1}
          components={components}
          showAllEvents
        />
      </div>
    </Fragment>
  );
};

export default Basic;
