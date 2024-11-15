
import { useNavigate, useParams } from "react-router-dom";
import RecipeDisplay from "../../Components/RecipeDisplay/RecipeDisplay";
import { useEffect, useState } from "react";
import { RecipeDetailsInterface } from "../../Api/apiInterface";
import { getRecipeById } from "../../Api/api";
import { Col, Row } from "react-bootstrap";
import { MdArrowBackIosNew } from "react-icons/md";
import OverflowMenu from "../../Components/OverflowMenu/OverflowMenu";
import RecipeDeleteConfirmation from "../../Components/RecipeDeleteConfirmation/RecipeDeleteConirmation";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StatusHandler from "../../Components/StatusHandler/StatusHandler";


const RecipeDetails: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const { recipeId } = useParams<{ recipeId: string }>();
    const navigate = useNavigate();
    const [isDelete, setIsDelete] = useState(false);
    const [recipeData, setRecipeData] = useState<RecipeDetailsInterface>({
        name: "",
        images: [],
        notes: "",
        description: "",
        recipeIngredients: [],
        recipeInstructions: [],
    });;

    useEffect(() => {
        setStatus("loading");
        setErrorMessages([]);
        const recipeIdNo = parseInt(recipeId!, 10)
        getRecipeById(recipeIdNo)
            .then(recipe => {
                setRecipeData(recipe.data);
                setStatus("success");
            })
            .catch(error => {
                console.log("Error getting recipe", error);
                const errorMessage = error?.response?.data?.message || "Error getting recipe";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recipeId])

    const menuItems = [
        { id: "edit-recipe-button", label: "Edit" },
        { id: "delete-recipe-button", label: "Delete" },
        { id: "copy-recipe-button", label: "Copy" },
    ];

    const handleOptionsClick = (option: string) => {
        switch (option) {
            case "display-recipe-button":
                navigate(`/recipe-details/${recipeData.id}`);
                break
            case "delete-recipe-button":
                setIsDelete(true);
                break
            case "edit-recipe-button":
                navigate(`/recipe-edit/${recipeData.id}`);
                break
            case "copy-recipe-button":
                navigate(`/recipe-add/${recipeData.id}`);
                break
            default:
                break
        }
    }

    const handleCancel = () => {
        setIsDelete(false);
    }
    return (
        <>
            <StatusHandler
                status={status}
                errorMessages={errorMessages}
                loadingMessage="Getting recipe..."
                successMessage=""
            >
                <></>
            </StatusHandler>
                <Row>
                    <Col xs={10}>
                        <MdArrowBackIosNew size={20} onClick={() => navigate(-1)} />
                    </Col>
                    <Col xs={2}>
                        <OverflowMenu menuItems={menuItems} handleOptionsClick={handleOptionsClick} icon={MoreVertIcon} />
                    </Col>
                </Row>

                <RecipeDisplay data={recipeData} />
                {isDelete && <RecipeDeleteConfirmation data={recipeData} onCancel={handleCancel} />}
            

        </>

    )

}

export default RecipeDetails;