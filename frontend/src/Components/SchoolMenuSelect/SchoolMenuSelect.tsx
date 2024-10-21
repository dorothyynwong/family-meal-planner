import { Form } from "react-bootstrap";
import { SchoolMealInterface } from "../../Api/apiInterface";
import { useMeal } from "../MealContext/MealContext";
import { useEffect, useState } from "react";
import { getSchoolMealsByDate } from "../../Api/api";
import StatusHandler from "../StatusHandler/StatusHandler";

interface SchoolMenuSelectProps {
}

const SchoolMenuSelect: React.FC<SchoolMenuSelectProps> = ({ }) => {
    const { mealDate, schoolMealId, setSchoolMealId } = useMeal();
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [schoolMeals, setSchoolMeals] = useState<SchoolMealInterface[]>([]);

    useEffect(() => {
        setSchoolMeals([]);
        getSchoolMealsByDate(6, mealDate)
            .then(response => {
                setStatus("loading");
                setSchoolMeals(response.data);
                setStatus("success");
            })
            .catch(error => {
                setSchoolMeals([]);
                console.log("Error getting school meals", error);
                const errorMessage = error?.response?.data?.message || "Error getting school meals";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });
    }, [mealDate]);

    return (<>
        <StatusHandler
            status={status}
            errorMessages={errorMessages}
            loadingMessage="getting school meals ..."
            successMessage=""
        >
            <></>
        </StatusHandler>
        {schoolMeals && schoolMeals.length >0 ? 
            <Form.Select aria-label="School Menu" 
                onChange={(e) => setSchoolMealId(Number(e.target.value))}
                defaultValue={schoolMealId}
                >
                <option>Select a Meal</option>
                
                {schoolMeals.map((meal, index) => 
                    <option key={index} 
                            value={meal.id}>{meal.mealName} - {meal.category}
                    </option>
                )}
            </Form.Select>
            :
            <div>No school menu for today</div>
        }
    </>)
}

export default SchoolMenuSelect;