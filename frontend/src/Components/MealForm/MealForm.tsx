import { useEffect, useState } from "react";
import Popup from "../Popup/Popup";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { addMeal, deleteMeal, getMealTypes, updateMeal } from "../../Api/api";
import { FaSearch } from "react-icons/fa";
import { useMeal } from "../MealContext/MealContext";
import { MealDetailsInterface } from "../../Api/apiInterface";
import StatusHandler from "../StatusHandler/StatusHandler";
import "./MealForm.scss";

interface MealFormProps {
    isForFamily?: boolean
}

const MealForm: React.FC<MealFormProps> = ({ isForFamily }) => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [mealTypes, setMealTypes] = useState<string[]>([]);
    const { mode,
        currentMeal,
        recipeName,
        setRecipeName,
        selectedRecipe,
        selectedMealType,
        setSelectedMealType,
        mealDate,
        setMealDate,
        mealNotes,
        setMealNotes,
        modalShow,
        setModalShow,
        resetMealContext,
        selectedFamily,
        setSelectedFamily,
    } = useMeal();

    const navigate = useNavigate();


    useEffect(() => {
        setStatus("loading");
        setErrorMessages([]);
        getMealTypes()
            .then(mealTypesList => {
                setMealTypes(mealTypesList.data);
                setStatus("idle");
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
            setRecipeName(selectedRecipe.name ? selectedRecipe.name : "");
            setModalShow(true);
        }
    }, [selectedRecipe, modalShow]);

    const handleClick = () => {
        const isFromMealForm = true;
        navigate(`/recipes-list`, { state: { isFromMealForm, mealDate, selectedMealType } });
    }

    const handleDelete = () => {
        deleteMeal(currentMeal!.id!)
            .then(response => {
                if (response.statusText === "OK") {
                    setStatus("success");
                }
            })
            .catch(error => {
                console.log("Error deleting meal", error);
                const errorMessage = error?.response?.data?.message || "Error deleting meal";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });

        setModalShow(false);
        resetMealContext();
        setStatus("idle");
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        console.log("Selected Family:", selectedFamily);  
        
        if (!mealNotes.trim() && !selectedRecipe && !recipeName) {
            setErrorMessages(["Please enter notes or select a recipe."]);
            setStatus("error");
            return;
        }

        if (!selectedMealType) {
            setErrorMessages(["Please choose a meal type. "]);
            setStatus("error");
            return;
        }

        if (!mealDate) {
            setErrorMessages(["Please select a date. "]);
            setStatus("error");
            return;
        }

        setStatus("loading");
        setErrorMessages([]);

        const meal: MealDetailsInterface = {
            familyId: selectedFamily?.familyId,
            date: mealDate,
            notes: mealNotes,
            mealType: selectedMealType,
            ...(selectedRecipe ? { recipeId: selectedRecipe.id } : {}),
        }

        if (mode === "Add") {
            addMeal(meal)
                .then(response => {
                    if (response.statusText === "OK") {
                        setStatus("success");
                    }
                })
                .catch(error => {
                    console.log("Error adding meal", error);
                    const errorMessage = error?.response?.data?.message || "Error adding meal";
                    setStatus("error");
                    setErrorMessages([...errorMessages, errorMessage]);
                });
        }
        else {
            updateMeal(meal, currentMeal!.id!)
                .then(response => {
                    if (response.statusText === "OK") {
                        setStatus("success");
                    }
                })
                .catch(error => {
                    console.log("Error updating meal", error);
                    const errorMessage = error?.response?.data?.message || "Error updating meal";
                    setStatus("error");
                    setErrorMessages([...errorMessages, errorMessage]);
                });
        }
        setModalShow(false);
        resetMealContext();
        setStatus("idle");
    }


    return (
        <Popup
            customclass="meal-form"
            show={modalShow}
            onHide={() => { setModalShow(false); resetMealContext(); }}
            title={`${mode} Meal`}
            body="">
            <Form onSubmit={handleSubmit}>
                {isForFamily &&
                (
                    <Form.Group className="mb-3" controlId="meal-family-name">
                        <Form.Control 
                            type="text" 
                            className="mt-3 meal-family-name"
                            readOnly 
                            placeholder={selectedFamily?.familyName} />
                  </Form.Group>
                )}

                <InputGroup className="mt-3 recipe-search-container">
                    <InputGroup.Text className="recipe-search-icon-box" id="basic-addon1">
                        <FaSearch className="recipe-search-icon" />
                    </InputGroup.Text>

                    <Form.Control
                        className="recipe-search-box"
                        placeholder="Search Recipe"
                        aria-label="Search"
                        aria-describedby="basic-addon1"
                        onClick={handleClick}
                        value={recipeName}
                        readOnly
                    />
                </InputGroup>

                <Form.Control
                    type="date"
                    className="mt-3 meal-date"
                    placeholder="Meal Date"
                    aria-label="Meal-Date"
                    aria-describedby="basic-addon1"
                    value={mealDate}
                    onChange={(e) => setMealDate(e.target.value)}
                />

                <Form.Select
                    className="mt-3 meal-type"
                    aria-label="Meal Type"
                    onChange={(e) => setSelectedMealType(e.target.value)}
                    value={selectedMealType}>
                    <option value="">Select a Meal Type</option>
                    {mealTypes.map((mealType, index) => (
                        <option key={index} value={mealType}>{mealType}</option>
                    ))}
                </Form.Select>

                <Form.Group controlId="meal-notes">
                    <Form.Control className="mt-3 custom-form-control" as="textarea" rows={3} placeholder="Notes" name="notes" value={mealNotes} onChange={(e) => setMealNotes(e.target.value)} />
                </Form.Group>

                {mode === "Add" &&
                    <Button id="add-meal-button" className="mt-3 custom-button" type="submit">Add</Button>
                }

                {mode === "Edit" &&
                    <Button id="update-meal-button" className="mt-3 custom-button" type="submit">Update</Button>
                }

                {mode === "Edit" &&
                    <Button id="delete-meal-button" className="mt-3 custom-button" type="button" onClick={handleDelete}>Delete</Button>
                }


                <StatusHandler
                    status={status}
                    errorMessages={errorMessages}
                    loadingMessage="Submitting/Loading meal ..."
                    successMessage=""
                >
                    <></>
                </StatusHandler>

            </Form>
        </Popup>);
}

export default MealForm;