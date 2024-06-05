import React from "react";
import {
  Box,
  Heading,
  Divider,
  VStack,
  useColorMode,
  Flex,
  Container,
} from "@chakra-ui/react";
import IcpWallet from "./IcpWallet";
import {
  darkColorBox,
  lightColorBox,
  lightBorderColor,
  darkBorderColor,
} from "../../colors";
import { WalletFaq } from "../../components";

const Wallet = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container maxW="xl" my={5}>
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
            Wallet
          </Heading>
        </Flex>
        <VStack spacing={3} align="start">
          <Divider />
          <IcpWallet />
          <Divider />
        </VStack>
      </Box>
      <WalletFaq />
    </Container>
  );
};

export default Wallet;
