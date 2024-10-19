import { Form } from "react-bootstrap";
import { SchoolMealInterface } from "../../Api/apiInterface";
import { useMeal } from "../MealContext/MealContext";
import { useEffect, useState } from "react";
import { getSchoolMealsByDate } from "../../Api/api";

interface SchoolMenuSelectProps {
}

const SchoolMenuSelect: React.FC<SchoolMenuSelectProps> = ({}) => {
    const {mealDate} = useMeal();
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [schoolMeals, setSchoolMeals] = useState<SchoolMealInterface[]>();

    useEffect(() => 
    {
        getSchoolMealsByDate(6, mealDate)
        .then(response => {
            setStatus("loading");
            setSchoolMeals(response.data);
            console.log(schoolMeals);
        
        })
        .catch(error => {
            setSchoolMeals([]);
            console.log("Error getting school meals", error);
            const errorMessage = error?.response?.data?.message || "Error getting school meals";
            setStatus("error");
            setErrorMessages([...errorMessages, errorMessage]);
        });
    } ,[]);

    return (<>
        {schoolMeals && <Form.Select aria-label="Default select example">
            <option>Select a Meal</option>
            {schoolMeals.map((meal, index) => <option key={index} value={meal.id}>{meal.mealName} - {meal.category}</option>)}
        </Form.Select>}
    </>)
}

export default SchoolMenuSelect;