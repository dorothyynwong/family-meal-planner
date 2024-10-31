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
    const isFromMealForm = location.state?.isFromMealForm || false;


    useEffect(() => {
        setStatus("loading");
        setErrorMessages([]);
        getRecipeByUserId()
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, location.key])

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
            {recipesList.map((recipe, index) => (
                <Row className="mb-3" key={index}>
                    <RecipeCard recipe={recipe} isFromMealForm={isFromMealForm} />
                </Row>
            ))}
        </>
    );
}

export default RecipesList;