import React from "react";
import {Box} from "@chakra-ui/react";
// import Box from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserListItem = ({user, handleFunction}) => {

    return (
         <>
         <Box
                onClick = {handleFunction}
                padding = "0.5rem"
                borderRadius="lg"
                margin= "0.4rem"
                margin-bottom = "1rem"
                variant="solid"
                fontSize="sm"
                bg = "pink.100"
                color = "pink.900"
                cursor = "pointer"
                display="flex"
                alignItems="center"
                _hover={{
                    backgroundColor: "pink.400",
                    color: "pink.900"
                }}

                


         >
            {user.name}
            <CloseIcon
                margin-left = "5rem"
                cursor = "pointer"
                padding-left = "1rem"
                

            />
         </Box>
      
        </>
    );
}

export default UserListItem;