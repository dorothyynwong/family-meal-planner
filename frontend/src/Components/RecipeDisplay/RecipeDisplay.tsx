import { RecipeDetailsInterface } from "../../Api/apiInterface";
import RecipeSummaryDisplay from "./RecipeSummaryDisplay";
import RecipeIngredientDisplay from "./RecipeIngredientDisplay";
import RecipeCarousel from "../RecipeCarousel/RecipeCarousel";
import RecipeInstructionDisplay from "./RecipeInstructionDisplay";
import { Card, Col, Row } from "react-bootstrap";
import { MdArrowBackIosNew } from "react-icons/md";
import MoreOptionsMenu from "../MoreOptionsMenu/MoreOptionsMenu";
import { useNavigate } from "react-router-dom";


export interface RecipeDisplayProps {
    data?: RecipeDetailsInterface
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ data }) => {
    const navigate = useNavigate();

    if (!data) return (<>No Data</>);
    
    return (
        <>
            <Row>
                <Col xs={10}>
                    <MdArrowBackIosNew size={20} onClick={()=> navigate(-1)}/>
                </Col>
                <Col xs={2}>
                    <MoreOptionsMenu menuType="recipeDetails" id={data.id} />
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