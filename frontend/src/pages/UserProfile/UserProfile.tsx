import "./UserProfile.css";
import { IAuthProvider, IUserProfile } from "../../types/types";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthProvider/AuthProvider";
import { getProfile, updateUserProfile } from "../../API/profileApi";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import { FormControl, FormLabel, Input, FormErrorMessage, Button, Heading } from "@chakra-ui/react";
import AlertBanner from "../../components/AlertBanner/AlertBanner";

const UserProfile: React.FC = () => {

    const { user, editUser } = useAuth() as IAuthProvider;

    const [profile, setProfile] = useState<IUserProfile | string>("");
    const [editButton, setEditButton] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [updateDetails, setUpdateDetails] = useState<Partial<IUserProfile>>({ DOB: "", preferredName: "" });
    const [error, setError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean | string>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const getUserProfile = async (): Promise<IUserProfile> => {
        const urlName = window.location.pathname.split("/")[1];
        return await getProfile(urlName, user.token);
    };

    const handleUpdatedDetails = async (details: Partial<IUserProfile>): Promise<void> => {
        try {
            const updatedUser = await updateUserProfile(details, user);
            setProfile(updatedUser.user);
            setSuccess(updatedUser.message);
            setTimeout(() => {
                setSuccess(false);
                setEditMode(false);
            }, 3000);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleImageChange = async (image: string): Promise<void> => {
        if (image.includes("data")) {
            await updateUserProfile({ profileImage: image }, user);
            editUser({ profileImage: image });
        } else {
            setErrorMessage(image);
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        }
    };

    useEffect(() => {
        if (window.location.pathname.split("/")[1] === user.username) {
            setEditButton(true);
        }
        getUserProfile().then((res) => {
            setProfile(res);
        }).catch(e => setProfile(e.message));
    }, []);

    return (
        <div id="user-profile-container" className="user-profile-container">
            <div>
                {profile === "No user found" &&
                    <>{profile}</>
                }
                {typeof profile !== "string" &&
                    <div id="profile-page" className="profile-page">
                        {profile &&
                            <div id="read-profile" className="read-profile">
                                <Heading>{profile.username}'s  profile</Heading>
                                <br></br>
                                <ImageUploader
                                    avatar={profile.profileImage}
                                    user={user}
                                    editMode={editMode}
                                    callback={(image) => {
                                        handleImageChange(image);
                                    }}
                                />
                                <>
                                    {profile && !editMode &&
                                        <>
                                            <br></br>
                                            <p>Username: {profile.username}</p>
                                            <p>DOB: {profile.DOB}</p>
                                            <p>preferred name: {profile.preferredName}</p>
                                            <br></br>
                                            {editButton && !editMode &&
                                                <Button colorScheme='teal' size='md' onClick={() => setEditMode(true)} >
                                                    Edit Profile
                                                </Button>
                                            }
                                        </>
                                        // friends logic?
                                    }
                                </>

                            </div>

                        }
                        {profile && editMode &&
                            <div id="user-profile-form" className="user-profile-form">
                                <FormControl isInvalid={error} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                    <div>
                                        <br></br>
                                        <FormLabel>Date Of Birth</FormLabel>
                                        <Input
                                            type='date-of-birth'
                                            value={updateDetails.DOB}
                                            onChange={(e) => setUpdateDetails({ ...updateDetails, DOB: e.target.value })}
                                        />
                                        <FormLabel>Preferred Name</FormLabel>
                                        <Input
                                            type='preferred-name'
                                            value={updateDetails.preferredName}
                                            onChange={(e) => setUpdateDetails({ ...updateDetails, preferredName: e.target.value })} />
                                    </div>
                                    <br></br>
                                    <div>
                                        <Button colorScheme='teal' size='md' onClick={() => handleUpdatedDetails(updateDetails)} >
                                            Update Profile
                                        </Button>
                                    </div>
                                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                                </FormControl>
                            </div>
                        }
                    </div>
                }
                {success && <AlertBanner success={success} error={false} />}
                {errorMessage && <AlertBanner success={false} error={errorMessage} />}
            </div>
        </div>
    );
};

export default UserProfile;