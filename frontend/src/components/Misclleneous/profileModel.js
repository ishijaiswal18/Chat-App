import React from 'react';
import { ViewIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    IconButton,
    Image,
    Text,
    Avatar
} from "@chakra-ui/react";



const ProfileModel = ({ user, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {
                children ? (
                    <span onClick={onOpen} >
                        {children}
                    </span>
                ) : (
                    <IconButton
                        aria-label="Profile"
                        display={{ base: "flex" }}
                        icon={<ViewIcon />}
                        onClick={onOpen}
                    />
                )
            }

            <Modal
                size="lg"
                isCentered
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent
                    height="400px"
                >
                    <ModalHeader
                        fontSize="xl"
                        fontWeight="bold"
                        fontFamily="Work Sans"
                        display="flex"
                        justifyContent="center"
                    > {user.name} </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Avatar 
                        margin = "2px"
                        size="2xl"
                        cursor = "pointer"
                        name={user.name}
                        src={user.picture ? user.picture : "https://bit.ly/broken-link"}
                    />
                        {/* <Image
                            src={user.picture ? user.picture : "https://bit.ly/broken-link"}
                            alt="Profile Pic"
                            borderRadius="full"
                            boxSize="150px"
                            margin="auto"
                            display="block"

                        /> */}
                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color = "teal"
                            fontFamily="Work Sans"
                            textAlign="center"
                            margin="10px"

                        >
                            {user.email}
                        </Text>


                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}


export default ProfileModel;