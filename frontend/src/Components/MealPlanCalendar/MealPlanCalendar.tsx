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
import { EventInterface } from '../../Utils/convertMealsToEvents';

const mLocalizer = momentLocalizer(moment);

interface MealPlanCalendarProps {
  startDate: Date;
  endDate: Date;
  selectedDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
}

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

const Basic: React.FC<MealPlanCalendarProps> = ({startDate, endDate, selectedDate, setStartDate, setEndDate, setSelectedDate}) => {
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  const clickRef = useRef<number | null>(null);

  const onSelectSlot = useCallback((slotInfo: SlotInfo) => {
    clickRef.current = window.setTimeout(() => {
      setSelectedSlot(slotInfo);
      setSelectedDate(slotInfo.start);
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

  const handleNavigate = (date: Date) => {
    const fromDate = moment(date).startOf('month').subtract(7, 'days');
    const toDate = moment(date).endOf('month').add(7, 'days');
    setStartDate(fromDate.toDate());
    setEndDate(toDate.toDate());
  };

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
          onNavigate={handleNavigate}
        />
      </div>
    </Fragment>
  );
};

export default Basic;
