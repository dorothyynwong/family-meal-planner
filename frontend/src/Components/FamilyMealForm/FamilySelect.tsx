import { Form } from "react-bootstrap";
import { FamilyWithUsersInterface } from "../../Api/apiInterface";
import { useMeal } from "../MealContext/MealContext";
import { useState } from "react";

interface FamilySelectProps {
    data: FamilyWithUsersInterface[];
}

const FamilySelect: React.FC<FamilySelectProps> = ({ data }) => {
    const familiesAsCook = data.filter(fu => fu.familyRole === "Cook");

    const { 
        selectedFamily,
        setSelectedFamily
    } = useMeal();

    const initialValue = familiesAsCook[0]?.familyId;
    const [value, setValue] = useState<number>(selectedFamily ? selectedFamily?.familyId : initialValue);



    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(event.target.value, 10);
        if (isNaN(value)) {
            console.error("Invalid input value");
            return;
        }
        const family = familiesAsCook.find(fu => fu.familyId === value);
        setValue(parseInt(event.target.value));
        setSelectedFamily(family!);
    };

    return (
        <Form.Select
            className="mt-3 meal-type"
            aria-label="Family"
            value={value}
            onChange={handleChange}
        >
            <option value="">Select a Family</option>
            {familiesAsCook.map((family, index) => (
                <option key={index} value={family.familyId}>
                    {family.familyName}
                </option>
            ))}
        </Form.Select>
    );
}

export default FamilySelect;
