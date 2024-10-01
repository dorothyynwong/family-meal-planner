import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import {
  Calendar,
  Views,
  momentLocalizer,
  SlotInfo,
} from 'react-big-calendar';

import events from './events_mock';
import "./MealPlanCalendar.scss";
import { EventInterface } from '../../Api/apiInterface';

const mLocalizer = momentLocalizer(moment);

interface CustomEventProps {
  event: EventInterface;
}

const CustomMonthlyEvent: React.FC<CustomEventProps> = ({ event }) => {
  const types = event.type;
  return (
    <div className="dot-wrapper">
      {types.map((type, index) => (<div key={index} className="dot"></div>))}
    </div>
  );
}

const Basic: React.FC = () => {
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  const clickRef = useRef<number | null>(null);

  const onSelectSlot = useCallback((slotInfo: SlotInfo) => {
    clickRef.current = window.setTimeout(() => {
      setSelectedSlot(slotInfo);
    }, 100);
  }, []);

  const { components } = useMemo(
    () => ({
      components: {
        month: {
          event: CustomMonthlyEvent,
        },
      },
    }),
    []
  );

  const customDayPropGetter = (date:Date) => {
    if (date.getDate() === selectedSlot?.start.getDate() && date.getMonth() === selectedSlot?.start.getMonth())
      return {
        className: "selected-date",
      }
    else return {}
  }

  return (
    <Fragment>
      <div className="meal-plan-calendar">
        <Calendar
          defaultDate={new Date()}
          defaultView={Views.MONTH}
          events={events}
          localizer={mLocalizer}
          views={{ month: true }}
          components={components}
          showAllEvents
          selectable
          longPressThreshold={10}
          onSelectSlot={onSelectSlot}
          dayPropGetter={customDayPropGetter}
        />
      </div>
    </Fragment>
  );
};

export default Basic;
