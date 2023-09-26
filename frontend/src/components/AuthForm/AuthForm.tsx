import "./AuthForm.css";
import { ILogin, IUpdateDetails } from "../../types/types";
import { useState, useRef } from "react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
    Button, FormControl, FormLabel,
    Heading, Input, InputGroup, InputRightElement,
    Link, Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalFooter, ModalHeader, ModalOverlay,
    Stack, useDisclosure
} from "@chakra-ui/react";
import React from "react";

interface IAuthFormProps {
    heading: "LOGIN" | "REGISTER";
    handleLogin: (loginDetails: ILogin) => void;
    handleReset?: (UpdateDetails: IUpdateDetails) => void;
}

const AuthForm: React.FC<IAuthFormProps> = ({ heading, handleLogin, handleReset }): JSX.Element => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [updateDetails, setUpdateDetails] = useState({
        username: "",
        oldPassword: "",
        newPassword: ""
    });

    const { isOpen, onOpen, onClose } = useDisclosure();

    const InitialFocus = (): JSX.Element | undefined => {

        if (!handleReset) {
            return;
        }

        const initialRef = useRef(null);
        const finalRef = useRef(null);

        return (
            <div>
                <Modal
                    initialFocusRef={initialRef}
                    finalFocusRef={finalRef}
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>RESET PASSWORD</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl>
                                <FormLabel>Enter username</FormLabel>
                                <InputGroup>
                                    <Input
                                        ref={initialRef}
                                        onChange={(e): void => setUpdateDetails({ ...updateDetails, username: e.target.value })}
                                        placeholder="Enter username"
                                        value={updateDetails.username}
                                    />
                                    {updateDetails.username.length >= 5 && <InputRightElement children={<CheckIcon color="green.500" />} />}
                                    {updateDetails.username.length > 0 && updateDetails.username.length < 5 &&
                                        <InputRightElement children={<CloseIcon color="red.500" />}
                                        />}
                                </InputGroup>

                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Old password</FormLabel>
                                <InputGroup>
                                    <Input
                                        onChange={(e): void => setUpdateDetails({ ...updateDetails, oldPassword: e.target.value })}
                                        placeholder='Old password'
                                        type="password"
                                    />
                                    {updateDetails.oldPassword.length >= 5 && <InputRightElement children={<CheckIcon color="green.500" />} />}
                                    {updateDetails.oldPassword.length > 0 && updateDetails.oldPassword.length < 5 &&
                                        <InputRightElement children={<CloseIcon color="red.500" />}
                                        />}
                                </InputGroup>
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>New password</FormLabel>
                                <InputGroup>
                                    <Input
                                        onChange={(e): void => setUpdateDetails({ ...updateDetails, newPassword: e.target.value })}
                                        placeholder='New password'
                                        type="password"
                                    />
                                    {updateDetails.newPassword.length >= 5 && <InputRightElement children={<CheckIcon color="green.500" />} />}
                                    {updateDetails.newPassword.length > 0 && updateDetails.newPassword.length < 5 &&
                                        <InputRightElement children={<CloseIcon color="red.500" />}
                                        />}
                                </InputGroup>
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                onClick={(): void => {
                                    handleReset(updateDetails);
                                    setUpdateDetails({
                                        username: updateDetails.username,
                                        oldPassword: "",
                                        newPassword: ""
                                    });
                                    onClose();
                                }}
                                isDisabled={
                                    updateDetails.newPassword.length < 5 ||
                                    updateDetails.oldPassword.length < 5 ||
                                    updateDetails.username.length < 5
                                }
                                colorScheme='blue' mr={3}>
                                Reset
                            </Button>
                            <Button onClick={(): void => {
                                setUpdateDetails({
                                    username: updateDetails.username,
                                    oldPassword: "",
                                    newPassword: ""
                                });
                                onClose();
                            }
                            }>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        );
    };

    return (
        <div id="auth-container" className="auth-container">
            <Stack spacing={4} width={"300px"}>
                <Heading fontSize={36} height={"48px"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                    {heading}
                </Heading>
                <InputGroup>
                    <Input
                        type="input"
                        placeholder="username"
                        background="white"
                        onChange={(e): void => setUsername(e.target.value)}
                        value={username}
                    />
                    {username.length >= 5 && <InputRightElement children={<CheckIcon color="green.500" />} />}
                    {username.length > 0 && username.length < 5 && <InputRightElement children={<CloseIcon color="red.500" />}
                    />}
                </InputGroup>
                <InputGroup>
                    <Input
                        placeholder="password"
                        type="password"
                        background="white"
                        onChange={(e): void => setPassword(e.target.value)}
                        value={password}
                    />
                    {password.length >= 5 && <InputRightElement children={<CheckIcon color="green.500" />} />}
                    {password.length > 0 && password.length < 5 && <InputRightElement children={<CloseIcon color="red.500" />}
                    />}
                </InputGroup>
                <div id="button-container" className="button-container">
                    <Button
                        id="auth-button"
                        className="auth-button"
                        background="white"
                        colorScheme="teal"
                        variant="outline"
                        isDisabled={password.length < 5 || username.length < 5}
                        onClick={(): void => handleLogin(
                            {
                                username: username,
                                password: password
                            }
                        )}
                    >
                        {heading}
                    </Button>
                    {heading === "LOGIN" ?
                        <div id="login-link" className="login-link">
                            <Link
                                id="link"
                                className="link"
                                color={"blue"}
                                href="/register">
                                register
                            </Link>
                            <Link
                                id="link"
                                className="link"
                                color={"blue"}
                                onClick={() => {
                                    setUsername("");
                                    setPassword("");
                                    onOpen();
                                }}
                            >
                                reset
                            </Link>
                        </div>
                        :
                        <Link
                            id="link"
                            className="link"
                            color={"blue"}
                            href="/login"
                        >
                            Already registered? login
                        </Link>
                    }
                </div>
            </Stack>
            {InitialFocus()}
        </div>

    );
};

export default AuthForm;