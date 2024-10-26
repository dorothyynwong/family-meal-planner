import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import {
  Calendar,
  Views,
  momentLocalizer,
  SlotInfo,
} from 'react-big-calendar';

import "./MealPlanCalendar.scss";
import { EventInterface } from '../../Utils/convertMealsToEvents';
import { useMeal } from '../MealContext/MealContext';

const mLocalizer = momentLocalizer(moment);

interface MealPlanCalendarProps {
  startDate: Date;
  endDate: Date;
  selectedDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  mealEvents: EventInterface[];
}

interface CustomEventProps {
  event: EventInterface;
}

const CustomMonthlyEvent: React.FC<CustomEventProps> = ({ event }) => {
  const types = event.type;
  const uniqueTypes = Array.from(new Set(types))
  return (
    <div className="dot-wrapper">
      {uniqueTypes.map((type, index) => (
        <div key={index} className={`dot ${type}`}></div>
      ))}
    </div>
  );
}

const Basic: React.FC<MealPlanCalendarProps> = ({ setStartDate, setEndDate, setSelectedDate, mealEvents }) => {
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const { setMealDate } = useMeal();

  const clickRef = useRef<number | null>(null);

  const onSelectSlot = useCallback((slotInfo: SlotInfo) => {
    clickRef.current = window.setTimeout(() => {
      setSelectedSlot(slotInfo);
      setSelectedDate(slotInfo.start);
      const date = slotInfo.start;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`
      setMealDate(formattedDate);
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

  const customDayPropGetter = (date: Date) => {
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
          events={mealEvents}
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
