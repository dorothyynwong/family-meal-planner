import { Card, Form, FormLabel } from "react-bootstrap";
import { RecipeProps } from "./RecipeForm";
import ImageUploader from "../ImageUploader/ImageUploader";
import { FaRegEdit } from "react-icons/fa";
import "./RecipeForm.scss";

const RecipePhoto: React.FC<RecipeProps> = ({ data, updateData }) => {
    const imagesUrls = data.images || [];
    const updatedImages = data?.images || [];

    const handleUrlFromUploader = (urlFromUploader: string) => {
        updatedImages.push(urlFromUploader);
        updateData({
            ...data,
            images: updatedImages
        });
    }

    return (
        <Form.Group className="mb-3" controlId="photos">
            <FormLabel>Photos</FormLabel>
            {Array.from({ length: imagesUrls.length }, (_, i) => (
                <Card className="recipe-photo-card" key={"card-"[i]}>
                    <Card.Img variant="top" src={imagesUrls[i]} />
                    <FaRegEdit className="recipe-photo-edit-icon" />
                </Card>

            ))}
            <ImageUploader file={undefined} sendUrlToParent={handleUrlFromUploader} />
        </Form.Group>
    )
}

export default RecipePhoto;
