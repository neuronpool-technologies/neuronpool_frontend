import React from "react";
import { Box, VStack, useColorMode, Flex, Text } from "@chakra-ui/react";
import { darkColor, lightColor } from "../../colors";
import FaqItem from "./FaqItem";
import { useSelector } from "react-redux";
import {
  convertNanosecondsToDays,
  e8sToIcp,
  convertSecondsToDays,
} from "../../tools/conversions";

const StakeFaq = () => {
  const {
    minimum_stake,
    minimum_withdrawal,
    protocol_fee_percentage,
    reward_timer_duration_nanos,
    default_neuron_followee,
    main_neuron_dissolve_seconds,
  } = useSelector((state) => state.Protocol);

  const faqs = [
    {
      title: "What is NeuronPool?",
      body: `NeuronPool is a web3 application built and running on the Internet Computer Protocol (ICP). It allows users to pool their ICP, which is then staked in a neuron on the Network Nervous System (NNS). The staking rewards from this neuron are disbursed to one lucky winner every ${convertNanosecondsToDays(
        Number(reward_timer_duration_nanos)
      )} days. Instead of small incremental rewards, users have the chance to win a larger amount.`,
    },
    {
      title: "How does NeuronPool work?",
      body: `The NeuronPool smart contract (canister) controls an NNS neuron. Users can add to the stake of this neuron. The neuron votes on governance proposals and earns rewards. Using a timer, the canister checks for new staking rewards every ${convertNanosecondsToDays(
        Number(reward_timer_duration_nanos)
      )} days, selects a winner using a weighted selection algorithm (the higher your stake, the higher your chances of winning), and spawns the reward to them.`,
    },
    {
      title: "How do I stake?",
      body: `Add at least the minimum stake amount of ${e8sToIcp(
        Number(minimum_stake)
      )} ICP (plus the network fee of 0.0002 ICP) to your NeuronPool wallet by copying your ICP address or principal and sending ICP to it. Once you have enough ICP in your wallet, you can use the "Stake" button and confirm your stake.`,
    },
    {
      title: "How do I unstake?",
      body: `You need a minimum of ${e8sToIcp(
        Number(minimum_withdrawal)
      )} ICP to withdraw from NeuronPool. This is higher than the minimum stake of ${e8sToIcp(
        Number(minimum_stake)
      )} ICP. If you are below the minimum withdrawal amount, you can add more ICP and then withdraw by navigating to the "Withdrawals" page and following the steps. Withdrawals take a minimum of ${convertSecondsToDays(
        Number(main_neuron_dissolve_seconds)
      )} days to process.`,
    },
    {
      title: "Where do the rewards come from?",
      body: "The canister-controlled neuron votes on governance proposals on the NNS and earns ICP staking rewards for doing so. Therefore, the rewards come from the ICP network/NNS itself.",
    },
    {
      title: "What are the risks?",
      body: "There is a possibility of risks such as canister exploits, hacks, UI bugs, etc. No DeFi application is 100% safe, and users should do their own research (DYOR) when using any crypto app. It is our mission to maintain a high-performing and secure application. We mitigate risks by pursuing audits, open-sourcing the code for feedback, unit testing the canister code and end-to-end testing the UI.",
    },
    {
      title: "Are there any fees?",
      body: `There is a fee of ${protocol_fee_percentage}% on the spawned staking reward winnings only. The fee is not taken from anyone's staked amount, meaning users will retain their original staked amounts (minus any network fees).`,
    },
    {
      title: "What is the governance followee?",
      body: `The NeuronPool canister-controlled neuron is currently set to follow the neuron: ${default_neuron_followee}.`,
    },
  ];

  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box>
      <Flex mt={6}>
        <Text
          fontWeight="bold"
          color={colorMode === "light" ? darkColor : lightColor}
        >
          Stake FAQ
        </Text>
      </Flex>
      <VStack mt={3} gap={3}>
        {faqs.map(({ title, body }) => (
          <FaqItem key={title} title={title} body={body} />
        ))}
      </VStack>
    </Box>
  );
};

export default StakeFaq;
