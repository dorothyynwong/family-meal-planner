import { useEffect, useState } from "react";
import { Button, Col, Form, FormLabel, Row } from "react-bootstrap";
import { RecipeFormProps } from "./RecipeForm";
import { RxCross2 } from "react-icons/rx";


const RecipeIngreident: React.FC<RecipeFormProps> = ({ data, updateData }) => {
    const ingredients = data?.recipeIngredients || [];
    const [rowCount, setRowCount] = useState(5);

    useEffect(() => {
        setRowCount(ingredients.length > 0 ? ingredients.length : 5);
    }, [data, ingredients.length]); 

    const handleClick = () => {
        setRowCount(rowCount+1);
    }

    const handleCrossClick = (index: number) => {
        if (!data) return;
    
        const updatedIngredients = data.recipeIngredients?.filter((_, i) => i !== index);
    
        updateData({
            ...data,
            recipeIngredients: updatedIngredients && updatedIngredients.length > 0
                ? updatedIngredients
                : [""],
        });
    };
    const handleChange = (index: number, value: string) => {
        if (data) {
            const updatedIngredients = [...ingredients];
            updatedIngredients[index] = value;
            updateData({
                ...data,
                recipeIngredients: updatedIngredients,
            });
        }
    };


    return (
        <Form.Group className="mb-3" controlId="ingredients-list">
            <FormLabel>Ingredients</FormLabel>
            {Array.from({ length: rowCount }, (_, i) => (
                <Row key={i}>
                    <Col key={`col-1`}>
                        <Form.Control
                            className="mb-3 custom-form-control"
                            type="text"
                            aria-label={`ingredient-${i+1}`}
                            aria-describedby="ingreident"
                            value={ingredients && ingredients[i] ? ingredients[i] : ""}
                            name={`ingreident-${i+1}`}
                            onChange={(e) => handleChange(i, e.target.value)}
                        />
                    </Col>
                    <Col key={`col-2`} xs={2}>
                        <RxCross2 onClick={() => handleCrossClick(i)} size="25"/>
                    </Col>
                </Row>
            ))}
            <Button className="custom-button recipe-button" size="lg" onClick={handleClick}>Add More Ingredients</Button>
        </Form.Group>
    )
}

export default RecipeIngreident;