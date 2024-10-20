import { Form } from "react-bootstrap";
import { updateSchoolMeal } from "../../Api/api";
import { SchoolMealInterface } from "../../Api/apiInterface";
import { useState } from "react";

interface SchoolMealDaySelectProps {
    mealDays: string[];
    mealDay: number;
    mealId: number;
    selectedMealDay: string;
    setSelectedMealDay: (newMealDay: string) => void;
}


const SchoolMealDaySelect: React.FC<SchoolMealDaySelectProps> = ({ mealDays, mealDay, mealId, selectedMealDay, setSelectedMealDay }) => {
    
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMealDay(e.target.value); 

        const dayNumber = mealDays.findIndex(item => item.toLowerCase() === e.target.value.toLowerCase());

        const meal:SchoolMealInterface = {
            day: dayNumber
        }

        updateSchoolMeal(mealId, meal)
        .then(response => {
            console.log(mealId, meal.day);
        })
        .catch(error => {
            console.log("Error updating recipe", error);
            const errorMessage = error?.response?.data?.message || "Error updating recipe";
            setStatus("error");
            setErrorMessages([...errorMessages, errorMessage]);
        });

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
