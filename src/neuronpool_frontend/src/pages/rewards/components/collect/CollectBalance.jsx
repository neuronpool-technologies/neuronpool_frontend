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
} from "../../../../colors";
import Auth from "../../../../components/Auth";
import { useSelector } from "react-redux";

const CollectBalance = ({ unclaimedPrizeNeuronsInfo }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const stakedBalance = useSelector(
    (state) => state.Profile.neuronpool_balance
  );
  const totalStakeDeposits = useSelector((state) => state.Protocol.total_stake_deposits);

  const [pendingNeurons, setPendingNeurons] = useState(null);
  const [readyNeurons, setReadyNeurons] = useState(null);

  const getMyRewards = () => {
    if (unclaimedPrizeNeuronsInfo.length > 0) {
      let pending = 0;
      let ready = 0;
      for (let { state } of unclaimedPrizeNeuronsInfo) {
        if (Number(state) === 3) {
          ready++;
        } else {
          pending++;
        }
      }
      setPendingNeurons(pending);
      setReadyNeurons(ready);
    }
  };

  useEffect(() => {
    getMyRewards();
  }, [unclaimedPrizeNeuronsInfo]);

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
      <Flex align="center" mb={3}>
        <VStack align="start">
          <Text
            fontSize="sm"
            fontWeight={500}
            color={
              colorMode === "light" ? lightGrayTextColor : darkGrayTextColor
            }
          >
            Winning chance
          </Text>
          <Flex align="center" gap={1}>
            <Text fontWeight={500}>
              {stakedBalance
                ? ((stakedBalance / totalStakeDeposits) * 100).toFixed(2)
                : "0.00"}
              %
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
          My rewards
        </Text>
        <Flex gap={3} align="center">
          <Tooltip
            hasArrow
            label="Available rewards"
            aria-label="Available rewards tooltip"
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
            label="Pending rewards"
            aria-label="Pending rewards tooltip"
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
    </Box>
  );
};

export default CollectBalance;
