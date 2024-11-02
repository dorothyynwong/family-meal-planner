import { Form } from "react-bootstrap";

interface MealFormSelectProps{
    mealFormType: "recipe" | "school-meal"
    setMealFormType: (newSelect : "recipe" | "school-meal") => void;
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
                onChange={() => setMealFormType("recipe")}
            />
            <Form.Check
                inline
                label="School Menu"
                name="meal-form-type"
                value="school-meal"
                type="radio"
                checked={mealFormType === "school-meal"}
                onChange={() => setMealFormType("school-meal")}
            />
        </div>

    )
}

export default MealFormSelection;