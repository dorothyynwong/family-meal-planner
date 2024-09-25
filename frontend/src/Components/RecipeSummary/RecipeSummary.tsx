import { Button, Form } from "react-bootstrap";
import { NewRecipeProps } from "../RecipeForm/RecipeForm";
import { useRef, useState } from "react";
import { uploadImage } from "../../Api/api";
import ImageUploader from "../ImageUploader/ImageUploader";

const RecipeSummary: React.FC<NewRecipeProps> = ({ data, updateData }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (data) {
            updateData({
                ...data,
                [name]: value,
            })
        }
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

        </>
    )
}

export default RecipeSummary;
