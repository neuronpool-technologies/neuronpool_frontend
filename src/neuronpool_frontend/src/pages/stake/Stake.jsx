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
import {
  IcpStake,
  ProtocolStats,
  StakerBalance,
  StakeInfo,
  Giveaway,
} from "./components";
import { StakeFaq } from "../../components/";
import { useSelector } from "react-redux";

const Stake = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const logged_in = useSelector((state) => state.Profile.logged_in);

  return (
    <Container maxW="xl" my={5}>
      {logged_in ? <StakerBalance /> : null}
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
          <StakeInfo />
        </VStack>
      </Box>
      <Giveaway />
      <ProtocolStats />
      <StakeFaq />
    </Container>
  );
};

export default Stake;
