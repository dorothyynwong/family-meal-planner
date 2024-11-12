import { Form } from "react-bootstrap";
import { useMeal } from "../MealContext/MealContext";

const MealDateInput: React.FC = () => {
  const { mealDate, setMealDate } = useMeal();

  return (
    <Form.Control
      type="date"
      className="mt-3 meal-date"
      value={mealDate}
      onChange={(e) => setMealDate(e.target.value)}
    />
  );
}

export default MealDateInput;
