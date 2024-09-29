import { Button, Form, Spinner } from "react-bootstrap";
import { useRef, useState } from "react";
import { uploadImage } from "../../Api/api";
import ErrorDisplay from "../ErrorDisplay/ErrorDisplay";

export interface ImageUploaderProps {
    sendUrlToParent: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ sendUrlToParent }) => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = () => {
        inputRef.current?.click();
    };

    const handleDisplayFileDetails = () => {
        if (inputRef.current?.files) {
            const file = inputRef.current.files[0];
            if (file) {
                setStatus("loading");
                setErrorMessages([]);
                uploadImage(file)
                    .then(response => {
                        sendUrlToParent(response.data);
                        setStatus("success");
                    }
                    )
                    .catch(error => {
                        console.log("Error uploading image", error);
                        const errorMessage = error?.response?.data?.message || "Error uploading image";
                        setStatus("error");
                        setErrorMessages([...errorMessages, errorMessage]);
                    });
            }
        }

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <>
            {errorMessages && <ErrorDisplay errorMessages={errorMessages} />}
            <Form.Group className="mb-3" controlId="recipe-upload-image">
                <Form.Control className="d-none" name="upload-image" type="file" ref={inputRef} onChange={handleDisplayFileDetails} />
                {status === "loading" ? (
                    <Spinner animation="border" role="status" className="me-3">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                ) : (
                    <Button className="custom-button recipe-button me-3" size="lg" type="button" onClick={handleUpload}>
                        Add Photo
                    </Button>
                )}
            </Form.Group>

        </>
    )
}

export default ImageUploader;
