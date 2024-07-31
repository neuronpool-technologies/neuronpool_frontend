import React from "react";
import { useColorMode, Text } from "@chakra-ui/react";
import {
  darkGrayTextColor,
  lightGrayTextColor,
  lightBorderColor,
  darkBorderColor,
} from "../colors";

const ProcessTime = ({ estimate }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Text
      border={
        colorMode === "light"
          ? `solid ${lightBorderColor} 1px`
          : `solid ${darkBorderColor} 1px`
      }
      borderRadius="md"
      p={3}
      mb={3}
      textAlign="center"
      noOfLines={1}
      color={colorMode === "light" ? lightGrayTextColor : darkGrayTextColor}
      fontWeight={500}
    >
      This will take about {estimate}
    </Text>
  );
};

export default ProcessTime;
