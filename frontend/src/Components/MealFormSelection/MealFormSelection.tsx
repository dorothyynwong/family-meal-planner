import { useState } from "react";
import { Form } from "react-bootstrap";

interface MealFormSelectProps{
    mealFormType: string;
    setMealFormType: (newSelect : string) => void;
}

const MealFormSelection: React.FC<MealFormSelectProps> = ({mealFormType, setMealFormType}) => {
    

    return (
        <div key={`inline-radio`} className="mb-3">
            <Form.Check
                inline
                label="Recipe"
                name="meal-form-type"
                value="recipe"
                type="radio"
                checked={mealFormType === "recipe"}
                onChange={(e) => setMealFormType("recipe")}
            />
            <Form.Check
                inline
                label="School Menu"
                name="meal-form-type"
                value="school-meal"
                type="radio"
                checked={mealFormType === "school-meal"}
                onChange={(e) => setMealFormType("school-meal")}
            />
        </div>

    )
}

export default MealFormSelection;