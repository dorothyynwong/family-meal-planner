import {  SchoolMealInterface } from "../../Api/apiInterface";
import { Card, CardContent, CardHeader } from "@mui/material";
import { Form } from "react-bootstrap";
import SchoolMealDaySelect from "../SchoolMealDaySelect/SchoolMealDaySelect";
import { useState } from "react";

interface SchoolMealProps {
    meal: SchoolMealInterface;
    mealDays: string[];
}

const SchoolMealCard: React.FC<SchoolMealProps> = ({ meal, mealDays }) => {
    const [selectedMealDay, setSelectedMealDay] = useState("");
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    };

    return (
        <Card sx={{ maxWidth: 345, mx: 0, mb: 1 }} >
            <CardHeader title={meal.mealName} />
            <CardContent>
                <SchoolMealDaySelect mealDays={mealDays} selectedMealDay={selectedMealDay} setSelectedMealDay={setSelectedMealDay} />

                <Form.Group className="mb-3" controlId="school-meal-name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control className="custom-form-control"
                        type="text"
                        placeholder="Name"
                        name="name" value={meal.mealName ? meal.mealName : ""}
                        onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="school-meal-category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control className="custom-form-control"
                        type="text"
                        placeholder="Category"
                        name="category" value={meal.category ? meal.category : ""}
                        onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="school-meal-allergens">
                    <Form.Label>Allergens</Form.Label>
                    <Form.Control className="custom-form-control"
                        type="text"
                        placeholder="Allergens"
                        name="allergens" value={meal.allergens ? meal.allergens : ""}
                        onChange={handleChange} />
                </Form.Group>

            </CardContent>
        </Card>
    )
}

export default SchoolMealCard;