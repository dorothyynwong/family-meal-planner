import { Button, Form } from "react-bootstrap";
import RecipeSummary from "./RecipeSummary";
import RecipeIngredient from "./RecipeIngredient";
import "./RecipeForm.scss"
import RecipeInstruction from "./RecipeInstruction";
import { NewRecipeData } from "../../Pages/NewRecipe/NewRecipe";
import { addRecipe } from "../../Api/api";
import ImageUploader from "../ImageUploader/ImageUploader";
import { useState } from "react";
import ControlledCarousel from "../RecipeCarousel/RecipeCarousel";
import RecipeCarousel from "../RecipeCarousel/RecipeCarousel";

export interface RecipeProps {
    data: NewRecipeData;
    updateData: (newData: NewRecipeData) => void;
}

const RecipeForm: React.FC<RecipeProps> = ({ data, updateData }) => {
    const updatedImages = data?.images || [];
    const [uploadedFileUrl, setUploadedFileUrl] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (data) {
            addRecipe(data);
        }

    }

    function handleUrlFromUploader(urlFromUploader: string) {
        setUploadedFileUrl(urlFromUploader);
        
        updatedImages.push(urlFromUploader);
        updateData({
            ...data,
            images: updatedImages
        });
    }

    return (
        <Form onSubmit={handleSubmit}>
            <RecipeCarousel data={data} updateData={updateData}/>
            <ImageUploader file={undefined} sendUrlToParent={handleUrlFromUploader} />
            <RecipeSummary data={data} updateData={updateData} />
            <RecipeIngredient data={data} updateData={updateData} />
            <RecipeInstruction data={data} updateData={updateData} />
            <div className="d-flex justify-content-end">
                <Button className="custom-button recipe-button" size="lg" type="submit">
                    Submit
                </Button>
            </div>
        </Form>
    )

}

export default RecipeForm;