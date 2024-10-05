import { Card, Form, FormLabel } from "react-bootstrap";
import { RecipeFormProps } from "./RecipeForm";
import ImageUploader from "../ImageUploader/ImageUploader";
import EditNoteIcon from '@mui/icons-material/EditNote';
import "./RecipeForm.scss";
import OverflowMenu from "../OverflowMenu/OverflowMenu";

const RecipePhotoForm: React.FC<RecipeFormProps> = ({ data, updateData }) => {
    const imagesUrls = data.images || [];

    const handleUrlFromUploader = (urlFromUploader: string) => {
        const updatedImages = data.images? [...data.images, urlFromUploader] : [urlFromUploader];
        updateData({
            ...data,
            images: updatedImages,
        });
    }

    const menuItems = [
        { id: "delete-image-button", label: "Delete" },
        { id: "set-default-image-button", label: "Set as Default" },
    ];

    const handleOptionsClick = (option: string, index: number) => {
        switch (option) {
            case "delete-image-button":
                handleDeleteImage(index);
                break
            case "set-default-image-button":
                handleSetDefault(index);
                break
            default:
                break
        }
    }

    const handleDeleteImage = (index: number) => {
        const newImages = imagesUrls.filter((_, i) => i !== index);
        const newDefaultImageUrl = data.defaultImageUrl === imagesUrls[index]? newImages[0] : data.defaultImageUrl;

        updateData({
            ...data,
            images: newImages,
            defaultImageUrl: newDefaultImageUrl
        });
    }

    const handleSetDefault = (index:number) => {
        const defaultImageUrl = imagesUrls[index];
        const newImages = imagesUrls.filter((_, i) => i !== index);
        newImages.unshift(defaultImageUrl);
        updateData({
            ...data,
            images: newImages,
            defaultImageUrl: imagesUrls[index]
        });
    }


    return (
        <Form.Group className="mb-3" controlId="photos">
            <FormLabel>Photos</FormLabel>
            {Array.from({ length: imagesUrls.length }, (_, i) => (
                <Card className="recipe-photo-card" key={"card-"[i]}>
                    <Card.Header key={"card-header-"[i]}>
                        <div className="overflow-menu-container">
                            <OverflowMenu menuItems={menuItems} handleOptionsClick={(option) => handleOptionsClick(option, i)} icon={EditNoteIcon} />
                        </div>
                    </Card.Header>
                    <Card.Img variant="top" src={imagesUrls[i]} />
                </Card>

            ))}
            <ImageUploader sendUrlToParent={handleUrlFromUploader} />
        </Form.Group>
    )
}

export default RecipePhotoForm;
