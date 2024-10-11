import { useLocation, useParams } from "react-router-dom";
import RecipeCard from "../../Components/RecipeCard/RecipeCard";
import { useEffect, useState } from "react";
import { FamilyWithUsersInterface, RecipeDetailsInterface } from "../../Api/apiInterface";
import { getFamiliesWithUsersByUserId, getFamilyRoleTypes, getRecipeByUserId } from "../../Api/api";
import { Row } from "react-bootstrap";
import StatusHandler from "../../Components/StatusHandler/StatusHandler";
import FamilyCard from "../../Components/FamilyCard/FamilyCard";

interface FamiliesListProps {
    data: FamilyWithUsersInterface[];
}

const FamiliesList: React.FC<FamiliesListProps> = ({data}) => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const { userId } = useParams<{ userId: string }>();
    const location = useLocation();
    const isFromMealForm = location.state?.isFromMealForm || false;
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
                // console.log(fu.data);
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
            {familyUsersList.map((fu, index) => (
                <Row className="mb-3" key={index}>
                    <FamilyCard key={index} data={fu.familyUsers} familyName={fu.familyName} roles={familyRoles}/>
                </Row>
            ))}
        
        </>
    );
}

export default FamiliesList;