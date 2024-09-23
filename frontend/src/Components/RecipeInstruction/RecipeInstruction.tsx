import { useState } from "react";
import { Button, Col, Form, FormLabel, Row } from "react-bootstrap";
import { NewRecipeProps } from "../RecipeForm/RecipeForm";


const RecipeInstruction: React.FC<NewRecipeProps> = ({ data, updateData }) => {
    const instructions = data?.recipeInstructions || [];
    const [rowCount, setRowCount] = useState(instructions && instructions.length > 0 ? instructions.length : 5);

    const handleClick = () => {
        setRowCount(rowCount+1);
    }

    const handleChange = (index: number, value: string) => {
        if (data) {
            const updatedInstructions = [...instructions];
            updatedInstructions[index] = value;
            updateData({
                ...data,
                recipeInstructions: updatedInstructions,
            });
        }
        console.log(data);
    };


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
                            name={`instruction-${i+1}`}
                            onChange={(e) => handleChange(i, e.target.value)}
                        />
                    </Col>
                </Row>
            ))}
            <Button className="custom-button recipe-button" size="lg" onClick={handleClick}>Add More Instructions</Button>
        </Form.Group>
    )
}

export default RecipeInstruction;