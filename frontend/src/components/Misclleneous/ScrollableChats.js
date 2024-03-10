import React from "react";
import { Avatar, Box, Tooltip } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import { isSameSender, isLastMessage, isSameUser, isSameSenderMargin } from "../../config/chatLogics";
import { ChatState } from "../../Context/ChatProvider";


const ScrollableChats = ({messages}) => {
    const { user } = ChatState();
    const userInfo = JSON.parse(user) ;

    console.log("user", userInfo._id)
    console.log("messages", messages)

    return (
        <ScrollableFeed>
            {messages && messages.map((message, index) => (  

               <div
                    style={{
                        display: "flex",
                        justifyContent:
                                userInfo._id === message.sender._id
                                    ? "flex-end" // Align right for current user's messages
                                    : "flex-start", // Align left for other users' messages
                        marginBottom: "0.5rem",
                    }}
                    key = {message._id}
                >
                    {console.log(isSameSender(messages, message, index, userInfo._id))}
                    {
                        (isSameSender(messages, message, index, userInfo._id)
                            || isLastMessage(messages, index, userInfo._id))
                                && (
                                    <Tooltip
                                        label = {message.sender.name}
                                        placement="bottom-start"
                                        // fontSize = "md"
                                        hasArrow  
                                    >
                                        <Avatar 
                                            src = {message.sender.picture}
                                            size = "sm"
                                            name = {message.sender.name}
                                            // margin = "0.5rem"
                                            cursor= "pointer"
                                            mt = "7px"
                                            ml = {1}

                                        />
                                    </Tooltip>
                                )
                    }
                   <span 
                        // log message.sender._id and mesaage.context
                        


                      style={{
                            // log message.sender._id and mesaage.context 


                            backgroundColor: userInfo._id === message.sender._id ? "blue" : "gray",
                            color: userInfo._id === message.sender._id ? "white" : "black",
                            // padding: "0.5rem",
                            // borderRadius: "1rem",
                            borderRadius:"20px",
                            maxWidth: "75%",
                            padding : "5px 15px",
                            marginLeft: isSameSenderMargin(messages, message, index, userInfo._id),
                            // marginTop: isSameUser(messages, message, index) ? "0.5rem" : "1rem",
                            marginTop : isSameUser(messages, message, index) ? "3" : "10",
                        }}

                    >
                        
                        {message.context}
                    </span>


                </div>
            ))    
            }
        </ScrollableFeed>
    )
}

export default ScrollableChats;
