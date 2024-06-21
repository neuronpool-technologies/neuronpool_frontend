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
import { RewardPool } from "./components";

const Rewards = () => {
  return (
    <Container maxW="xl" my={5}>
      <RewardPool />
    </Container>
  );
};

export default Rewards;
