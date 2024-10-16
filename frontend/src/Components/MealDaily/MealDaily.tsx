import { useEffect, useState } from "react";
import { MealDetailsInterface } from "../../Api/apiInterface";
import { getMealByDateUserId } from "../../Api/api";
import MealCard from "../MealCard/MealCard";

interface MealDailyProps {
    mealDate: Date;
    userId: number;
}

const MealDaily: React.FC<MealDailyProps> = ({ mealDate, userId }) => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const [meals, setMeals] = useState<MealDetailsInterface[]>();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [mealsOfDate, setMealsOfDate] = useState<MealDetailsInterface[]>();

    useEffect(() => {
        setStatus("loading");
        setMeals([]);
        setErrorMessages([]);

        getMealByDateUserId(mealDate.toDateString(), mealDate.toDateString())
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
        , [mealDate])

    useEffect(() => {
        if (meals) {
            setMealsOfDate([]);
            const selectedDateLocal = selectedDate.toLocaleDateString();
            setMealsOfDate(
                meals.filter((meal) => {
                    const mealDateLocal = new Date(meal.date).toLocaleDateString();
                    return mealDateLocal === selectedDateLocal;
                })
            );
        }

    }, [selectedDate, meals])
    return (
        <>
            {
                mealsOfDate &&
                mealsOfDate.map((meal, index) => (
                    <MealCard key={index} meal={meal} />
                ))}
        </>
    )
}

export default MealDaily;