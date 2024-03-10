import React, {useState} from "react";
import { SearchIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModel from "./profileModel";
import axios from "axios";
import ChatLoading from "./chatLoading";
import { Spinner } from "@chakra-ui/spinner";
import UserListItem from "../UserAvatar/userListItem.js"
import {
    Box,
    IconButton,
    Button,
    Menu,
    MenuButton,
    Tooltip,
    Text,
    Avatar,
    MenuList,
    MenuItem,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Input,
    useToast


} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import realSocketLogo from "../../images/LogoSample_ByTailorBrands (1)-removebg-preview.jpg";
import { Image } from "@chakra-ui/react";
import { isSameSender, isLastMessage, isSameUser, isSameSenderMargin, getSender} from "../../config/chatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";



const SideDrawer = () => {

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const userInfo = JSON.parse(user);


    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("authToken");
        window.location.reload();
    }

    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    const searchHandler = async () => {

        if(!search){
            toast ({
                title: "Please enter something to search",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top-left"
            });
            return;
        }
        try{
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setSearchResult(data);
            setLoading(false);

                

        }
        catch(error){
            toast ({
                title: "Something went wrong",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left"
            });
            setLoading(false);

        }
        return;
        

    }

    const accessChat = async (id) => {
       
        try{
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post(`/api/chat`, {
                "userId": id
            }, config);

            if(!chats.find(chat => chat._id === data._id)){
                setChats([...chats, data]);
            }

            
            setLoadingChat(false);
            setSelectedChat(data);
            onClose();
        }
        catch(error){
            toast ({
                title: "Something went wrong",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top-left"
            });
            setLoadingChat(false);
            
        }

    }



    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                padding="5px 10px 5px 10px"
                borderWidth="5px"
                bg="gray.100"
            >

                <Tooltip label="Search" fontSize="md" hasArrow placement="bottom-end">
                    <Button
                        onClick={onOpen}
                        aria-label="Search"
                        size="md"
                        variant="ghost"
                        colorScheme="teal"
                    >
                        <SearchIcon />

                        <Text display={{ base: "none", md: "flex" }} px="4">
                            Search User
                        </Text>
                    </Button>

                </Tooltip>

                <Box>
                    <Image src={realSocketLogo} alt="Real Socket Logo"width="120px" height="60px" mr = "2"/>

                    {/* <Text fontSize="2xl" color="teal" fontWeight="bold" fontFamily="Work Sans">
                
                
                        RealSocket
                    </Text> */}
                </Box>

                <div>
                    <Menu>
                        {/* <MenuButton as={IconButton} aria-label="Options" icon={<BellIcon fontSize="2x" margin="1px" />} variant="ghost" size="md" /> */}
                        <MenuButton p={1}>
                        <NotificationBadge
                            count={notification.length}
                            effect={Effect.SCALE}
                        />
                        <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList
                            pl = {2}
                        > 
                            {!notification.length && "No new messages"}
                            {notification.map((notif) => (
                                <MenuItem 
                                    key = {notif._id}
                                    onClick = {() => {
                                        setSelectedChat(notif.chat);
                                        setNotification(notification.filter((n) =>
                                            n !== notif
                                        ));
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`
                                    }
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} aria-label="Options" rightIcon={<ChevronDownIcon fontSize="2x" margin="1px" />} variant="ghost" size="md">
                            <Avatar
                                size="sm"
                                name={userInfo.name}
                                src={userInfo.picture ? userInfo.picture : "https://bit.ly/broken-link"}
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={userInfo} >
                                <MenuItem>
                                    My Profile
                                </MenuItem>
                            </ProfileModel>
                            <MenuItem onClick={logoutHandler}>
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>

                </div>

            </Box>

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                // finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader
                        borderBottomWidth='1px'
                    >
                        Search Users
                    </DrawerHeader>

                    <DrawerBody>
                        <Box
                            display="flex"
                            padding-bottom="2px"
                        >
                        <Input 
                            placeholder='Search by name or email'
                            onChange = {(e) => setSearch(e.target.value)}
                            value = {search}
                            onKeyPress = {(e) => e.key === 'Enter' ? searchHandler() : null}
                        />
                        <Button
                            colorScheme='teal'
                            onClick = {
                                searchHandler
                            }
                        >
                            Search
                        </Button>
                        </Box>
                        
                        {
                        loading ? ( 
                            <ChatLoading />
                        ) : (
                            <span> 
                                {searchResult.map((res) => (
                                    <UserListItem 
                                        key={res._id}
                                        user = {res}
                                        handleFunction = {() => accessChat(res._id)}
                                    />  
                                    
                                ))}

                            </span>
                        )}
                    </DrawerBody>
                    {loadingChat && <Spinner display = "flex" margin = "auto" size="xl" /> }
                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}


export default SideDrawer;