import { useEffect, useState } from "react";
import { getDayTypes, getSchoolMenuWeekByMenuId } from "../../Api/api";
import { SchoolMealInterface, SchoolMenuWeekMealsInterface } from "../../Api/apiInterface";
import SchoolMealCard from "../../Components/SchoolMealCard/SchoolMealCard";

const SchoolMenuEdit: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [dayTypes, setDayTypes] = useState<string[]>([])
    const [schoolMenu, setSchoolMenu] = useState<SchoolMenuWeekMealsInterface>();

    useEffect(() => {
        setStatus("loading");
        setErrorMessages([]);

        getSchoolMenuWeekByMenuId(66)
            .then(response => {
                console.log(response.data);
                setSchoolMenu(response.data);
                setStatus("success");
            })
            .catch(error => {
                console.log("Error getting school menus", error);
                const errorMessage = error?.response?.data?.message || "Error getting school menus";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });

        getDayTypes()
            .then(dayTypesList => {
                setDayTypes(dayTypesList.data);
                setStatus("success");
            })
            .catch(error => {
                console.log("Error getting days of week", error);
                const errorMessage = error?.response?.data?.message || "Error getting days of week";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });
    }, []);

    return (
        <>
            {schoolMenu && schoolMenu.schoolMeals.map(sm =>
                <SchoolMealCard meal={sm} mealDays={dayTypes} />
            )}

        </>
    )
}

export default SchoolMenuEdit;