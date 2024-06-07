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
import {
  darkColorBox,
  lightColorBox,
  lightBorderColor,
  darkBorderColor,
} from "../../colors";
import IcpStake from "./IcpStake";
import ProtocolStats from "./ProtocolStats";
import { StakeFaq } from "../../components/";
import StakerBalance from "./StakerBalance";

const Stake = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container maxW="xl" my={5}>
      <StakerBalance />
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
            Stake
          </Heading>
        </Flex>
        <VStack spacing={3} align="start">
          <Divider />
          <IcpStake />
          <Divider />
        </VStack>
      </Box>
      <ProtocolStats />
      <StakeFaq />
    </Container>
  );
};

export default Stake;
