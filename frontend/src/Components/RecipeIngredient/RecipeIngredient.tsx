import { useState } from "react";
import { Button, Col, Form, FormLabel, Row } from "react-bootstrap";


const RecipeIngredient: React.FC = () => {
    const [rowCount, setRowCount] = useState(5);

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
                <Row key={i}>
                    <Col key={i - 1}>
                        <Form.Control
                            className="mb-3 custom-form-control"
                            type="text"
                            id={`quantity-${i}`}
                            aria-describedby="quantity"
                        />
                    </Col>
                    <Col key={i - 2}>
                        <Form.Control
                            className="mb-3 custom-form-control"
                            type="text"
                            id={`unit-${i}`}
                            aria-describedby="unit"
                        />
                    </Col>
                    <Col key={i - 3}>
                        <Form.Control
                            className="mb-3 custom-form-control"
                            type="text"
                            id={`ingredient--${i}`}
                            aria-describedby="ingredient"
                        />
                    </Col>
                </Row>
            ))}
            <Button className="custom-button recipe-button" size="lg" onClick={handleClick}>Add More Ingredients</Button>
        </Form.Group>
    )
}

export default RecipeIngredient;