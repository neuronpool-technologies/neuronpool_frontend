import React from "react";
import {
  Box,
  VStack,
  useColorMode,
  Flex,
  Text,
  Accordion,
} from "@chakra-ui/react";
import { darkColor, lightColor } from "../../colors";
import FaqItem from "./FaqItem";
import { useSelector } from "react-redux";
import { e8sToIcp, convertSecondsToDays } from "../../tools/conversions";

const WithdrawalFaq = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { minimum_withdrawal, main_neuron_dissolve_seconds } = useSelector(
    (state) => state.Protocol
  );

  const faqs = [
    {
      title: "What are withdrawals?",
      body: "Users can unstake their ICP tokens by requesting a withdrawal and later claiming it in the withdrawals section of the NeuronPool dApp. The withdrawal process consists of two steps: first, initiate the withdrawal request, and second, claim the tokens once the withdrawal duration has passed.",
    },
    {
      title: "How do I withdraw?",
      body: `To initiate a withdrawal, enter an amount above the minimum withdrawal of ${e8sToIcp(
        Number(minimum_withdrawal)
      )} ICP in the 'Request' section and use the 'Request withdrawal' button to confirm. After the withdrawal duration of ${convertSecondsToDays(
        Number(main_neuron_dissolve_seconds)
      )} days has passed, you can claim your withdrawal amount from the 'Claim' section.`,
    },
    {
      title: "What are withdrawal requests?",
      body: "Withdrawing your staked ICP tokens from NeuronPool requires a two-step process. The first step is the withdrawal request, which initiates the unlocking of your staked ICP tokens to make them liquid again.",
    },
    {
      title: "What are withdrawal claims?",
      body: `The second step in withdrawing your staked ICP tokens from NeuronPool is the claim. Once the withdrawal request has been processed and the withdrawal duration of ${convertSecondsToDays(
        Number(main_neuron_dissolve_seconds)
      )} days has passed, you can claim your ICP tokens.`,
    },
    {
      title: "How long does it take to withdraw?",
      body: `Withdrawals take ${convertSecondsToDays(
        Number(main_neuron_dissolve_seconds)
      )} days to process. Users can monitor the countdown and see how many days/hours are left for their withdrawal in the 'Claim' section.`,
    },
    {
      title: "Can I win rewards while withdrawing?",
      body: "If you still have an amount of ICP staked with NeuronPool, for example, you had 10 ICP staked and initiated a withdrawal request for 8 ICP, the 2 ICP left will still provide you a chance to win rewards. The amount you have begun withdrawing will no longer be considered for future rewards.",
    },
    {
      title: "Is there a withdrawal fee?",
      body: "NeuronPool does not charge a withdrawal fee other than the ICP network fee of 0.0001 ICP.",
    },
  ];
  return (
    <Box>
      <Flex mt={6}>
        <Text
          fontWeight="bold"
          color={colorMode === "light" ? darkColor : lightColor}
        >
          Withdrawal FAQ
        </Text>
      </Flex>
      <Accordion defaultIndex={[0]} mt={3} w="100%" allowMultiple reduceMotion>
        <VStack gap={3}>
          {faqs.map(({ title, body }) => (
            <FaqItem key={title} title={title} body={body} />
          ))}
        </VStack>
      </Accordion>
    </Box>
  );
};

export default WithdrawalFaq;
