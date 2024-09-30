import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import {
  Calendar,
  Views,
  momentLocalizer,
  SlotInfo,
  EventProps
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
  );
}

// const customDayPropGetter = (date:Date) => {
//   if (date.getDate() === 7 || date.getDate() === 15)
//     return {
//       className: "specialDay",
//       style: {
//         border: 'solid 3px ' + (date.getDate() === 7 ? '#faa' : '#afa'),
//       },
//     }
//   else return {}
// }

// const customSlotPropGetter = (date:Date) => {
//   if (date.getDate() === 7 || date.getDate() === 15)
//     return {
//       className: "specialDay",
//     }
//   else return {}
// }

const Basic: React.FC = () => {
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  const customDayPropGetter = (date:Date) => {
    if (date.getDate() === selectedSlot?.start.getDate() && date.getMonth() === selectedSlot?.start.getMonth())
      return {
        className: "specialDay",
        style: {
          // border: 'solid 3px ' + (date.getDate() === selectedSlot?.start.getDate()? '#faa' : '#afa'),
          backgroundColor: ('#faa'),
        },
      }
    else return {}
  }


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

  const customViews = {
    month: true,
  }

  const clickRef = useRef<number | null>(null);

  const buildMessage = (slotInfo: SlotInfo) => {
    return `Selected slot from ${slotInfo.start} to ${slotInfo.end}`;
  };

  const eventPropGetter = useCallback(
    (event: Event) => {
      const isSelected =
        selectedSlot &&
        event.start.getTime() === selectedSlot.start.getTime(); // Compare timestamps

        const style = {
          backgroundColor: isSelected ? 'lightblue' : 'white',
        };
    
        // Debugging logs
        console.log("Event:", event);
        console.log("Selected Slot:", selectedSlot);
        console.log("Is Selected:", isSelected);
        console.log("Returning Style:", style);
    
        return {
          style,
        };
      },
      [selectedSlot]
    );

  const onSelectSlot = useCallback((slotInfo: SlotInfo) => {
    if (clickRef.current !== null) {
      window.clearTimeout(clickRef.current);
    }
    clickRef.current = window.setTimeout(() => {
      setSelectedSlot(slotInfo);
      console.log(buildMessage(slotInfo));
    }, 100);
  }, []);

  // Log selectedSlot whenever it changes
  useEffect(() => {
    console.log("selected", selectedSlot?.start);
  }, [selectedSlot]);

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
          components={components}
          showAllEvents
          selectable
          longPressThreshold={1}
          onSelectSlot={onSelectSlot}
          // eventPropGetter={eventPropGetter}
          dayPropGetter={customDayPropGetter}
        />
      </div>
    </Fragment>
  );
};

export default Basic;
