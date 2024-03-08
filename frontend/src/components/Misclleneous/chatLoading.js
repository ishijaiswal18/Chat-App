import React from 'react';
import {Stack, Text, Box, Image, useToast} from "@chakra-ui/react";
import {Skeleton} from "@chakra-ui/skeleton";

const ChatLoading = () => {

    return (
        <Stack
            direction="column"
            height="100%"
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            padding="10px"
        >
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
            <Skeleton height="45px"/>
        </Stack>
    )
}

export default ChatLoading;
