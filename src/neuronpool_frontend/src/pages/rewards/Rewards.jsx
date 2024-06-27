import React, { useEffect } from "react";
import { Container, useColorMode } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { RewardPool } from "./components";
import { fetchRewardNeurons } from "../../state/RewardSlice";

const Rewards = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { logged_in } = useSelector((state) => state.Profile);
  const { unclaimed_prize_neurons, status } = useSelector(
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
      <RewardPool />
    </Container>
  );
};

export default Rewards;
