import { Button, Form } from "react-bootstrap";
import { NewRecipeProps } from "../RecipeForm/RecipeForm";
import { useRef, useState } from "react";

const RecipeSummary: React.FC<NewRecipeProps> = ({ data, updateData }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (data) {
            updateData({
                ...data,
                [name]: value,
            })
        }
    };

    const handleUpload = () => {
        inputRef.current?.click();
    };

    const handleDisplayFileDetails = () => {
        inputRef.current?.files &&
            setUploadedFileName(inputRef.current.files[0].name);
    };

    return (
        <>
            <Form.Group className="mb-3" controlId="recipe-name">
                <Form.Label>Name</Form.Label>
                <Form.Control className="custom-form-control" type="text" placeholder="Enter Recipe Name" name="name" value={data?.name} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="recipe-description">
                <Form.Label>Description</Form.Label>
                <Form.Control className="custom-form-control" as="textarea" rows={3} placeholder="Description" name="description" value={data?.description} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="recipe-notes">
                <Form.Label>Notes</Form.Label>
                <Form.Control className="custom-form-control" as="textarea" rows={3} placeholder="Notes" name="notes" value={data?.notes} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="recipe-upload-image">
                <Form.Control className="d-none" name="upload-image" type="file" ref={inputRef} onChange={handleDisplayFileDetails}/>
                <Button className="custom-button recipe-button me-3" size="lg" type="button" onClick={handleUpload}  variant={uploadedFileName ? "success" : "primary"}>
                {uploadedFileName ? uploadedFileName : "Upload Photo"}
                </Button>
                
            </Form.Group>

        </>
    )
}

export default RecipeSummary;
