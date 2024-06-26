import React, { useState, useEffect } from "react";
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
  darkGrayColorBox,
  lightGrayColorBox,
  lightGrayTextColor,
  darkGrayTextColor,
} from "../../../colors";
import Auth from "../../../components/Auth";

const ClaimBalance = ({ withdrawalNeuronsInfo, status }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const [pendingNeurons, setPendingNeurons] = useState(null);
  const [readyNeurons, setReadyNeurons] = useState(null);

  const getMyWithdrawals = () => {
    if (withdrawalNeuronsInfo.length > 0) {
      let pending = 0;
      let ready = 0;
      for (let { state, cached_neuron_stake_e8s } of withdrawalNeuronsInfo) {
        // we need to ignore already claimed neurons
        if (cached_neuron_stake_e8s > 0) {
          if (state === 3) {
            ready++;
          } else {
            // this means if the dissolve request failed it will show in pending as well
            pending++;
          }
        }
      }

      setPendingNeurons(pending);
      setReadyNeurons(ready);
    }
  };

  useEffect(() => {
    getMyWithdrawals();
  }, [withdrawalNeuronsInfo]);

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
      <Flex align="center">
        <VStack align="start">
          <Text
            fontSize="sm"
            fontWeight={500}
            color={
              colorMode === "light" ? lightGrayTextColor : darkGrayTextColor
            }
          >
            My withdrawals
          </Text>
          <Flex gap={3} align="center">
            <Tooltip
              hasArrow
              label="Available withdrawals"
              aria-label="Available withdrawals tooltip"
            >
              <Flex align="center" gap={1.5}>
                <CheckCircleIcon color="green.500" />
                <Text fontWeight={500}>
                  {readyNeurons !== null ? readyNeurons : "--"}
                </Text>
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
                <Text fontWeight={500}>
                  {pendingNeurons !== null ? pendingNeurons : "--"}
                </Text>
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
