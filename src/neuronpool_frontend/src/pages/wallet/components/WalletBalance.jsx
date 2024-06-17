import React from "react";
import {
  Box,
  Divider,
  VStack,
  useColorMode,
  Text,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import {
  lightBorderColor,
  darkBorderColor,
  darkGrayColorBox,
  lightGrayColorBox,
  lightGrayTextColor,
  darkGrayTextColor,
} from "../../../colors";
import { useSelector } from "react-redux";
import { e8sToIcp } from "../../../tools/conversions";
import { Auth } from "../../../components";

const WalletBalance = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const icpBalance = useSelector((state) => state.Profile.icp_balance);
  const stakedBalance = useSelector(
    (state) => state.Profile.neuronpool_balance
  );
  return (
    <Box
      boxShadow="md"
      borderTopRadius="lg"
      p={3}
      mb={-1}
      border={
        colorMode === "light"
          ? `solid ${lightBorderColor} 1px`
          : `solid ${darkBorderColor} 1px`
      }
      bg={colorMode === "light" ? lightGrayColorBox : darkGrayColorBox}
    >
      <Flex mb={3} align="center">
        <VStack align="start">
          <Text
            fontSize="sm"
            fontWeight={500}
            color={
              colorMode === "light" ? lightGrayTextColor : darkGrayTextColor
            }
          >
            Wallet balance
          </Text>
          <Flex align="center" gap={1}>
            <Text fontWeight={500}>
              {Number(e8sToIcp(icpBalance)).toFixed(4)}
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
      <Divider />
      <VStack align="start" mt={3}>
        <Text
          fontSize="sm"
          fontWeight={500}
          color={colorMode === "light" ? lightGrayTextColor : darkGrayTextColor}
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
    </Box>
  );
};

export default WalletBalance;
