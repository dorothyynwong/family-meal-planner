import { Button, Form} from "react-bootstrap";
import "./RecipeForm.scss";

const RecipeForm: React.FC = () => {
    return (
        <>
            <Form>
                <Form.Group className="mb-3" controlId="recipe-name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Recipe Name" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="recipe-description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" placeholder="Description" />
                </Form.Group>
                <Button className="mb-3 custom-button"  size="lg" style={{ fontSize: '1rem' }}  type="button">
                    Add Photo
                </Button>
            </Form>
        </>
    )
}

export default RecipeForm;
