import React, { Fragment, useMemo } from 'react';
import moment from 'moment';
import {
  Calendar,
  Views,
  momentLocalizer,
} from 'react-big-calendar';

import events from './events_mock';
import "./MealPlanCalendar.scss";

const mLocalizer = momentLocalizer(moment);

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
    {types.map((type, index) => (<div key={index} className="dot"></div>))}
    </div>
  )
}

const Basic: React.FC = () => {
    const { components} = useMemo(
    () => ({
      components: {
        month: {
          event: CustomMonthlyEvent,
        },
      },
    }),
    []
  )

  const customViews = {
    month: true,
  }

  return (
    <Fragment>
      <div>test</div>
      <div className="height600">
        <Calendar
          defaultDate={new Date(2024, 9, 29)}
          defaultView={Views.MONTH}
          events={events}
          localizer={mLocalizer}
          views={customViews}
        //   step={240}
        //   timeslots={1}
          components={components}
          showAllEvents
          selectable
          onSelectSlot={(slotInfo) => {
            console.log("selected",slotInfo.start);
          }}
        />
      </div>
    </Fragment>
  );
};

export default Basic;
