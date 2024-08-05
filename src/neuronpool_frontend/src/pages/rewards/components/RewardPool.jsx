import React from "react";
import {
  VStack,
  Divider,
  Box,
  useColorMode,
  Flex,
  Text,
  Spinner,
} from "@chakra-ui/react";
import {
  darkColor,
  darkColorBox,
  lightColor,
  lightColorBox,
  lightBorderColor,
  darkBorderColor,
} from "../../../colors";
import { useSelector } from "react-redux";
import { InfoRow } from "../../../components";
import {
  convertNanoToFormattedDate,
  e8sToIcp,
} from "../../../tools/conversions";

const RewardPool = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { maturity_e8s_equivalent } = useSelector((state) => state.Neuron);
  const neuronStatus = useSelector((state) => state.Neuron.status);
  const { reward_distributions } = useSelector((state) => state.History);
  const historyStatus = useSelector((state) => state.History.status);
  const { reward_timer_duration_nanos } = useSelector(
    (state) => state.Protocol
  );

  const lastDistribution =
    reward_distributions.length > 0
      ? reward_distributions[reward_distributions.length - 1]
      : 0;

  return (
    <Box>
      <Flex mt={6}>
        <Text
          fontWeight="bold"
          color={colorMode === "light" ? darkColor : lightColor}
        >
          Reward pool
        </Text>
      </Flex>
      <Box
        boxShadow="md"
        borderRadius="lg"
        p={3}
        mt={3}
        border={
          colorMode === "light"
            ? `solid ${lightBorderColor} 1px`
            : `solid ${darkBorderColor} 1px`
        }
        bg={colorMode === "light" ? lightColorBox : darkColorBox}
      >
        <VStack align="start" p={3} gap={3}>
          <InfoRow
            title={"Est. Reward pool"}
            stat={
              neuronStatus === "succeeded" ? (
                `${e8sToIcp(Number(maturity_e8s_equivalent)).toFixed(2)} ICP`
              ) : (
                <Spinner size="sm" />
              )
            }
          />
          <Divider />
          <InfoRow
            title={"Next distribution"}
            stat={
              historyStatus === "succeeded" ? (
                lastDistribution ? (
                  convertNanoToFormattedDate(
                    Number(lastDistribution.timestamp_nanos) +
                      Number(reward_timer_duration_nanos),
                    "MMM Do, ha"
                  )
                ) : (
                  "--/--/--"
                )
              ) : (
                <Spinner size="sm" />
              )
            }
          />
        </VStack>
      </Box>
    </Box>
  );
};

export default RewardPool;
