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
import { darkGrayTextColor, lightGrayTextColor } from "../../../colors";
import IcLogo from "../../../../assets/ic-logo.png";
import {
  LockIcon,
  TimeIcon,
  CheckCircleIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
import {
  convertSecondsToDaysOrHours,
  e8sToIcp,
} from "../../../tools/conversions";
import ClaimWithdrawal from "./ClaimWithdrawal";

const Claim = ({ withdrawalNeuronsInfo, status }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      {withdrawalNeuronsInfo.length > 0 ? (
        <VStack gap={3} w="100%">
          {withdrawalNeuronsInfo.map((neuron) => {
            if (neuron.stake_e8s > 0) {
              return (
                <WithdrawalNeuron
                  key={neuron.id}
                  state={neuron.state.toString()}
                  id={neuron.id.toString()}
                  timeLeftSeconds={neuron.dissolve_delay_seconds.toString()}
                  stake={neuron.stake_e8s.toString()}
                />
              );
            }
          })}
        </VStack>
      ) : null}
      {status !== "loading" && withdrawalNeuronsInfo.length === 0 ? (
        <Text
          py={8}
          w="100%"
          textAlign="center"
          fontWeight={500}
          color={colorMode === "light" ? lightGrayTextColor : darkGrayTextColor}
        >
          No withdrawal requests detected.
        </Text>
      ) : null}
      {status === "loading" ? (
        <Text
          py={8}
          w="100%"
          textAlign="center"
          fontWeight={500}
          color={colorMode === "light" ? lightGrayTextColor : darkGrayTextColor}
        >
          Checking for withdrawal requests...
        </Text>
      ) : null}
    </>
  );
};

export default Claim;

const WithdrawalNeuron = ({ state, id, timeLeftSeconds, stake }) => {
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
            <Text
              noOfLines={1}
              fontWeight={500}
              color={colorMode === "light" ? "black" : "white"}
            >
              {e8sToIcp(Number(stake))} ICP
            </Text>
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
                {state === "4" ? "Spawning" : null}
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
      <ClaimWithdrawal state={state} id={id} stake={stake} />
    </Box>
  );
};
