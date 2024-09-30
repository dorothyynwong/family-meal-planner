import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import demoEvents from './events_mock'; // Ensure you have this mock data
import './MealPlanCalendar.scss';
import { click } from '@testing-library/user-event/dist/click';

const mLocalizer = momentLocalizer(moment);

const buildMessage = (slotInfo: SlotInfo) => {
  return `Selected slot from ${slotInfo.start} to ${slotInfo.end}`;
};

const Selectable: React.FC = () => {
  const clickRef = useRef<number | null>(null);

  useEffect(() => {
    /**
     * Prevent a memory leak, in case the interface is torn down
     * before the timeout is called.
     */
    return () => {
      if (clickRef.current !== null) {
        // window.clearTimeout(clickRef.current);
        console.log(clickRef.current);
      }
    };
  }, []);

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
    }, 250);
  }, []);

  const defaultDate = useMemo(() => new Date(2015, 3, 1), []);

  return (
    <div className="height600">
      <Calendar
        defaultDate={defaultDate}
        events={demoEvents}
        localizer={mLocalizer}
        onSelectSlot={onSelectSlot}
        selectable
      />
    </div>
  );
};

export default Selectable;
