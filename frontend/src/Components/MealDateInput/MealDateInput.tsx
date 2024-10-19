import { Form } from "react-bootstrap";

interface DateInputProps {
  mealDate: string;
  setMealDate: (value: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ mealDate, setMealDate }) => (
  <Form.Control
    type="date"
    className="mt-3 meal-date"
    value={mealDate}
    onChange={(e) => setMealDate(e.target.value)}
  />
);

export default DateInput;
