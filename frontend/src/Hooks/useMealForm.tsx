import { useEffect } from "react";
import { addMeal, deleteMeal, getMealTypes, updateMeal } from "../Api/api";
import { useMeal } from "../Components/MealContext/MealContext";
import { MealDetailsInterface } from "../Api/apiInterface";
import dayjs, { Dayjs } from 'dayjs';

function useMealForm(isForFamily?: boolean, selectedDate?: Dayjs) {
    const { mode,
        currentMeal,
        recipeName,
        setRecipeName,
        selectedRecipe,
        selectedMealType,
        mealDate,
        setMealDate,
        mealNotes,
        setModalShow,
        resetMealContext,
        selectedFamily,
        schoolMealId,
        setMealTypes,
        setStatus,
        errorMessages,
        setErrorMessages,
        formType,
    } = useMeal();
    
    useEffect(() => {
        initaliseMealForm();
    }, []);

    useEffect(() => {
        handleRecipeSelection();
    }, [selectedRecipe]);

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
        if (formType !== "school-meal" && !mealNotes.trim() && !selectedRecipe && !recipeName) {
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

        if (formType !== "school-meal" && !selectedMealType) {
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
            mealType: formType !== "school-meal" ? selectedMealType : "Lunch",
            schoolMealId: formType === "school-meal" ? schoolMealId : 0,
            ...(formType !== "school-meal" && selectedRecipe ? { recipeId: selectedRecipe.id } : {}),
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
    
    const handleDelete = async () => {
        if (!currentMeal?.id) return;

        deleteMeal(currentMeal!.id!)
            .then(response => {
                if (response.status === 200) {
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

    return {handleDelete, handleSubmit};
}

export default useMealForm;