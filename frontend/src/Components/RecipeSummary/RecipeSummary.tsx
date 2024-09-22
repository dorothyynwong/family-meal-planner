import { Button, Form } from "react-bootstrap";

const RecipeSummary: React.FC = () => {
    return (
        <>
            <Form.Group className="mb-3" controlId="recipe-name">
                <Form.Label>Name</Form.Label>
                <Form.Control className="custom-form-control" type="text" placeholder="Enter Recipe Name" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="recipe-description">
                <Form.Label>Description</Form.Label>
                <Form.Control className="custom-form-control"  as="textarea" rows={3} placeholder="Description" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="recipe-notes">
                <Form.Label>Notes</Form.Label>
                <Form.Control className="custom-form-control"  as="textarea" rows={3} placeholder="Notes" />
            </Form.Group>

            <Button className="custom-button recipe-button" size="lg" type="button">
                Add Photo
            </Button>

        </>
    )
}

export default RecipeSummary;
