import { FormControl, FormLabel, VStack, Input, InputGroup, InputRightElement, Button, useToast } from "@chakra-ui/react";
import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const Login = () => {

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingGuest, setLoadingGuest] = useState(false);

    const toast = useToast();
    const history = useNavigate();
    const handleClick = () => setShowPassword(!showPassword);



    const submitHandler = () => {
        setLoading(true);
        if(!email || !password){
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        axios.post("http://localhost:8000/api/user/login", {
            email: email,
            password: password,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },

        }
        ).then((res) => {
            console.log(res);
            localStorage.setItem("authToken", res.data.token);
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            history("/chats");
            setLoading(false);
        }
        ).catch((err) => {
            console.log(err);
            toast({
                title: "Invalid Credentials",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        });
    }

    const handleGuestLogin = () => {


        setLoadingGuest(true);
        axios.post("http://localhost:8000/api/user/login", {
            email: "guest@gmail.com",
            password: "guest"
        },
        {
            headers: {
                "Content-Type": "application/json",
            },

        }
        ).then((res) => {
            console.log(res);
            localStorage.setItem("authToken", res.data.token);
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            history("/chats");
            setLoadingGuest(false);
        }
        ).catch((err) => {
            console.log(err);
            toast({
                title: "Invalid Credentials",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            setLoadingGuest(false);
            
        });

    }



    return (
        <VStack
            spacing = {4}
            align = "stretch"
        >
        
        <FormControl id = "email-login" isRequired>
            <FormLabel>
                Email
            </FormLabel>
            <Input
                placeholder = "Email"
                onChange = {(e) => setEmail(e.target.value)}
                borderColor = "gray.500"
            />
        </FormControl>
        <FormControl id = "password-login" isRequired>
            <FormLabel>
                Password
            </FormLabel>
            <InputGroup>
            <Input
                type={showPassword?"text":"password"}
                placeholder = "Password"
                onChange = {(e) => setPassword(e.target.value)}
                borderColor = "gray.500"
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                {showPassword ? "Hide" : "Show"}
                </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        
        <Button
            colorScheme={"green"}
            type = "submit"
            width = "100%"
            style={{marginTop:15}}
            onClick={submitHandler}
            isLoading={loading}
        >
            Log In
        </Button>
        <Button
            bg={"red.400"}
            color={"white"}
            width = "100%"
            // hover 
            _hover={{
                bg: "red.500",
            }}  
            onClick={handleGuestLogin}
            isLoading = {loading}
        >
         Guest Login   

        </Button>


        </VStack>
    );
}

export default Login;