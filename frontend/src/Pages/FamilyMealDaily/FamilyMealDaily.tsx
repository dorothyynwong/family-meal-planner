import { useEffect, useState } from "react";
import { FamilyWithUsersInterface } from "../../Api/apiInterface";
import { getFamiliesWithUsersByUserId, getFamilyRoleTypes } from "../../Api/api";
import FamilyTabs from "../../Components/FamilyTabs/FamilyTabs";
import StatusHandler from "../../Components/StatusHandler/StatusHandler";
import DateBar from "../../Components/DateBar/DateBar";
import dayjs, { Dayjs } from 'dayjs';
import FamilyMealsBottomBar from "../../Components/FamilyMealsBottomBar/FamilyMealsBottomBar";
import MealForm from "../../Components/MealForm/MealForm";
import { useMeal } from "../../Components/MealContext/MealContext";


const FamilyMealDaily: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [familyUsersList, setFamilyUsersList] = useState<FamilyWithUsersInterface[]>([]);
    const [familyRoles, setFamilyRoles] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const { modalShow, setModalShow, setMode } = useMeal();
    
    useEffect(() => {
        setStatus("loading");
        setErrorMessages([]);
        getFamilyRoleTypes().then(response => {
            const roles = response.data;
            setFamilyRoles(roles);
        });

        getFamiliesWithUsersByUserId()
            .then(fu => {
                setFamilyUsersList(fu.data);
                setStatus("success");
            })
            .catch(error => {
                console.log("Error getting families with users", error);
                const errorMessage = error?.response?.data?.message || "Error getting families with users";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });
    }, []);
    return (
        <>
            <StatusHandler
                status={status}
                errorMessages={errorMessages}
                loadingMessage="Getting families and meals..."
                successMessage=""
            >
                <></>
            </StatusHandler>
            <DateBar selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
            {familyUsersList.length > 0 ? ( 
                <FamilyTabs data={familyUsersList} selectedDate={selectedDate} />
            ) : (
                <div>No families available</div>
            )}
            <FamilyMealsBottomBar/>
            <MealForm isFromFamily={true}/>
        </>
    );
}

export default FamilyMealDaily;
