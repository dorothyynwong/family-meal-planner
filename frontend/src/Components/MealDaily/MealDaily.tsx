import { useEffect, useState } from "react";
import { MealDetailsInterface } from "../../Api/apiInterface";
import { getMealByDateFamilyId, getMealByDateUserId } from "../../Api/api";
import MealCard from "../MealCard/MealCard";
import StatusHandler from "../StatusHandler/StatusHandler";

interface MealDailyProps {
    mealDate: Date;
    familyId: number;
    userId: number;
    isByFamily: boolean;
}

const MealDaily: React.FC<MealDailyProps> = ({ mealDate, familyId, userId, isByFamily }) => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [mealsOfDate, setMealsOfDate] = useState<MealDetailsInterface[]>();


    useEffect(() => {
        setStatus("loading");
        setErrorMessages([]);

        if (!isByFamily)
        {
            getMealByDateUserId(mealDate.toDateString(), mealDate.toDateString(), familyId, userId)
                .then(meals => {
                    setMealsOfDate(meals.data);
                    setStatus("success");
                })
                .catch(error => {
                    setMealsOfDate([]);
                    console.log("Error getting meals", error);
                    const errorMessage = error?.response?.data?.message || "Error getting meals";
                    setStatus("error");
                    setErrorMessages([...errorMessages, errorMessage]);
                });
        }
        else
        {
            getMealByDateFamilyId(mealDate.toDateString(), mealDate.toDateString(), familyId)
            .then(meals => {
                setMealsOfDate(meals.data);
                setStatus("success");
            })
            .catch(error => {
                setMealsOfDate([]);
                console.log("Error getting meals", error);
                const errorMessage = error?.response?.data?.message || "Error getting meals";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });
        }
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [mealDate, userId, familyId, isByFamily])

    if (!mealsOfDate || mealsOfDate.length <= 0) return (<p>No meals are planned for today</p>);

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
                    <MealCard key={index} meal={meal} isReadOnly={!isByFamily}/>
                ))}
        </>
    )
}

export default MealDaily;