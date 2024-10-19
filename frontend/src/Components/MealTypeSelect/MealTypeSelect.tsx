import { Form } from "react-bootstrap";

interface MealTypeSelectProps {
  mealTypes: string[];
  selectedMealType: string;
  setSelectedMealType: (value: string) => void;
}

const MealTypeSelect: React.FC<MealTypeSelectProps> = ({ mealTypes, selectedMealType, setSelectedMealType }) => (
  <Form.Select
    className="mt-3 meal-type"
    aria-label="Meal Type"
    value={selectedMealType}
    onChange={(e) => setSelectedMealType(e.target.value)}
  >
    <option value="">Select a Meal Type</option>
    {mealTypes.map((mealType, index) => (
      <option key={index} value={mealType}>
        {mealType}
      </option>
    ))}
  </Form.Select>
);

export default MealTypeSelect;
