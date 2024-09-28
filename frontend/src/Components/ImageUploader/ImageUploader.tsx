import { Button, Form } from "react-bootstrap";
import { useRef } from "react";
import { uploadImage } from "../../Api/api";

export interface ImageUploaderProps {
    sendUrlToParent: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({sendUrlToParent }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = () => {
        inputRef.current?.click();
    };

    const handleDisplayFileDetails = () => {
        if (inputRef.current?.files) {
            const file = inputRef.current.files[0];
            if (file) {
                uploadImage(file)
                    .then(response => {
                        sendUrlToParent(response.data);
                    }
                    )
                    .catch(error => {
                        console.error("Error uploading image:", error);
                    });
            }
        }

        if (inputRef.current) {
            inputRef.current.value = ""; 
        }
    };

    return (
        <>
            <Form.Group className="mb-3" controlId="recipe-upload-image">
                <Form.Control className="d-none" name="upload-image" type="file" ref={inputRef} onChange={handleDisplayFileDetails} />
                <Button className="custom-button recipe-button me-3" size="lg" type="button" onClick={handleUpload}>
                    Add Photo
                </Button>
            </Form.Group>

        </>
    )
}

export default ImageUploader;
