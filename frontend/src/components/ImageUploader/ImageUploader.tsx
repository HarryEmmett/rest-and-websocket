import "./ImageUploader.css";
import { Avatar, Button, Stack } from "@chakra-ui/react";
import { IUser } from "../../types/types";
import { ChangeEvent } from "react";
import { useState } from "react";

interface IUserProps {
    user: IUser;
    editMode: boolean;
    avatar: string;
    callback: (image: string) => void;
}

const ImageUploader: React.FC<IUserProps> = ({ user, editMode, avatar, callback }) => {

    const [display, setDisplay] = useState(avatar);

    const handleUpload = (e: ChangeEvent<HTMLInputElement>): void => {
        const acceptedType = ["image/jpeg"];
        const acceptedSize = 10000000;

        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        
        if (!acceptedType.includes(file.type)) {
            callback("Unsupported image format");
        } else if (file.size > acceptedSize) {
            callback("File too big");
        } else {
            new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (event: ProgressEvent<FileReader>): void => {
                    if (event.target && event.target.result) {
                        resolve(event.target.result);
                        setDisplay(event.target.result as string);
                        callback(event.target.result as string);
                    }
                };
                reader.readAsDataURL(file);
            });

        }
    };

    return (
        <Stack alignItems="center">
            <Avatar size='2xl' name={`${user.username}-avatar`} src={display} />
            {editMode &&
                <Button
                    size="md"
                    className="image-button"
                    id="image-button"
                >
                    <input
                        type="file"
                        aria-hidden="true"
                        accept="image/*"
                        onChange={(e) => handleUpload(e)}
                        className="image-input"
                        id="image-input"
                    />
                    Upload Image
                </Button>

            }
        </Stack>
    );
};

export default ImageUploader;