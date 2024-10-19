import { Form } from "react-bootstrap";

interface MealDateInputProps {
  mealDate: string;
  setMealDate: (value: string) => void;
}

const MealDateInput: React.FC<MealDateInputProps> = ({ mealDate, setMealDate }) => (
  <Form.Control
    type="date"
    className="mt-3 meal-date"
    value={mealDate}
    onChange={(e) => setMealDate(e.target.value)}
  />
);

export default MealDateInput;
