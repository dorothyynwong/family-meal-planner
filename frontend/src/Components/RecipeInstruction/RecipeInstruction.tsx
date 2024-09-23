import { useState } from "react";
import { Button, Col, Form, FormLabel, Row } from "react-bootstrap";
import { ImportRecipeInterface } from "../../Api/apiInterface";


const RecipeInstruction: React.FC<ImportRecipeInterface> = (data) => {
    const instructions = data.recipeInstructions;
    const [rowCount, setRowCount] = useState(instructions && instructions.length > 0 ? instructions.length : 5);

    const handleClick = () => {
        setRowCount(rowCount+1);
    }

    return (
        <Form.Group className="mb-3" controlId="instructions-list">
            <FormLabel>Instructions</FormLabel>
            {Array.from({ length: rowCount }, (_, i) => (
                <Row key={i}>
                    <Col key={`col-1`}>
                        <Form.Control
                            className="mb-3 custom-form-control"
                            type="text"
                            aria-label={`instruction-${i+1}`}
                            aria-describedby="instruction"
                            value={instructions? instructions[i] : ""}
                        />
                    </Col>
                </Row>
            ))}
            <Button className="custom-button recipe-button" size="lg" onClick={handleClick}>Add More Instructions</Button>
        </Form.Group>
    )
}

export default RecipeInstruction;