import { deleteMeal } from "../Api/api";
import { useMeal } from "../Components/MealContext/MealContext";

function useMealForm() {
    const { currentMeal,
        setStatus,
        errorMessages,
        setErrorMessages,
        setModalShow,
        resetMealContext,
    } = useMeal();
    
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

    return {handleDelete};
}

export default useMealForm;