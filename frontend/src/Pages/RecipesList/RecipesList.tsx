import { useLocation, useParams } from "react-router-dom";
import RecipeCard from "../../Components/RecipeCard/RecipeCard";
import { useEffect, useState } from "react";
import { RecipeDetailsInterface } from "../../Api/apiInterface";
import { getRecipeByUserId } from "../../Api/api";
import { Row } from "react-bootstrap";
import StatusHandler from "../../Components/StatusHandler/StatusHandler";

const RecipesList: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const { userId } = useParams<{ userId: string }>();
    const location = useLocation();
    const [recipesList, setRecipesList] = useState<RecipeDetailsInterface[]>([]);

    useEffect(() => {
        setStatus("loading");
        setErrorMessages([]);
        const userIdInt = parseInt(userId!, 10)
        getRecipeByUserId(userIdInt)
            .then(recipes => {
                setRecipesList(recipes.data);
                setStatus("success");
            })
            .catch(error => {
                console.log("Error getting recipes", error);
                const errorMessage = error?.response?.data?.message || "Error getting recipes";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });
    }, [userId, location.key])

    return (
        <>
            <StatusHandler
                status={status}
                errorMessages={errorMessages}
                // loadingMessage="Getting recipes..."
                // successMessage="Recipes are retrieved !"
            >
                <></>
            </StatusHandler>
            {recipesList.map((recipe, index) => (
                <Row className="mb-3" key={index}>
                    <RecipeCard recipe={recipe} />
                </Row>
            ))}


        </>
    );
}

export default RecipesList;