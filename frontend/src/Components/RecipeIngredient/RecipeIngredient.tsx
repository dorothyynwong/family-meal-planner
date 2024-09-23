import { useEffect, useState } from "react";
import { Button, Col, Form, FormLabel, Row } from "react-bootstrap";
import { NewRecipeProps } from "../RecipeForm/RecipeForm";


const RecipeIngreident: React.FC<NewRecipeProps> = ({ data, updateData }) => {
    const ingredients = data?.recipeIngredients || [];
    const [rowCount, setRowCount] = useState(5);

    useEffect(() => {
        setRowCount(ingredients.length > 0 ? ingredients.length : 5);
    }, [data, ingredients.length]); 

    const handleClick = () => {
        setRowCount(rowCount+1);
    }

    const handleChange = (index: number, value: string) => {
        if (data) {
            const updatedIngredients = [...ingredients];
            updatedIngredients[index] = value;
            updateData({
                ...data,
                recipeIngredients: updatedIngredients,
            });
        }
        console.log(data);
    };


    return (
        <Form.Group className="mb-3" controlId="ingredients-list">
            <FormLabel>ingredients</FormLabel>
            {Array.from({ length: rowCount }, (_, i) => (
                <Row key={i}>
                    <Col key={`col-1`}>
                        <Form.Control
                            className="mb-3 custom-form-control"
                            type="text"
                            aria-label={`ingredient-${i+1}`}
                            aria-describedby="ingreident"
                            value={ingredients? ingredients[i] : ""}
                            name={`ingreident-${i+1}`}
                            onChange={(e) => handleChange(i, e.target.value)}
                        />
                    </Col>
                </Row>
            ))}
            <Button className="custom-button recipe-button" size="lg" onClick={handleClick}>Add More Ingredients</Button>
        </Form.Group>
    )
}

export default RecipeIngreident;