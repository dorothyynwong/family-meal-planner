import { useEffect, useState } from "react";
import { getDayTypes, getSchoolMenuWeekByMenuId } from "../../Api/api";
import { SchoolMealInterface, SchoolMenuWeekMealsInterface } from "../../Api/apiInterface";
import SchoolMealCard from "../../Components/SchoolMealCard/SchoolMealCard";
import { useLocation } from "react-router-dom";

const SchoolMenuEdit: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [dayTypes, setDayTypes] = useState<string[]>([])
    const [schoolMenus, setSchoolMenus] = useState<SchoolMenuWeekMealsInterface[]>([]);

    const location = useLocation();
    const schoolMenuIds = (location.state?.schoolMenuIds || []).map(Number) as number[];

    useEffect(() => {
        setStatus("loading");
        setErrorMessages([]);

        schoolMenuIds.forEach(
            schoolMenuId => {
                getSchoolMenuWeekByMenuId(schoolMenuId)
                    .then(response => {
                        const newMenu = response.data;
                        setSchoolMenus(prev => [...prev, newMenu]);
                        setStatus("success");
                    })
                    .catch(error => {
                        console.log("Error getting school menus", error);
                        const errorMessage = error?.response?.data?.message || "Error getting school menus";
                        setStatus("error");
                        setErrorMessages([...errorMessages, errorMessage]);
                    });

            }
        )

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
            {schoolMenus && schoolMenus.map(schoolMenu => {
                return(
                schoolMenu && schoolMenu.schoolMeals.map((sm, index) =>
                    <SchoolMealCard key={index} meal={sm} mealDays={dayTypes} />
            ))}
            )}
        </>
    )
}

export default SchoolMenuEdit;