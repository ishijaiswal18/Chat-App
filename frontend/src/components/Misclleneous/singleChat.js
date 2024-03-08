import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

import { Box, Text, Avatar, IconButton } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModel from "./profileModel";
import { getSender, getSenderFull} from "../../config/chatLogics";
import UpdateGroupChatModal from "./updateGroupChatModal";
import io from "socket.io-client";


const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;


const SingleChat = ({fetchAgain, setFetchAgain}) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);

    const toast = useToast();


    const { user, selectedChat, setSelectedChat } = ChatState();
    const userInfo = JSON.parse(user);


    const fetchMessages = async () => {
        if(!selectedChat) return;

        try{
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            setLoading(true);

            const {data} = await axios.get(
                `/api/chat/${selectedChat._id}`,
                config
            );

            setMessages(data);
            setLoading(false);

        } catch(error){
            toast ({
                title: "Error in fetching messages",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left"
            });
        }
    };

    const sendMessage = async (e) => {

        if (e.key === "Enter" && !e.shiftKey && newMessage) {
            socket.emit("sendMessage", {
                sender: userInfo._id,
                content: newMessage,
                chatId: selectedChat._id,
                receivers: selectedChat.users,
                });

            try{
                const config = {
                    headers: {
                        ContentType: "application/json",
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                setNewMessage("");
                const {data} = await axios.post(
                    `/api/message`,
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                        receivers: selectedChat.users,
                    },
                    config
                );

                setMessages([...messages, data]);
                socket.emit("messageSent", data);
            } catch(error){
                toast ({
                    title: "Error in sending message",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "top-left"
                });
            }



        }

    }

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);


    useEffect(() => {
        socket = io();
        socket.emit("join", { chat: selectedChat });
        socket.on("joined", () => {
            setSocketConnected(true);
        });
    }, []);


    return (
        <>
            {selectedChat ? (
                <>
                <Text 
                    fontSize = {{base: "2xl", md: "3xl"}}
                    padding = "0.5rem"
                    fontFamily = "monospace"
                    display= "flex"
                    justifyContent= {{base: "space-between"}}
                    alignItems= "center"
                    width = "100%"
                    color = "blue.500"
                >
                    
                    <IconButton
                        aria-label = "Back"
                        display = {{base: "flex", md: "none"}}
                        icon = {<ArrowBackIcon/>}
                        onClick = {() => { setSelectedChat("")}}
                    />
                    {!selectedChat.isGroupChat ? (
                        <>
                            {getSender(userInfo, selectedChat.users)}
                            <ProfileModel 
                                user = {getSenderFull(userInfo, selectedChat.users)}
                            />
                        </>) :
                        (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain = {fetchAgain}
                                    setFetchAgain = {setFetchAgain}
                                />
                                
                                
                            </>
                            
                        )
                    }
                </Text>

                <Box
                    display = "flex"
                    flexDirection = "column"
                    justifyContent = "flex-end"
                    padding = "1rem"
                    backgroundColor = "gray.300"
                    height = "100%"
                    width = "100%"
                    overflowY = "hidden"
                    borderRadius = "lg"
                >
                    Messages
                </Box>
                </>
            ) : (
                <Box
                    display= "flex"
                    alignItems= "center"
                    justifyContent= "center"
                    height = "100%"
                >
                    <Text
                        fontSize = "xl"
                        padding= "1rem"
                        fontFamily = "monospace"
                        color = "gray.500"
                    >
                        Select a chat to start messaging
                    </Text>

                </Box>
            )}
        </>
    )
}

export default SingleChat;