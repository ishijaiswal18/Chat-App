import React from 'react';

import {
    Box, 
    Text, 
    Avatar,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Image,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Spinner
} from "@chakra-ui/react";
import { CloseIcon, ViewIcon } from "@chakra-ui/icons";
import { ChatState } from '../../Context/ChatProvider';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import UserBadgeItem from '../UserAvatar/userBadgeItem';
import UserListItem from '../UserAvatar/userListItem';
import axios from 'axios';


const UpdateGroupChatModal = ({fetchAgain, setFetchAgain}) => {

    const {isOpen, onClose, onOpen} = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const {selectedChat, setSelectedChat, user} = ChatState();
    
    const userInfo = JSON.parse(user);

    const toasts = useToast();

    const handleRemove = (id) => {
        return async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const url = `/api/chat/${selectedChat._id}/remove/${id}`;
                const {data} = await axios.put(url, {}, config);
                
                setFetchAgain(!fetchAgain);
            } catch (error) {
                toasts({
                    title: "Error",
                    description: "Something went wrong",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                });
            }
        }
    }

    const handleRename = async () => {
        if(groupChatName === "") return;
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const url = `/api/chat/rename`;
            const {data} = await axios.put(url, {chatName: groupChatName, chatId: selectedChat._id}, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toasts({
                title: "Error",
                description: "Something went wrong",
                status: "error",
                duration: 2000,
                isClosable: true,
            });

            setRenameLoading(false);
        }
    }

    const LeaveGroup = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const url = `/api/chat/leave`;
            const {data} = await axios.put(url, {
                chatId : selectedChat._id,
            }, config);
            
            setFetchAgain(!fetchAgain);
            
        } catch (error) {
            console.log(error);
            toasts({
                title: "Error",
                description: "Something went wrong",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    }

    const handleSearch = async (value) => {
        if(value === "") return;

        try {
            setSearch(value);
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const url = `/api/user?search=${search}`;
            const {data} = await axios.get(url, config);
            
            setSearchResult(data);
            setLoading(false);
            return;
        } catch (error) {
            toasts({
                title: "Error",
                description: "Something went wrong",
                status: "error",
                duration: 2000,
                isClosable: true,
            });

            setLoading(false);
        }
        return;
    }

    const handleAddUser = async (userToAdd) => {
        
       if(selectedChat.users.find((u) => u._id === userToAdd._id)){
            toasts ({
                title: "User already in chat",
                description: "User is already in the chat",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
            
            return;
       }

       if(selectedChat.groupAdmin._id !== userInfo._id){
            toasts ({
                title: "User is not admin",
                description: "User is not admin of the chat",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
            return;
         }



        try {
            setLoading(true);
            

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const url = `/api/chat/groupadd`;
            const {data} = await axios.put(url, {
                chatId: selectedChat._id,
                userId: userToAdd._id
            }, config);

            setFetchAgain(!fetchAgain);
            setSelectedChat(data);
            setLoading(false);
        } catch (error) {
            toasts({
                title: "Error",
                description: "Something went wrong",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    }





    return (
        <>
        <IconButton
            display = "flex"
            icon = {<ViewIcon/>}
            onClick = {onOpen}
        />

        <Modal
            isOpen = {isOpen}
            onClose = {onClose}
            isCentered
        >
            
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader
                    fontSize = "xl"
                    fontWeight = "bold"
                    fontFamily = "Work Sans"
                    display = "flex"
                    justifyContent = "center"
                    color = "blue.500"
                >
                    {selectedChat.chatName.toUpperCase()}
                    
                </ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Box
                        display = "flex"
                        flexWrap= "wrap"
                        paddingBottom = "1rem"
                        width= "100%"
                    >
                        {selectedChat.users.map((user) => (
                            <UserBadgeItem
                                key = {user._id}
                                user = {user}
                                handleFunction = {handleRemove(user._id)}
                            />
                        ))}
                    </Box>
                    <FormControl
                        display = "flex"
                    >
                        <Input
                            placeholder = "Chat Name"
                            marginBottom= "1rem"
                            value = {groupChatName}
                            onChange = {(e) => setGroupChatName(e.target.value)}
                        />
                        <Button
                            colorScheme = "blue"
                            variant = "outline"
                            marginLeft = "1rem"
                            isLoading = {renameLoading}
                            onClick = {handleRename}
                        >
                            Rename
                        </Button>
                    </FormControl>
                    <FormControl>
                        <Input
                            placeholder = "Add User"
                            marginBottom= "1rem"
                            onChange = {(e) => handleSearch(e.target.value)}
                        />

                    </FormControl>
                    {loading ? (
                        <Spinner
                            thickness = "4px"
                            speed = "0.65s"
                            emptyColor = "gray.200"
                            color = "blue.500"
                            size = "xl"
                        />
                    ) : (   
                        <Box
                            display = "flex"
                            flexWrap= "wrap"
                            paddingBottom = "1rem"
                            width= "100%"
                        >
                            { searchResult?.slice(0, 3).map((user) => (
                                <UserListItem
                                    key = {user._id}
                                    user = {user}
                                    handleFunction = {() => handleAddUser(user)}
                                />
                            ))}
                        </Box>
                    )}

                </ModalBody>
                <ModalFooter>
                    <Button
                       onClick = {() => LeaveGroup(selectedChat._id)}
                       colorScheme = "red"
                       marginRight = "1rem"

                    >
                        Leave Group
                    </Button>
                </ModalFooter>
            </ModalContent>

        </Modal>

        </>
    );
}

export default UpdateGroupChatModal;