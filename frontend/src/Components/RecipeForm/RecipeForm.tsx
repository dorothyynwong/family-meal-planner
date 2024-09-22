import { Button, Form } from "react-bootstrap";

// import RecipeSummary from "../RecipeSummary/RecipeSummary";

const RecipeForm: React.FC = () => {
    return (
        <Form>
            <Form.Group className="mb-3" controlId="recipe-name">
                <Form.Label>Name</Form.Label>
                <Form.Control className="custom-form-control" type="text" placeholder="Enter Recipe Name" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="recipe-description">
                <Form.Label>Description</Form.Label>
                <Form.Control className="custom-form-control" type="text" placeholder="Description" />
            </Form.Group>
            <Button className="mb-3 custom-button" size="lg" style={{ fontSize: '1rem' }} type="button">
                Add Photo
            </Button>
        </Form>
    )

}

export default RecipeForm;