import { useEffect, useState } from "react";
import { FamilyWithUsersInterface } from "../../Api/apiInterface";
import { getFamiliesWithUsersByUserId, getFamilyRoleTypes } from "../../Api/api";
import StatusHandler from "../../Components/StatusHandler/StatusHandler";
import FamilyCard from "../../Components/FamilyCard/FamilyCard";

// interface FamiliesListProps {
//     data: FamilyWithUsersInterface[];
// }

const FamiliesList: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [familyUsersList, setFamilyUsersList] = useState<FamilyWithUsersInterface[]>([]);
    const [familyRoles, setFamilyRoles] = useState<string[]>([]);

    useEffect(() => {
        setStatus("loading");
        setErrorMessages([]);
        getFamilyRoleTypes()
            .then(response => {
                const roles = response.data;
                setFamilyRoles(roles);

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
            })
            .catch(error => {
                console.log("Error fetching roles", error);
                const errorMessage = error?.response?.data?.message || "Error fetching roles";
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
                loadingMessage="Getting family and user details.."
                successMessage=""
            >
                <></>
            </StatusHandler>
            {familyUsersList.map((fu, index) => (
                <FamilyCard
                    key={index}
                    data={fu}
                    familyId={fu.familyId}
                    userId={fu.userId}
                    roles={familyRoles}
                />
            ))}
        </>
    );
}

export default FamiliesList;