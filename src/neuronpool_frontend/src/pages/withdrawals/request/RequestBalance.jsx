import React from "react";
import {
  Box,
  VStack,
  useColorMode,
  Text,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import {
  lightBorderColor,
  darkBorderColor,
  darkGrayColor,
  lightGrayColor,
  lightGrayTextColor,
  darkGrayTextColor,
} from "../../../colors";
import { useSelector } from "react-redux";
import { e8sToIcp } from "../../../tools/conversions";
import { Auth}  from "../../../components/";

const RequestBalance = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const stakedBalance = useSelector(
    (state) => state.Profile.neuronpool_balance
  );
  return (
    <Box
      boxShadow="md"
      borderTopRadius="lg"
      p={3}
      mb={-1}
      borderRight={
        colorMode === "light"
          ? `solid ${lightBorderColor} 1px`
          : `solid ${darkBorderColor} 1px`
      }
      borderLeft={
        colorMode === "light"
          ? `solid ${lightBorderColor} 1px`
          : `solid ${darkBorderColor} 1px`
      }
      borderTop={
        colorMode === "light"
          ? `solid ${lightBorderColor} 1px`
          : `solid ${darkBorderColor} 1px`
      }
      bg={colorMode === "light" ? lightGrayColor : darkGrayColor}
    >
      <Flex align="center">
        <VStack align="start">
          <Text
            fontSize="sm"
            fontWeight={500}
            color={
              colorMode === "light" ? lightGrayTextColor : darkGrayTextColor
            }
          >
            Staked amount
          </Text>
          <Flex align="center" gap={1}>
            <Text fontWeight={500}>
              {Number(e8sToIcp(stakedBalance)).toFixed(4)}
            </Text>
            <Text
              fontWeight={500}
              color={
                colorMode === "light" ? lightGrayTextColor : darkGrayTextColor
              }
            >
              ICP
            </Text>
          </Flex>
        </VStack>
        <Spacer />
        <Auth />
      </Flex>
    </Box>
  );
};

export default RequestBalance;
