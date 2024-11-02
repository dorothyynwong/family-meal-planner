import { useEffect} from "react";
import Popup from "../Popup/Popup";
import { Form} from "react-bootstrap";
import { useNavigate} from "react-router-dom";
import { addMeal,  getMealTypes, updateMeal } from "../../Api/api";
import { useMeal } from "../MealContext/MealContext";
import { MealDetailsInterface } from "../../Api/apiInterface";
import StatusHandler from "../StatusHandler/StatusHandler";
import "./MealForm.scss";
import dayjs, { Dayjs } from 'dayjs';
import RecipeSearch from "../RecipeSearch/RecipeSearch";
import SchoolMenuSelect from "../SchoolMenuSelect/SchoolMenuSelect";
import MealFormSelection from "../MealFormSelection/MealFormSelection";
import MealFormBase from "../MealFormBase/MealFormBase";

interface MealFormProps {
    isForFamily?: boolean
    selectedDate?: Dayjs
    //isFromRecipe?: boolean
}


const MealForm: React.FC<MealFormProps> = ({ isForFamily, selectedDate}) => {


    const { mode,
        currentMeal,
        recipeName,
        setRecipeName,
        selectedRecipe,
        selectedMealType,
        mealDate,
        setMealDate,
        mealNotes,
        modalShow,
        setModalShow,
        resetMealContext,
        selectedFamily,
        schoolMealId,
        setMealTypes,
        status,
        setStatus,
        errorMessages,
        setErrorMessages,
        formType,
        setFormType,
    } = useMeal();

    const navigate = useNavigate();


    useEffect(() => {
        initaliseMealForm();
    }, []);

    useEffect(() => {
        handleRecipeSelection();
    }, [selectedRecipe]);

    const isFromMealForm = true;

    const initaliseMealForm = async () => {
        if (!mealDate) 
            setMealDate(dayjs(selectedDate).format('YYYY-MM-DD'));
        setStatus("loading");
        getMealTypes()
            .then(mealTypesList => {
                setMealTypes(mealTypesList.data);
                setStatus("idle");
                setErrorMessages([]);
            })
            .catch(error => {
                console.log("Error getting meal types", error);
                const errorMessage = error?.response?.data?.message || "Error getting meal types";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });
    };

    const handleRecipeSelection = () => {
        if (selectedRecipe) {
            setRecipeName(selectedRecipe.name ? selectedRecipe.name : "");
            setModalShow(true);
        }
    }



    const validateForm = (): boolean => {
        if (formType === "recipe" && !mealNotes.trim() && !selectedRecipe && !recipeName) {
            const errorMessage = "Please enter notes or select a recipe.";
            setStatus("error");
            setErrorMessages([...errorMessages, errorMessage]);
            return false;
        }

        if (formType === "school-meal" && schoolMealId === 0) {
            const errorMessage = "Please select a school menu";
            setStatus("error");
            setErrorMessages([...errorMessages, errorMessage]);
            return false;
        }

        if (formType === "recipe" && !selectedMealType) {
            const errorMessage = "Please choose a meal type. ";
            setStatus("error");
            setErrorMessages([...errorMessages, errorMessage]);
            return false;
        }

        if (!mealDate) {
            const errorMessage = "Please select a date. ";
            setStatus("error");
            setErrorMessages([...errorMessages, errorMessage]);
            return false;
        }

        return true;
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        if (!validateForm()) return;

        setStatus("loading");
        setErrorMessages([]);

        const meal: MealDetailsInterface = {
            familyId: isForFamily? selectedFamily?.familyId : 0,
            date: mealDate,
            notes: mealNotes,
            mealType: formType === "recipe" ? selectedMealType : "Lunch",
            schoolMealId: formType === "school-meal" ? schoolMealId : 0,
            ...(formType === "recipe" && selectedRecipe ? { recipeId: selectedRecipe.id } : {}),
        }

        if (mode === "Add") {
            addMeal(meal)
                .then(response => {
                    if (response.status === 200) {
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
                    if (response.status === 200) {
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
            onHide={() => { setModalShow(false); resetMealContext();  }}
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

                <MealFormSelection 
                    mealFormType={formType} 
                    setMealFormType={setFormType}
                />
                {formType==="recipe" ?
                    <RecipeSearch recipeName={recipeName} onSearchClick={() => navigate(`/recipes-list`, { state: { isFromMealForm, mealDate, selectedMealType } })} />
                :   <SchoolMenuSelect />}

                {/* <MealDateInput mealDate={mealDate} setMealDate={setMealDate} /> */}

                {/* {mealFormType==="recipe"  && 
                    <MealTypeSelect mealTypes={mealTypes} selectedMealType={selectedMealType} setSelectedMealType={setSelectedMealType}/>
                } */}

                {/* <Form.Group controlId="meal-notes">
                    <Form.Control className="mt-3 custom-form-control" as="textarea" rows={3} placeholder="Notes" name="notes" value={mealNotes} onChange={(e) => setMealNotes(e.target.value)} />
                </Form.Group> */}

                {/* <Button className="mt-3 custom-button" type="submit">{mode === "Add" ? "Add" : "Update"}</Button>
                {mode === "Edit" && <Button className="mt-3 custom-button" onClick={handleDelete}>Delete</Button>} */}
                <MealFormBase />

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