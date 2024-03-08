import {React} from 'react';
import { ChatState } from '../../Context/ChatProvider';
import SideDrawer from '../Misclleneous/sideDrawer';
import MyChats from '../Misclleneous/myChats';
import ChatBox from '../Misclleneous/chatBox';
import { Box } from '@chakra-ui/react';
import { useState } from 'react';

function Chats() {

    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);
    return <div style = {{width : "100%"}}> 
        {user && <SideDrawer/>}

        <Box 
            display = "flex" 
            flexDirection = "row" 
            justifyContent = "space-between" 
            width = "100%" 
            height = "91.5vh"
            p = "10px"
            overflow = "hidden"
        >

            {user && <MyChats
                        fetchAgain = {fetchAgain}
                        
                    />}
            {user && <ChatBox
                        fetchAgain = {fetchAgain}
                        setFetchAgain = {setFetchAgain}
                    />}

        

        </Box>
    </div>
}


export default Chats;