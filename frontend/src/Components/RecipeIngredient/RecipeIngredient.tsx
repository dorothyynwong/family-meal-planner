import { useEffect, useState } from "react";
import { Button, Col, Form, FormLabel, Row } from "react-bootstrap";
import { NewRecipeProps } from "../RecipeForm/RecipeForm";

interface Ingredient {
    quantity: string;
    name: string;
  }

  const parseIngredient = (ingredient: string): Ingredient => {

    const regex = /^(\S+)\s+(.+)$/; 
    const match = ingredient.match(regex);
  
    if (match) {
      const isQuantity = /^\d/.test(match[1]); 
      return {
        quantity: isQuantity ? match[1].trim() : '', 
        name: isQuantity ? match[2].trim() : match[0].trim() 
      };
    }
  
    return { quantity: '', name: ingredient }; 
  };

const RecipeIngredient: React.FC<NewRecipeProps> = ({ data, updateData }) => {
    const ingredientsList = data?.recipeIngredients || [];
    const parsedIngredients = ingredientsList?.map(parseIngredient);
    
    const [rowCount, setRowCount] = useState(5);

    useEffect(() => {
        setRowCount(ingredientsList.length > 0 ? ingredientsList.length : 5);
    }, [data, ingredientsList.length]); 

    const handleClick = () => {
        setRowCount(rowCount+1);
    }

    const handleChange = (index: number, field: keyof Ingredient, value: string) => {
        if (data) {
            const updatedIngredientsList = [...parsedIngredients];
            if(updatedIngredientsList[index])
                updatedIngredientsList[index][field] = value;
            else
            updatedIngredientsList[index] = { 
                quantity: field === 'quantity' ? value : '', 
                name: field === 'name' ? value : '' 
            };
            updateData({
                ...data,
                recipeIngredients: updatedIngredientsList.map(ingredient => `${ingredient.quantity} ${ingredient.name}`).filter(Boolean),
            });
        }

        console.log(data)
    };

    return (
        <Form.Group className="mb-3" controlId="ingredients-list">
            <FormLabel>Ingredients</FormLabel>
            <Row key="ingredients-header">
                <Col key="quantity-header" style={{ textAlign: "center", fontWeight: "bold"}} xs={4}>Quantity</Col>
                <Col key="ingredient-header" style={{ textAlign: "center", fontWeight: "bold"}} xs={8}>Ingredient</Col>
            </Row>
            {Array.from({ length: rowCount }, (_, i) => (
                <Row key={i+1}>
                    <Col key={`col-1`} xs={4}>
                        <Form.Control
                            className="mb-3 custom-form-control"
                            type="text"
                            aria-label={`quantity-${i+1}`}
                            aria-describedby="quantity"
                            value={parsedIngredients[i]? parsedIngredients[i].quantity : ""}
                            name={`quantity-${i+1}`}    
                            onChange={(e) => handleChange(i, "quantity", e.target.value)}
                        />
                    </Col>
                    <Col key={`col-2`} xs={8}>
                        <Form.Control
                            className="mb-3 custom-form-control"
                            type="text"
                            aria-label={`ingredient-${i+1}`}
                            aria-describedby="ingredient"
                            value={parsedIngredients[i]? parsedIngredients[i].name : ""}
                            name={`ingredient-${i+1}`}    
                            onChange={(e) => handleChange(i, "name", e.target.value)}
                        />
                    </Col>
                </Row>
            ))}
            <Button className="custom-button recipe-button" size="lg" onClick={handleClick}>Add More Ingredients</Button>
        </Form.Group>
    )
}

export default RecipeIngredient;