import { RecipeDetailsInterface } from "../../Api/apiInterface";
import RecipeSummaryDisplay from "./RecipeSummaryDisplay";
import RecipeIngredientDisplay from "./RecipeIngredientDisplay";
import RecipeCarousel from "../RecipeCarousel/RecipeCarousel";
import RecipeInstructionDisplay from "./RecipeInstructionDisplay";
import { Card, Col, Row } from "react-bootstrap";
import { MdArrowBackIosNew } from "react-icons/md";
import { MenuItem } from '@mui/material';
import { useNavigate } from "react-router-dom";
import OverflowMenu from "../OverflowMenu/OverflowMenu";


export interface RecipeDisplayProps {
    data?: RecipeDetailsInterface
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ data }) => {
    const navigate = useNavigate();
    if (!data) return (<>No Data</>);

    const handleOptionsClick = (event: { currentTarget: { id: string } })  => {
        const buttonId = event.currentTarget.id;
        switch (buttonId) {
          case "delete-recipe-button":
            navigate(`/recipe-details/${data.id}/delete`);
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

            <h1 className="mb-3">{data.name}</h1>
            <Card className="vh-30">
                <RecipeCarousel images={data.images} />
            </Card>
            <RecipeSummaryDisplay data={data} />
            <RecipeIngredientDisplay data={data} />
            <RecipeInstructionDisplay data={data} />
        </>
    )

}

export default RecipeDisplay;