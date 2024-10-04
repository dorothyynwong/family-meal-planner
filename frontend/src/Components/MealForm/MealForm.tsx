import { useEffect, useState } from "react";
import Popup from "../Popup/Popup";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getMealTypes, getRecipeByUserId } from "../../Api/api";
import { RecipeDetailsInterface } from "../../Api/apiInterface";
import { FaSearch } from "react-icons/fa";
import { useRecipe } from "../RecipeContext/RecipeContext";

interface MealFormProps {
    modalShow: boolean;
    setModalShow: (newModalShow: boolean) => void;
    selectedMealType: string;
    setSelectedMealType: (newMealType: string) => void;
    mealDate: string;
    setMealDate: (newMealDate: string) => void;
}

const MealForm: React.FC<MealFormProps> = ({ modalShow, setModalShow, selectedMealType, setSelectedMealType, mealDate, setMealDate}) => {
    // const [mealName, setMealName] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const { userId } = useParams<{ userId: string }>();
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [mealTypes, setMealTypes] = useState<string[]>([]);
    const location = useLocation();

    const navigate = useNavigate();
    const { selectedRecipe, setSelectedRecipe } = useRecipe();

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        if (selectedRecipe) {
            setModalShow(true);
        }
    }, [selectedRecipe, setModalShow]);

    const handleClick = () => {
        const isFromMealForm = true;
        navigate(`/recipes-list/${userId}`, {state : {isFromMealForm, mealDate, selectedMealType}});
    }

    useEffect(() => {
        console.log(selectedRecipe?.name);
        console.log(selectedMealType);
    }, [selectedRecipe])



    return (
        <Popup
            show={modalShow}
            onHide={() => setModalShow(false)}
            title="Add New Meal"
            body="">
            <Form>
                <InputGroup className="mb-3 search-container">
                    <InputGroup.Text className="search-icon-box" id="basic-addon1">
                        <FaSearch className="search-icon" />
                    </InputGroup.Text>

                    <Form.Control
                        className="search-box"
                        placeholder="Search"
                        aria-label="Search"
                        aria-describedby="basic-addon1"
                        onClick = {handleClick}
                    />
                </InputGroup>

                <Form.Control
                    type="date"
                    className="meal-date"
                    placeholder="Meal Date"
                    aria-label="Meal-Date"
                    aria-describedby="basic-addon1"
                    value={mealDate}
                    onChange={(e) => setMealDate(e.target.value)}
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