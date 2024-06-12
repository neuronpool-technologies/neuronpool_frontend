import React from "react";
import { Box, VStack, useColorMode, Flex, Text } from "@chakra-ui/react";
import { darkColor, lightColor } from "../../colors";
import FaqItem from "./FaqItem";

{
  /* TODO add these to the FAQ */
}
{
  /* <StatRow title={"Minimum stake"} stat={""} />
          <StatRow title={"Minimum withdrawal"} stat={""} />
          <StatRow title={"Protocol fee"} stat={""} />
          <StatRow title={"Withdrawal time"} stat={""} />
          <StatRow title={"Governance followee"} stat={""} />
          <StatRow title={"Reward spawn time"} stat={""} /> */
}

const faqs = [
  {
    title: "",
    body: "",
  },
];

const StakeFaq = () => {
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
