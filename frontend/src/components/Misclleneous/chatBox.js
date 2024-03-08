import React from "react";
import { Box, Text, Avatar } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import SingleChat from "./singleChat";
import { useState } from "react";

const ChatBox = ({fetchAgain, setFetchAgain}) => {

    const { user, chats, selectedChat } = ChatState();

    return (
        <>
        <Box
            display= {{base: selectedChat ? "flex" : "none", md: "flex"}}
            flexDirection = "column"
            alignItems="center"
            padding = "1rem"
            bg = "gray.100"
            width = {{base: "100%", md: "64%"}}
            borderRadius = "lg"
            borderWidth="1px"
            margin = "0 0.2rem 0.5rem 0.2rem"
        >

            <SingleChat 
                fetchAgain = {fetchAgain}
                setFetchAgain={setFetchAgain}
            />
        </Box>
        </>
    )
}

export default ChatBox;