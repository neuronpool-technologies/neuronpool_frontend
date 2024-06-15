import React from "react";
import {
  Container,
  useColorMode,
  Heading,
  Box,
  Flex,
  VStack,
  Divider,
} from "@chakra-ui/react";
import {
  darkColorBox,
  lightColorBox,
  lightBorderColor,
  darkBorderColor,
} from "../../colors";
import Request from "./request/Request";
import Claim from "./claim/Claim";
import RequestBalance from "./request/RequestBalance";
import { useSelector } from "react-redux";
import RequestInfo from "./request/RequestInfo";

const Withdrawals = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const loggedIn = useSelector((state) => state.Profile.loggedIn);

  return (
    <Container maxW="xl" my={5}>
      {loggedIn ? <RequestBalance /> : null}
      <Box
        boxShadow="md"
        borderRadius="lg"
        p={3}
        mb={6}
        border={
          colorMode === "light"
            ? `solid ${lightBorderColor} 1px`
            : `solid ${darkBorderColor} 1px`
        }
        bg={colorMode === "light" ? lightColorBox : darkColorBox}
      >
        <Flex align="center" mb={3}>
          <Heading size={"md"} noOfLines={1}>
            Request
          </Heading>
        </Flex>
        <VStack spacing={3} align="start">
          <Divider />
          <Request />
          <RequestInfo />
        </VStack>
      </Box>
      {/* <Claim /> */}
    </Container>
  );
};

export default Withdrawals;
