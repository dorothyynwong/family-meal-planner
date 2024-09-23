import { useState } from "react";
import { Button, Col, Form, FormLabel, Row } from "react-bootstrap";
import { ImportRecipeInterface } from "../../Api/apiInterface";


const RecipeIngredient: React.FC<ImportRecipeInterface> = (data) => {
    const ingredients = data.recipeIngredients;
    const [rowCount, setRowCount] = useState(ingredients && ingredients.length > 0 ? ingredients.length : 5);

    const handleClick = () => {
        setRowCount(rowCount+1);
    }

    return (
        <Form.Group className="mb-3" controlId="ingredients-list">
            <FormLabel>Ingredients</FormLabel>
            <Row key="ingredients-header">
                <Col key="quantity-header" style={{ textAlign: "center", fontWeight: "bold"}}>Quantity</Col>
                <Col key="unit-header" style={{ textAlign: "center", fontWeight: "bold"}}>Unit</Col>
                <Col key="ingredient-header" style={{ textAlign: "center", fontWeight: "bold"}}>Ingredient</Col>
            </Row>
            {Array.from({ length: rowCount }, (_, i) => (
                <Row key={i+1}>
                    <Col key={`col-1`}>
                        <Form.Control
                            className="mb-3 custom-form-control"
                            type="text"
                            aria-label={`quantity-${i+1}`}
                            aria-describedby="quantity"
                            
                        />
                    </Col>
                    <Col key={`col-2`}>
                        <Form.Control
                            className="mb-3 custom-form-control"
                            type="text"
                            aria-label={`unit-${i+1}`}
                            aria-describedby="unit"
                        />
                    </Col>
                    <Col key={`col-3`}>
                        <Form.Control
                            className="mb-3 custom-form-control"
                            type="text"
                            aria-label={`ingredient-${i+1}`}
                            aria-describedby="ingredient"
                            value={data.recipeIngredients? data.recipeIngredients[i] : ""}
                        />
                    </Col>
                </Row>
            ))}
            <Button className="custom-button recipe-button" size="lg" onClick={handleClick}>Add More Ingredients</Button>
        </Form.Group>
    )
}

export default RecipeIngredient;