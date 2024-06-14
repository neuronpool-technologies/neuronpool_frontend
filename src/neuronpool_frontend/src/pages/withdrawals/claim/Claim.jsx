import React from "react";
import {
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
} from "../../../colors";
import ClaimBalance from "./ClaimBalance";
import { useSelector } from "react-redux";
import ClaimWithdrawals from "./ClaimWithdrawals";

const Claim = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const loggedIn = useSelector((state) => state.Profile.loggedIn);

  return (
    <>
      {loggedIn ? <ClaimBalance /> : null}
      <Box
        boxShadow="md"
        borderRadius="lg"
        p={3}
        border={
          colorMode === "light"
            ? `solid ${lightBorderColor} 1px`
            : `solid ${darkBorderColor} 1px`
        }
        bg={colorMode === "light" ? lightColorBox : darkColorBox}
      >
        <Flex align="center" mb={3}>
          <Heading size={"md"} noOfLines={1}>
            Claim
          </Heading>
        </Flex>
        <VStack spacing={3} align="start">
          <Divider />
          <ClaimWithdrawals />
        </VStack>
      </Box>
    </>
  );
};

export default Claim;
