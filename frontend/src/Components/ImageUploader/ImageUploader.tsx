import { Button, Form } from "react-bootstrap";
import { NewRecipeProps } from "../RecipeForm/RecipeForm";
import { useRef, useState } from "react";
import { uploadImage } from "../../Api/api";

const ImageUploader: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedFilePath, setSelectedFilePath] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleUpload = () => {
        inputRef.current?.click();
    };

    const handleDisplayFileDetails = () => {
        if (inputRef.current?.files) {
            const file = inputRef.current.files[0];
            setSelectedFile(file);
            // if (file)
                // console.log(uploadImage(file));
            const cachedURL = URL.createObjectURL(file);
            setSelectedFilePath(cachedURL)
        }
    };

    return (
        <>
            <Form.Group className="mb-3" controlId="recipe-upload-image">
                <Form.Control className="d-none" name="upload-image" type="file" ref={inputRef} onChange={handleDisplayFileDetails}/>
                <Button className="custom-button recipe-button me-3" size="lg" type="button" onClick={handleUpload}>
                    Add Photo
                </Button>

                {selectedFile? <img alt="selected tea" src={selectedFilePath} width="100px" /> : <></>}
                
            </Form.Group>

        </>
    )
}

export default ImageUploader;
