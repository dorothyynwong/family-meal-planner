import { useEffect, useState } from "react";
import Popup from "../Popup/Popup";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getMealTypes, getRecipeByUserId } from "../../Api/api";
import { RecipeDetailsInterface } from "../../Api/apiInterface";

interface MealFormProps {
    modalShow: boolean;
    setModalShow: (newModalShow: boolean) => void;
}

const MealForm: React.FC<MealFormProps> = ({ modalShow, setModalShow }) => {
    const [mealName, setMealName] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const { userId } = useParams<{ userId: string }>();
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [recipesList, setRecipesList] = useState<RecipeDetailsInterface[]>([]);
    const [mealTypes, setMealTypes] = useState<string[]>([]);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    // useEffect(() => {
    //     setStatus("loading");
    //     setErrorMessages([]);
    //     const userIdInt = parseInt(userId!, 10)
    //     getRecipeByUserId(userIdInt)
    //         .then(recipes => {
    //             setRecipesList(recipes.data);
    //             setStatus("success");
    //         })
    //         .catch(error => {
    //             console.log("Error getting recipes", error);
    //             const errorMessage = error?.response?.data?.message || "Error getting recipes";
    //             setStatus("error");
    //             setErrorMessages([...errorMessages, errorMessage]);
    //         });
    // }, [userId])

    useEffect(()=>{
        setStatus("loading");
        setErrorMessages([]);
        getMealTypes()
            .then(mealTypesList => {
                setMealTypes(mealTypesList.data);
                setStatus("success");
            })
            .catch(error => {
                console.log("Error getting meal types", error);
                const errorMessage = error?.response?.data?.message || "Error getting meal types";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });
    },[])

    const handleClick = () => {

    }

    return (
        <Popup
            show={modalShow}
            onHide={() => setModalShow(false)}
            title="Add New Meal"
            body="">
            <Form>
          
                <Form.Control
                    type="date"
                    className="meal-date"
                    placeholder="Meal Date"
                    aria-label="Meal-Date"
                    aria-describedby="basic-addon1"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <Form.Select aria-label="Meal Type">
                    <option>Select a Meal Type</option>
                    {mealTypes.map((mealType, index) => (
                        <option key={index} value={mealType}>{mealType}</option>
                    ))}
                </Form.Select>
                
                <Button id="add-meal-button" className="custom-button" onClick={handleClick}>Submit</Button>

            </Form>
        </Popup>);
}

export default MealForm;