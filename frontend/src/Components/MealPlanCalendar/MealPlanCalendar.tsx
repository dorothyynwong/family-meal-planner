import React, { Fragment, useCallback, useEffect, useMemo, useRef } from 'react';
import moment from 'moment';
import {
  Calendar,
  Views,
  momentLocalizer,
  SlotInfo
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


const clickRef = useRef<number | null>(null); // Type the ref to hold a timeout ID (number)

const buildMessage = (slotInfo: SlotInfo) => {
  return `Selected slot from ${slotInfo.start} to ${slotInfo.end}`;
};

const onSelectSlot = useCallback((slotInfo: SlotInfo) => {
  /**
   * We wait 250 milliseconds before firing our method to prevent both
   * 'click' and 'doubleClick' from firing in case of a double-click.
   */
  if (clickRef.current !== null) {
    window.clearTimeout(clickRef.current);
  }
  clickRef.current = window.setTimeout(() => {
    // window.alert(buildMessage(slotInfo));
    console.log(buildMessage(slotInfo));
  }, 100);
}, []);

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
          longPressThreshold={10}
          onSelectSlot={onSelectSlot}
        />
      </div>
    </Fragment>
  );
};

export default Basic;
