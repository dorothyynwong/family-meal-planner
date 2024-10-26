import MealPlanCalendar from "../../Components/MealPlanCalendar/MealPlanCalendar"
import MealCard from "../../Components/MealCard/MealCard"
import { MealDetailsInterface } from "../../Api/apiInterface"
import { useEffect, useState } from "react";
import { getMealByDateUserId } from "../../Api/api";
import StatusHandler from "../../Components/StatusHandler/StatusHandler";
import { convertMealsToEvents, EventInterface } from "../../Utils/convertMealsToEvents";
import { IoIosAddCircle } from "react-icons/io";
import "./MealPlanMonthly.scss";
import MealForm from "../../Components/MealForm/MealForm";
import { useMeal } from "../../Components/MealContext/MealContext";

const MealPlanMonthly: React.FC = () => {
    const todaysDate = new Date();
    const [startDate, setStartDate] = useState(new Date(todaysDate.getFullYear(), todaysDate.getMonth(), 1 - 7));
    const [endDate, setEndDate] = useState(new Date(todaysDate.getFullYear(), todaysDate.getMonth() + 1, 7));
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [meals, setMeals] = useState<MealDetailsInterface[]>();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [mealOfDate, setMealOfDate] = useState<MealDetailsInterface[]>();
    const { modalShow, setModalShow, setMode } = useMeal();
    const [convertedEvents, setConvertedEvents] = useState<EventInterface[]>([]);

    const handleClick = () => {
        setMode("Add");
        setModalShow(true);
    }

    useEffect(() => {
        setStatus("loading");
        setMeals([]);
        setErrorMessages([]);

        getMealByDateUserId(startDate.toDateString(), endDate.toDateString())
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [startDate, endDate, modalShow])

    useEffect(() => {
        if (meals) {
            setMealOfDate([]);
            setConvertedEvents(convertMealsToEvents(meals));
            const selectedDateLocal = selectedDate.toLocaleDateString();
            setMealOfDate(
                meals.filter((meal) => {
                    const mealDateLocal = new Date(meal.date).toLocaleDateString();
                    return mealDateLocal === selectedDateLocal;
                })
            );
        }

    }, [selectedDate, meals])

    // if (!meals) return (<>No data</>);

    return (
        <>
            <MealPlanCalendar
                startDate={startDate}
                endDate={endDate}
                selectedDate={selectedDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setSelectedDate={setSelectedDate}
                mealEvents={convertedEvents}
            />
            <StatusHandler
                status={status}
                errorMessages={errorMessages}
                loadingMessage="Loading Meals.."
                successMessage=""
            >
                <></>
            </StatusHandler>
            <MealForm />
            <div className="add-meal-button" onClick={handleClick}>
                <IoIosAddCircle size={30} />
            </div>
            {
                mealOfDate &&
                mealOfDate.map((meal, index) => (
                    <MealCard key={index} meal={meal} isReadOnly={false} />
                ))}
        </>

    )
}

export default MealPlanMonthly