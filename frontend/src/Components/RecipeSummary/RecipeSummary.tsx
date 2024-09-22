import { Button, Form } from "react-bootstrap";
import "./RecipeSummary.scss";

const RecipeSummary: React.FC = () => {
    return (
        <>
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

        </>
    )
}

export default RecipeSummary;
