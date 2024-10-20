import { Form } from "react-bootstrap";

interface SchoolMealDaySelectProps {
    mealDays: string[];
    mealDay: number;
    selectedMealDay: string;
    setSelectedMealDay: (newMealDay: string) => void;
}


const SchoolMealDaySelect: React.FC<SchoolMealDaySelectProps> = ({ mealDays, mealDay, selectedMealDay, setSelectedMealDay }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMealDay(e.target.value); 
    };

    return (
        <Form.Select
            className="mt-3 meal-day"
            aria-label="School Meal Day"
            defaultValue={mealDays[mealDay]}
            onChange={handleChange}
        >
            <option value="">Select a Meal Day</option>
            {mealDays.map((mealDay, index) => (
                <option key={index} value={mealDay}>
                    {mealDay}
                </option>
            ))}
        </Form.Select>
    )
}
export default SchoolMealDaySelect;
