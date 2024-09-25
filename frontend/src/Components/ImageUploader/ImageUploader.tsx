import { Button, Form } from "react-bootstrap";
import { useRef, useState } from "react";
import { uploadImage } from "../../Api/api";

export interface ImageUploaderProps {
    file?: File;
    urlToParent: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({file, urlToParent}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedFilePath, setSelectedFilePath] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(file || null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState("");

    const handleUpload = () => {
        inputRef.current?.click();
    };

    const handleDisplayFileDetails = () => {
        if (inputRef.current?.files) {
            const file = inputRef.current.files[0];
            setSelectedFile(file);
            if (file)
            {
                uploadImage(file)
                    .then(response => {
                        setUploadedFileUrl(response.data);
                        urlToParent(response.data);
                    }
                    )
                    .catch(error => {
                        console.error("Error uploading image:", error);
                    });
            }
                
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
