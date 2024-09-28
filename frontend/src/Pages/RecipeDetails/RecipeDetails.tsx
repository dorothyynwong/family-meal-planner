
import { useNavigate, useParams } from "react-router-dom";
import RecipeDisplay from "../../Components/RecipeDisplay/RecipeDisplay";
import { useEffect, useState } from "react";
import { RecipeDetailsInterface } from "../../Api/apiInterface";
import { getRecipeById } from "../../Api/api";
import {  Col,  Row } from "react-bootstrap";
import { MdArrowBackIosNew } from "react-icons/md";
import OverflowMenu from "../../Components/OverflowMenu/OverflowMenu";
import { MenuItem } from "@mui/material";
import RecipeDeleteConfirmation from "../../Components/RecipeDeleteConfirmation/RecipeDeleteConirmation";


const RecipeDetails: React.FC = () => {
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
        const recipeIdNo = parseInt(recipeId!, 10)
        getRecipeById(recipeIdNo)
            .then(recipe => setRecipeData(recipe.data));
    }, [recipeId])

    const handleOptionsClick = (event: { currentTarget: { id: string } })  => {
        const buttonId = event.currentTarget.id;
        switch (buttonId) {
          case "delete-recipe-button":
            setIsDelete(true);
            break
          case "edit-recipe-button":
            navigate("/")
            break
          default:
            break
        }
    }

    return (
        <>
            <Row>
                <Col xs={10}>
                    <MdArrowBackIosNew size={20} onClick={() => navigate(-1)} />
                </Col>
                <Col xs={2}>
                    <OverflowMenu>
                        <>
                            <MenuItem id="edit-recipe-button" onClick={handleOptionsClick}>Edit</MenuItem>
                            <MenuItem id="delete-recipe-button" onClick={handleOptionsClick}>Delete</MenuItem>
                        </>
                    </OverflowMenu>
                </Col>
            </Row>
            <RecipeDisplay data={recipeData} />
            {isDelete && <RecipeDeleteConfirmation data={recipeData}/>}
            
        </>

    )

}

export default RecipeDetails;