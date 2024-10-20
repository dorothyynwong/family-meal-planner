import { Form } from "react-bootstrap";

interface SchoolMealDaySelectProps {
  mealDays: string[];
  selectedMealDay: string;
  setSelectedMealDay: (newMealDay: string) => void;
}

const SchoolMealDaySelect: React.FC<SchoolMealDaySelectProps> = ({ mealDays, selectedMealDay, setSelectedMealDay }) => (
  <Form.Select
    className="mt-3 meal-day"
    aria-label="School Meal Day"
    value={selectedMealDay}
    onChange={(e) => setSelectedMealDay(e.target.value)}
  >
    <option value="">Select a Meal Day</option>
    {mealDays.map((mealDay, index) => (
      <option key={index} value={mealDay}>
        {mealDay}
      </option>
    ))}
  </Form.Select>
);

export default SchoolMealDaySelect;
