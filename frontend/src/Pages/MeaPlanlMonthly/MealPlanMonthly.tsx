import MealPlanCalendar from "../../Components/MealPlanCalendar/MealPlanCalendar"
import MealCard from "../../Components/MealCard/MealCard"
import { MealDetailsInterface } from "../../Api/apiInterface"
import { useEffect, useState } from "react";
import { getMealByDateUserId } from "../../Api/api";
import { useParams } from "react-router-dom";

type MealPlanMonthlyParams = {
    fromDate: string;
    toDate: string;
    userId: string;
}

const MealPlanMonthly:React.FC = () => {
    const { fromDate, toDate, userId } = useParams<MealPlanMonthlyParams>();
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [meals, setMeals] = useState<MealDetailsInterface[]>();

    useEffect(()=> {
        setStatus("loading");
        setErrorMessages([]);

        if(fromDate && toDate && userId)
            getMealByDateUserId(fromDate, toDate, userId)
                .then(meals => {
                    setMeals(meals.data);
                    setStatus("success");
                })
                .catch(error => {
                    console.log("Error getting meals", error);
                    const errorMessage = error?.response?.data?.message || "Error getting meals";
                    setStatus("error");
                    setErrorMessages([...errorMessages, errorMessage]);
                });
    }
    , [])

    if(!meals) return (<>No data</>);

    return (
        <>
                <MealPlanCalendar />
                {
                    meals.map(meal => (
                        <>
                        <div>{meal.id}</div>
                        <MealCard />
                        </>
                ))}

                <MealCard />
        </>

    )
}

export default MealPlanMonthly