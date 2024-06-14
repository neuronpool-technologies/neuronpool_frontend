import React from "react";
import {
  Box,
  VStack,
  useColorMode,
  Text,
  Flex,
  Spacer,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import { CheckCircleIcon, TimeIcon } from "@chakra-ui/icons";
import {
  lightBorderColor,
  darkBorderColor,
  darkGrayColor,
  lightGrayColor,
  lightGrayTextColor,
  darkGrayTextColor,
} from "../../../colors";
import Auth from "../../../components/Auth";

const ClaimBalance = () => {
  const { colorMode, toggleColorMode } = useColorMode();
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
            Withdrawals available
          </Text>
          <Flex gap={3} align="center">
          <Tooltip
              hasArrow
              label="Available withdrawals"
              aria-label="Available withdrawals tooltip"
            >
            <Flex align="center" gap={1.5}>
              <CheckCircleIcon color="green.500" />
              <Text fontWeight={500}>0</Text>
            </Flex>
            </Tooltip>
            <Divider
              orientation="vertical"
              h="20px"
              borderWidth="1px"
              borderColor={
                colorMode === "light" ? lightGrayTextColor : darkGrayTextColor
              }
            />
            <Tooltip
              hasArrow
              label="Pending withdrawals"
              aria-label="Pending withdrawals tooltip"
            >
              <Flex align="center" gap={1.5}>
                <TimeIcon color="orange.500" />
                <Text fontWeight={500}>0</Text>
              </Flex>
            </Tooltip>
          </Flex>
        </VStack>
        <Spacer />
        <Auth />
      </Flex>
    </Box>
  );
};

export default ClaimBalance;
