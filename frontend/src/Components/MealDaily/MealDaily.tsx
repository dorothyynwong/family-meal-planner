import { useEffect, useState } from "react";
import { MealDetailsInterface } from "../../Api/apiInterface";
import { getMealByDateUserId } from "../../Api/api";
import MealCard from "../MealCard/MealCard";
import StatusHandler from "../StatusHandler/StatusHandler";

interface MealDailyProps {
    mealDate: Date;
    familyId: number;
    userId: number;
}

const MealDaily: React.FC<MealDailyProps> = ({ mealDate, familyId, userId }) => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [mealsOfDate, setMealsOfDate] = useState<MealDetailsInterface[]>();


    useEffect(() => {
        setStatus("loading");
        setErrorMessages([]);

        getMealByDateUserId(mealDate.toDateString(), mealDate.toDateString(), familyId, userId)
            .then(meals => {
                setMealsOfDate(meals.data);
                setStatus("success");
            })
            .catch(error => {
                console.log("Error getting meals", error);
                const errorMessage = error?.response?.data?.message || "Error getting meals";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });
    }
        , [mealDate, userId])

    return (
        <>
            <StatusHandler
                status={status}
                errorMessages={errorMessages}
                loadingMessage="Loading Meals.."
                successMessage=""
            >
                <></>
            </StatusHandler>
            {
                mealsOfDate &&
                mealsOfDate.map((meal, index) => (
                    <MealCard key={index} meal={meal} />
                ))}
        </>
    )
}

export default MealDaily;