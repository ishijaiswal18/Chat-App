import { FormControl, FormLabel, VStack, Input, InputGroup, InputRightElement, Button, useToast } from "@chakra-ui/react";
import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const SignUp = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [picture, setPicture] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useNavigate();

    const handleClick = () => setShowPassword(!showPassword);
    const handleClickConfirm = () => setShowConfirmPassword(!showConfirmPassword);

    const postDetails = (picture) => {
        setLoading(true);
        if (!picture) {
           toast({
                title: "Please select an image",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            return;

        }
        if(picture.type === "image/jpeg" || picture.type === "image/png"){
            const data = new FormData();
            data.append("file", picture);
            data.append("upload_preset", "chat app");
            data.append("cloud_name", "dpy5rtk4o");
            fetch("https://api.cloudinary.com/v1_1/dpy5rtk4o/image/upload", {
                
                method: "post",
                body: data,
            }).then((res) => 
                res.json()
            )
            .then((data) => {
                console.log(data);
                setPicture(data.url.toString());
                console.log(data.url.toString());
                setLoading(false);
            })
        }
        else{
            toast({
                title: "Please select an image file (jpeg or png)",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        
    }

    const submitHandler = async () => {
        setLoading(true);

        if (!username || !email || !password || !confirmPassword) {
            toast({
                title: "Please fill in all fields",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try{

            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const {data} = await axios.post(
                "http://localhost:8000/api/user",
                {
                    name:username,
                    email:email,
                    password:password,
                    picture:picture,
                },
                config
            );


            toast({
                title: "Account created successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            localStorage.setItem("authToken", data.token);
            setLoading(false);

            history("/chats");
        } catch (error) {
            console.log(error);
            toast({
                title: error,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    }


    return (
        <VStack
            spacing = {4}
            align = "stretch"
        >
        <FormControl id = "username" isRequired>
            <FormLabel>
                Username
            </FormLabel>
            <Input 
                placeholder = "Username"
                onChange = {(e) => setUsername(e.target.value)}
                borderColor = "gray.500"
            />
        </FormControl>
        <FormControl id = "email" isRequired>
            <FormLabel>
                Email
            </FormLabel>
            <Input
                placeholder = "Email"
                onChange = {(e) => setEmail(e.target.value)}
                borderColor = "gray.500"
            />
        </FormControl>
        <FormControl id = "password" isRequired>
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
        <FormControl id = "confirmPassword" isRequired>
            <FormLabel>
                Confirm Password
            </FormLabel>
            <InputGroup>
            <Input
                type={showConfirmPassword?"text":"password"}
                placeholder = "Confirm Password"
                onChange = {(e) => setConfirmPassword(e.target.value)}
                borderColor = "gray.500"
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClickConfirm}>
                {showConfirmPassword ? "Hide" : "Show"}
                </Button>
            </InputRightElement>
            </InputGroup>

        </FormControl>
        <FormControl id = "picture">
            <FormLabel>
                Profile Picture
            </FormLabel>
            <Input
                type = "file"
                p = {1.5}
                accept = "image/*"
                placeholder = "Profile Picture"
                onChange = {(e) => postDetails(e.target.files[0])}
                borderColor = "gray.500"
            />
        </FormControl>
        <Button
            colorScheme={"green"}
            type = "submit"
            width = "100%"
            style={{marginTop:15}}
            onClick={submitHandler}
            isLoading = {loading}
        >
            Sign Up
        </Button>

        </VStack>
    );
}

export default SignUp;