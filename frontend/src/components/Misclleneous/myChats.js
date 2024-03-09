import React, {useContext, useEffect, useState} from 'react';
import {ChatState} from "../../Context/ChatProvider";
import axios from "axios";
import { Box, Text, Avatar, Button, Stack, useToast } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./chatLoading";
import {getSender} from "../../config/chatLogics";
import GroupChatModal from "./groupChatModal.js";


const MyChats = ({fetchAgain}) => {

    const {chats, setChats, selectedChat, setSelectedChat, user} = ChatState();
    const userInfo = JSON.parse(user);

    const [loggedInUser, setLoggedInUser] = useState(null);
    
    const toast = useToast();

    const fetchChats = async () => {
        try {               const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
        
            const { data } = await axios.get(`/api/chat`, config);
            setChats(data);
        } catch (error) {
            toast ({
                title: "Error in fetching chats",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left"
            });
        }
    }

    useEffect(() => {
        setLoggedInUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain]);

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDirection="column"
            width={{ base: "100%", md: "35%" }}
            alignItems="center"
            padding="3rem"
            borderRadius="lg"
            borderWidth="1px"
            bg="gray.100"
            margin="0 0.2rem 0.5rem 0.2rem"
        >
            <Box
                padding-bottom="3rem"
                padding-right="3rem"
                padding-left="3rem"
                fontSize={{ base: "1.75rem", md: "1rem", lg: "1.5rem" }}
                fontFamily="Work Sans"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                bg="gray.100"
                color="gray.900"
                fontWeight="bold"
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display="flex"
                        fontSize={{ base: "1rem", md: "0.75rem", lg: "0.75rem" }}
                        rightIcon={<AddIcon />}
                        bg="teal.300"
                        color="gray.600"
                        _hover={{
                            bg: "teal.400",
                            color: "gray.700"
                        }}
                        _active={{
                            bg: "teal.500",
                            color: "gray.800"
                        }}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                bg="gray.100"
                width="100%"
                height="100%"
                overflow="hidden"
                borderRadius="lg"
                margin="1rem"
            >
                {chats ? (
                    <Stack spacing={4} overflowY="scroll">
                        {chats.map((chat) => (
                            <Box
                                key={chat._id}
                                display="flex"
                                padding="1rem"
                                borderRadius="lg"
                                bg={selectedChat && selectedChat._id === chat._id ? "teal.300" : "gray.300"}
                                color={selectedChat && selectedChat._id === chat._id ? "gray.600" : "gray.900"}
                                onClick={() => setSelectedChat(chat)}
                                cursor="pointer"
                                _hover={{
                                    bg: "teal.200",
                                    color: "gray.600"
                                }}
                            >
                                <Text>
                                    {!chat.isGroupChat ? (
                                        getSender(loggedInUser, chat.users)
                                    ) : (
                                        chat.chatName
                                    )}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );
}

export default MyChats;