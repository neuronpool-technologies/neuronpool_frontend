import React from "react";
import { useColorMode, Flex, Text, Spacer } from "@chakra-ui/react";
import { lightGrayTextColor, darkGrayTextColor } from "../colors";

const InfoRow = ({ title, stat, children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Flex w="100%" gap={1} align="center">
        <Text
          noOfLines={1}
          fontWeight={500}
          color={colorMode === "light" ? lightGrayTextColor : darkGrayTextColor}
        >
          {title}
        </Text>
        {children}
        <Spacer />
        <Text noOfLines={1} fontWeight={500}>
          {stat}
        </Text>
      </Flex>
    </>
  );
};

export default InfoRow;
