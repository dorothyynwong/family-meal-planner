import { useEffect, useState } from "react";
import { FamilyWithUsersInterface } from "../../Api/apiInterface";
import { getFamiliesWithUsersByUserId, getFamilyRoleTypes } from "../../Api/api";
import FamilyTabs from "../../Components/FamilyTabs/FamilyTabs";
import StatusHandler from "../../Components/StatusHandler/StatusHandler";
import DateSelectionBar from "../../Components/DateBar/DateBar";
import DateBar from "../../Components/DateBar/DateBar";


const FamilyMealDaily: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [familyUsersList, setFamilyUsersList] = useState<FamilyWithUsersInterface[]>([]);
    const [familyRoles, setFamilyRoles] = useState<string[]>([]);
    
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
                loadingMessage="Getting recipes..."
                successMessage=""
            >
                <></>
            </StatusHandler>
            <DateBar />
            <FamilyTabs data={familyUsersList} />
            {/* {familyUsersList.map((fu, index) => (
                <FamilyTabs
                    key={index}
                    data={fu}
                    familyId={fu.familyId}
                    userId={fu.userId}
                    roles={familyRoles}
                />
            ))} */}
        </>
    );
}

export default FamilyMealDaily;
