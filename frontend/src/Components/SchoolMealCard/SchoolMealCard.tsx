import { SchoolMealInterface } from "../../Api/apiInterface";
import { Card, CardContent } from "@mui/material";
import { Form } from "react-bootstrap";
import SchoolMealDaySelect from "../SchoolMealDaySelect/SchoolMealDaySelect";
import { useState } from "react";
import { updateSchoolMeal } from "../../Api/api";

interface SchoolMealProps {
    meal: SchoolMealInterface;
    mealDays: string[];
}

const SchoolMealCard: React.FC<SchoolMealProps> = ({ meal, mealDays }) => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [selectedMealDay, setSelectedMealDay] = useState("");

    const [mealData, setMealData] = useState<SchoolMealInterface>({
        mealName: meal.mealName || "",
        category: meal.category || "",
        allergens: meal.allergens || "",
    });


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        
        setMealData(prevData => ({
            ...prevData,
            [name]: value,
        }));

        updateSchoolMeal(meal.id!, mealData)
        .then(response => {
            console.log(meal.id, meal.day);
            setStatus("success");
        })
        .catch(error => {
            console.log("Error updating recipe", error);
            const errorMessage = error?.response?.data?.message || "Error updating recipe";
            setStatus("error");
            setErrorMessages([...errorMessages, errorMessage]);
        });
    };

    return (
        <Card sx={{ maxWidth: 345, mx: 0, mb: 1 }} >
            <CardContent>
                <SchoolMealDaySelect 
                    mealDays={mealDays}
                    mealDay={meal.day!}
                    mealId={meal.id!}
                    selectedMealDay={selectedMealDay}
                    setSelectedMealDay={setSelectedMealDay} />

                <Form.Group className="mb-3" controlId="school-meal-name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control className="custom-form-control"
                        type="text"
                        placeholder="Name"
                        name="mealName" 
                        // value={meal.mealName ? meal.mealName : ""}
                        value={mealData.mealName}
                        onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="school-meal-category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control className="custom-form-control"
                        type="text"
                        placeholder="Category"
                        name="category" 
                        // value={meal.category ? meal.category : ""}
                        value={mealData.category}
                        onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="school-meal-allergens">
                    <Form.Label>Allergens</Form.Label>
                    <Form.Control className="custom-form-control"
                        type="text"
                        placeholder="Allergens"
                        name="allergens" 
                        // value={meal.allergens ? meal.allergens : ""}
                        value={mealData.allergens}
                        onChange={handleChange} />
                </Form.Group>

            </CardContent>
        </Card>
    )
}

export default SchoolMealCard;