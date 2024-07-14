import React, { useEffect } from "react";
import {
  Container,
  useColorMode,
  Heading,
  Box,
  Flex,
  VStack,
  Divider,
  Spinner,
  Spacer,
} from "@chakra-ui/react";
import {
  darkColorBox,
  lightColorBox,
  lightBorderColor,
  darkBorderColor,
} from "../../colors";
import { useSelector, useDispatch } from "react-redux";
import { fetchRewardNeurons } from "../../state/RewardSlice";
import { RewardPool, PreviousWinners } from "./components";
import { Collect, CollectInfo, CollectBalance } from "./components/collect";
import { RewardsFaq } from "../../components";

const Rewards = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { logged_in } = useSelector((state) => state.Profile);
  const { unclaimed_prize_neurons_information, status } = useSelector(
    (state) => state.Reward
  );

  const dispatch = useDispatch();

  const fetchRewards = async () => {
    if (status === "idle" || status === "failed") {
      dispatch(fetchRewardNeurons());
    }
  };

  useEffect(() => {
    if (logged_in) {
      fetchRewards();
    }
  }, [logged_in]);

  return (
    <Container maxW="xl" my={5}>
      {logged_in ? (
        <CollectBalance
          unclaimedPrizeNeuronsInfo={unclaimed_prize_neurons_information}
        />
      ) : null}
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
            Collect
          </Heading>
          <Spacer />
          {status === "loading" ? <Spinner size="sm" /> : null}
        </Flex>
        <VStack spacing={3} align="start">
          <Divider />
          <Collect
            unclaimedPrizeNeuronsInfo={unclaimed_prize_neurons_information}
            status={status}
          />
        </VStack>
      </Box>
      <RewardPool />
      <PreviousWinners />
      <RewardsFaq />
    </Container>
  );
};

export default Rewards;
