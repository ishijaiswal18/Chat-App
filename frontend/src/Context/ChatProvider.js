import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);

    const history = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if(userInfo){
            setUser(userInfo);
        } else {
            history("/");
        }
    }, [history]);

    const chatContextValue = useMemo(() => ({ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }), [user, setUser, selectedChat, setSelectedChat, chats, setChats]);

    return (
        <ChatContext.Provider value={chatContextValue}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;