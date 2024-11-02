import { useEffect, useState } from "react";
import { FamilyWithUsersInterface } from "../../Api/apiInterface";
import { getFamiliesWithUsersByUserId } from "../../Api/api";
import FamilyTabs from "../../Components/FamilyTabs/FamilyTabs";
import StatusHandler from "../../Components/StatusHandler/StatusHandler";
import DateBar from "../../Components/DateBar/DateBar";
import dayjs from 'dayjs';
import FamilyMealsBottomBar from "../../Components/FamilyMealsBottomBar/FamilyMealsBottomBar";
import FamilyMealForm from "../../Components/FamilyMealForm/FamilyMealForm";
  
const FamilyMealDaily: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [familyUsersList, setFamilyUsersList] = useState<FamilyWithUsersInterface[]>([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    
    useEffect(() => {
        setStatus("loading");
        setErrorMessages([]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <FamilyTabs 
                    data={familyUsersList} 
                    selectedDate={selectedDate} 
                />
            ) : (
                <div>No families available</div>
            )}
            <FamilyMealsBottomBar/>
            <FamilyMealForm isForFamily={true} selectedDate={selectedDate}/>
        </>
    );
}

export default FamilyMealDaily;
