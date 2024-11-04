import { Button, Form } from "react-bootstrap";
import MealDateInput from "../MealDateInput/MealDateInput";
import MealTypeSelect from "../MealTypeSelect/MealTypeSelect";
import { useMeal } from "../MealContext/MealContext";
import useMealForm from "../../Hooks/useMealForm";
import  { Dayjs } from 'dayjs';

interface MealFormBaseProps {
    isForFamily?: boolean
    selectedDate?: Dayjs
}

const MealFormBase:React.FC<MealFormBaseProps> = ({selectedDate}) => {
    const { mode,
        selectedMealType,
        setSelectedMealType,
        mealNotes,
        setMealNotes,
        mealTypes,
        formType
    } = useMeal();

    const { handleDelete } = useMealForm(selectedDate);
    

    return (
        <>
            <MealDateInput  />
            
            {formType !== "school-meal" ?
                <MealTypeSelect mealTypes={mealTypes} selectedMealType={selectedMealType} setSelectedMealType={setSelectedMealType}/>
            : <></>
            }
            <Form.Group controlId="meal-notes">
                <Form.Control className="mt-3 custom-form-control" as="textarea" rows={3} placeholder="Notes" name="notes" value={mealNotes} onChange={(e) => setMealNotes(e.target.value)} />
            </Form.Group>
            <Button className="mt-3 custom-button" type="submit">{mode === "Add" ? "Add" : "Update"}</Button>
            {mode === "Edit" && <Button className="mt-3 custom-button" onClick={handleDelete}>Delete</Button>}
        </>
    )
}

export default MealFormBase;