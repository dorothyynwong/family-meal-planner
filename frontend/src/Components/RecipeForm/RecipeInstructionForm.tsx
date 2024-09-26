import { useEffect, useState } from "react";
import { Button, Col, Form, FormLabel, Row } from "react-bootstrap";
import { RecipeFormProps } from "./RecipeForm";
import { RxCross2 } from "react-icons/rx";


const RecipeInstructionForm: React.FC<RecipeFormProps> = ({ data, updateData }) => {
    const instructions = data?.recipeInstructions || [];
    const [rowCount, setRowCount] = useState(5);

    useEffect(() => {
        setRowCount(instructions.length || 1);
    }, [instructions.length]); 

    const handleClick = () => {
        setRowCount(rowCount+1);
    }

    const handleCrossClick = (index: number) => {
        if (!data) return;
    
        const updatedInstructions = data.recipeInstructions?.filter((_, i) => i !== index);
    
        updateData({
            ...data,
            recipeInstructions: updatedInstructions && updatedInstructions.length > 0
                ? updatedInstructions
                : [""],
        });
    };

    const handleChange = (index: number, value: string) => {
        if (data) {
            const updatedInstructions = [...instructions];
            updatedInstructions[index] = value;
            updateData({
                ...data,
                recipeInstructions: updatedInstructions,
            });
        }
    };

    return (
        <Form.Group className="mb-3" controlId="instructions-list">
            <FormLabel>Instructions</FormLabel>
            {Array.from({ length: rowCount }, (_, i) => (
                <Row key={i}>
                    <Col key={`col-1`} xs={10}>
                        <Form.Control
                            className="mb-3 custom-form-control"
                            type="text"
                            aria-label={`instruction-${i+1}`}
                            aria-describedby="instruction"
                            value={instructions && instructions[i]? instructions[i] : ""}
                            name={`instruction-${i+1}`}
                            onChange={(e) => handleChange(i, e.target.value)}
                        />
                    </Col>
                    <Col key={`col-2`} xs={2}>
                        <RxCross2 onClick={() => handleCrossClick(i)} size="25"/>
                    </Col>
                </Row>
            ))}
            <Button className="custom-button recipe-button" size="lg" onClick={handleClick}>Add More Instructions</Button>
        </Form.Group>
    )
}

export default RecipeInstructionForm;