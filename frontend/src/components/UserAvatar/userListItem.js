import React from 'react';
import {Box, Text, Avatar} from "@chakra-ui/react";

const UserListItem = ({user, handleFunction}) => {  
    const userInfo = user;

    return (
       <>
            <Box
                onClick = {handleFunction}
                display="flex"
                alignItems="center"
                cursor="pointer"
                _hover={{
                    backgroundColor: "teal.100",
                    color: "teal.900"
                }}

                bg = "gray.100"
                width = "100%"
                color = "gray.900"
                borderRadius = "lg"
                padding = "10px"
                margin = "5px"

            >
                <Avatar 
                    margin = "2px"
                    size="sm"
                    cursor = "pointer"
                    name={userInfo.name}
                    src={userInfo.picture ? userInfo.picture : "https://bit.ly/broken-link"}
                />
                
                <Box>
                    <Text fontSize="sm" fontWeight="bold" fontFamily="Work Sans">
                        {userInfo.name}
                    </Text>
                    <Text fontSize="xs" fontFamily="Work Sans">
                        <b>Email : </b>
                        {userInfo.email}
                    </Text>
                    
                </Box>

               

            </Box>
       </>
    );
}

export default UserListItem;