import { Card, Form, FormLabel } from "react-bootstrap";
import { RecipeFormProps } from "./RecipeForm";
import ImageUploader from "../ImageUploader/ImageUploader";
import EditNoteIcon from '@mui/icons-material/EditNote';
import "./RecipeForm.scss";
import OverflowMenu from "../OverflowMenu/OverflowMenu";

const RecipePhotoForm: React.FC<RecipeFormProps> = ({ data, updateData }) => {
    const imagesUrls = data.images || [];
    const updatedImages = data?.images || [];

    const handleUrlFromUploader = (urlFromUploader: string) => {
        updatedImages.push(urlFromUploader);
        updateData({
            ...data,
            images: updatedImages
        });
    }

    const menuItems = [
        { id: "delete-image-button", label: "Delete" },
        { id: "set-default-image-button", label: "Set as Default" },
    ];

    const handleOptionsClick = (option: string) => {
        switch (option) {
            case "delete-image-button":
                break
            case "set-default-image-button":
                break
            default:
                break
        }
    }

    return (
        <Form.Group className="mb-3" controlId="photos">
            <FormLabel>Photos</FormLabel>
            {Array.from({ length: imagesUrls.length }, (_, i) => (
                <Card className="recipe-photo-card" key={"card-"[i]}>
                    <Card.Header>
                        <div className="overflow-menu-container">
                            <OverflowMenu menuItems={menuItems} handleOptionsClick={handleOptionsClick} icon={EditNoteIcon} />
                        </div>
                    </Card.Header>
                    <Card.Img variant="top" src={imagesUrls[i]} />
                </Card>

            ))}
            <ImageUploader file={undefined} sendUrlToParent={handleUrlFromUploader} />
        </Form.Group>
    )
}

export default RecipePhotoForm;
