import React from "react";
import {
  Flex,
  VStack,
  Text,
  useColorMode,
  Image as ChakraImage,
  Badge,
  Box,
} from "@chakra-ui/react";
import { darkGrayTextColor, lightGrayTextColor } from "../../../../colors";
import IcLogo from "../../../../../assets/ic-logo.png";
import {
  LockIcon,
  TimeIcon,
  CheckCircleIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
import {
  convertSecondsToDaysOrHours,
  e8sToIcp,
} from "../../../../tools/conversions";
import CollectReward from "./CollectReward";

const Collect = ({ unclaimedPrizeNeuronsInfo, status }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      {unclaimedPrizeNeuronsInfo.length > 0 ? (
        <VStack gap={3} w="100%">
          {unclaimedPrizeNeuronsInfo.map((neuron) => {
            return (
              <RewardNeuron
                key={neuron.id}
                state={neuron.state.toString()}
                id={neuron.id.toString()}
                timeLeftSeconds={neuron.dissolve_delay_seconds.toString()}
                stake={
                  Number(neuron.state) === 3
                    ? neuron.stake_e8s.toString()
                    : neuron.maturity_e8s_equivalent.toString()
                }
              />
            );
          })}
        </VStack>
      ) : null}
      {status !== "loading" && unclaimedPrizeNeuronsInfo.length === 0 ? (
        <Text
          py={8}
          w="100%"
          textAlign="center"
          fontWeight={500}
          color={colorMode === "light" ? lightGrayTextColor : darkGrayTextColor}
        >
          No rewards detected.
        </Text>
      ) : null}
      {status === "loading" && unclaimedPrizeNeuronsInfo.length === 0 ? (
        <Text
          py={8}
          w="100%"
          textAlign="center"
          fontWeight={500}
          color={colorMode === "light" ? lightGrayTextColor : darkGrayTextColor}
        >
          Checking for rewards...
        </Text>
      ) : null}
    </>
  );
};

export default Collect;

const RewardNeuron = ({ state, id, timeLeftSeconds, stake }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      align="center"
      p={3}
      w="100%"
      boxShadow="md"
      borderRadius="lg"
      color={state === "3" ? "green.500" : "orange.500"}
      border={"solid 1px"}
    >
      <Flex align="center" w="100%" mb={3}>
        <ChakraImage
          src={IcLogo}
          alt="ICP logo"
          bg={colorMode === "light" ? "#edf2f6" : "white"}
          borderRadius="full"
          p={1}
          h={45}
          mr={3}
          w={45}
        />
        <VStack align="start" spacing="1" w="100%">
          <Flex align="center" gap={2} w="100%">
            <Flex align="end" gap={0.5}>
              {state === "4" ? (
                <Text
                  noOfLines={1}
                  fontWeight={500}
                  fontSize="sm"
                  color={
                    colorMode === "light"
                      ? lightGrayTextColor
                      : darkGrayTextColor
                  }
                >
                  Est.
                </Text>
              ) : null}
              <Text
                noOfLines={1}
                fontWeight={500}
                color={colorMode === "light" ? "black" : "white"}
              >
                {e8sToIcp(Number(stake)).toFixed(2)} ICP
              </Text>
            </Flex>
            <Flex
              gap={1}
              align="center"
              color={state === "3" ? "green.500" : "orange.500"}
              fontSize={{ base: "xs", md: "sm" }}
            >
              {state === "1" ? <LockIcon /> : null}
              {state === "2" ? <TimeIcon /> : null}
              {state === "3" ? <CheckCircleIcon /> : null}
              {state === "4" ? <PlusSquareIcon /> : null}
              <Text>
                {state === "1" ? "Locked (Contact support)" : null}
                {state === "2" ? "Withdrawing" : null}
                {state === "3" ? "Available" : null}
                {state === "4" ? "Unlocking" : null}
                {Number(timeLeftSeconds) > 0
                  ? ` (${convertSecondsToDaysOrHours(Number(timeLeftSeconds))})`
                  : null}
              </Text>
            </Flex>
          </Flex>
          <Badge fontWeight="bold" fontSize={"sm"}>
            Id: {id}
          </Badge>
        </VStack>
      </Flex>
      <CollectReward state={state} id={id} stake={stake} />
    </Box>
  );
};
