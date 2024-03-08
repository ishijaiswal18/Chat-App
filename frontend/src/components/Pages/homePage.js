import {React} from 'react';
import {Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel} from '@chakra-ui/react';
import SignUp from '../Authentication/signup';
import Login from '../Authentication/login';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Home() {

    const history = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("authToken");
        if(user){
            history("/chats");
        }
    }, [history]);



    return (
        <Container maxW = "xl" centerContent>
            <Box 
                d = "flex" 
                justifyContent="center"
                p = {3}
                bg = {"gray.100"}
                w = "100%"
                textAlign={"center"}
                m = "40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="gray.200"
                >
                <Text
                    fontSize = "2xl"
                    fontFamily="Work Sans"
                    color = "gray.700"
                >
                    Welcome to the home page!
                </Text>
            </Box>
            <Box
                bg = {"gray.100"}
                w = "100%"
                p = {3}
                m = "15px 0 40px 0"
                borderRadius="lg"
                borderWidth="1px"
                color = "gray.700"
            >
            <Tabs variant='soft-rounded' colorScheme='green'>
            <TabList>
                <Tab width="50%">Log In</Tab>
                <Tab width="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Login />
                </TabPanel>
                <TabPanel>
                    <SignUp />
                </TabPanel>
            </TabPanels>
            </Tabs>
            </Box>
        </Container>
    );
}

export default Home;