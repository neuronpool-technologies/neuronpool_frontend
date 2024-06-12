import React from "react";
import { Box, VStack, useColorMode, Flex, Text } from "@chakra-ui/react";
import { darkColor, lightColor } from "../../colors";
import FaqItem from "./FaqItem";

const faqs = [
  {
    title: "What is a wallet?",
    body: "A wallet is used to store, manage, and transact with your cryptocurrency tokens. This wallet currently supports ICP tokens, which are necessary for staking in NeuronPool.",
  },
  {
    title: "What are ICP tokens?",
    body: "ICP tokens are utility tokens used within the Internet Computer Protocol (ICP) network. They serve various purposes, including staking.",
  },
  {
    title: "How do I get ICP tokens?",
    body: "You can purchase ICP tokens on most cryptocurrency exchanges, such as Coinbase. Once you have the tokens, you can send them to your NeuronPool ICP address.",
  },
];

const WalletFaq = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box>
      <Flex mt={6}>
        <Text
          fontWeight="bold"
          color={colorMode === "light" ? darkColor : lightColor}
        >
          Wallet FAQ
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

export default WalletFaq;
