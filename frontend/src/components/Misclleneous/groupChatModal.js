import React, { useState } from 'react';
import { useDisclosure } from '@chakra-ui/hooks';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useToast,
    FormControl,
    FormLabel,
    Input,
    Box
    } from '@chakra-ui/react';

import {ChatState} from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/userListItem';
import UserBadgeItem from '../UserAvatar/userBadgeItem';


const GroupChatModal = ({ children }) => {

    const {isOpen, onOpen, onClose} = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const {chats, setChats, selectedChat, setSelectedChat, user} = ChatState();
    const userInfo = JSON.parse(user);

    const handleSearch = async (e) => {
        setSearch(e);
        if(e){
            try {
                setLoading(true);
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const url = `/api/user?search=${e}`;
                
                const {data} = await axios.get(url, config);

                setSearchResult(data);
                setLoading(false);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Something went wrong",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top-left"
                });
            }
        } else {
            setSearchResult([]);
            return;
        }
    }

    const handleSubmit = async () => {
        if(!groupChatName){
            toast({
                title: "Error",
                description: "Please enter group chat name",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left"
            });
            setGroupChatName("");
            setSearch("");
            setSelectedUsers([]);
            return;
        }
        else if(selectedUsers.length === 0){
            toast({
                title: "Error",
                description: "Please select users to create group chat",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left"
            });
            setGroupChatName("");
            setSearch("");
            setSelectedUsers([]);
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const selectedUsersId = JSON.stringify(selectedUsers.map((user) => user._id));
            const {data} = await axios.post("/api/chat/group", {
                chatName: groupChatName,
                users: selectedUsersId,
            }, config);
            setChats([data, ...chats]);
            setSelectedChat(data);
            setGroupChatName("");
            setSearch("");
            setSelectedUsers([]);
            onClose();
        } catch (error) {
            console.log(error);
            setGroupChatName("");
            setSearch("");
            setSelectedUsers([]);
            toast({
                title: "Error",
                description: "Something went wrong 234566",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left"
            });

        }
    }

    const handleGroup = (user) => {
        if(selectedUsers.includes(user)){
            toast({
                title: "Already added",
                description: "User already added",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top-left"
            });
            return;

        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    }

    const handledelete = (user) => {
        const newSelectedUsers = selectedUsers.filter((u) => u._id !== user._id);
        setSelectedUsers(newSelectedUsers);
    }









    return (
        <>
            <span onClick={onOpen}>{children}</span>
        
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader
                    fontSize='2xl'
                    display='flex'
                    justifyContent='center'
                    fontFamily='Poppins'
                >
                    Create Group Chat
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                >
                    <FormControl id='group-chat-name'>
                        <FormLabel
                            fontSize='xl'
                            fontFamily='Poppins'
                        >
                            Group Chat Name
                        </FormLabel>
                        <Input
                            type='text'
                            placeholder='Enter Group Chat Name'
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id='group-chat-users'>
                        <FormLabel
                            fontSize='xl'
                            fontFamily='Poppins'
                        >
                            Group Chat Users
                        </FormLabel>
                        <Input
                            type='text'
                            placeholder='Add group members'
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </FormControl>
                    <Box
                        display='flex'
                        flexWrap='wrap'
                        width = '100%'
                    >
                    {selectedUsers.map ((user) => (

                        <UserBadgeItem
                         key = {user._id}
                         user = {user} 
                            handleFunction = {() => {
                                handledelete(user)
                            }}
                        />
                    ))}
                    </Box>

                    {loading ?
                    <div>
                        loading
                    </div> : (
                        searchResult?.slice(0, 4).map((res) => (
                                <UserListItem
                                    key = {res._id}
                                    user = {res}
                                    handleFunction = {() => {
                                        handleGroup(res)
                                    }}

                                />

                        ))

                    )}

                </ModalBody>
        
                <ModalFooter>
                    <Button colorScheme = "blue" onClick={handleSubmit}>
                    Create Chat
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
      );
}

export default GroupChatModal;