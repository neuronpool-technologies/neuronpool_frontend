import React from "react";
import {
  Box,
  useColorMode,
  Flex,
  Text,
  VStack,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import {
  darkColorBox,
  lightColorBox,
  lightBorderColor,
  darkBorderColor,
  darkColor,
  lightColor,
} from "../../../colors";
import { useSelector } from "react-redux";
import { e8sToIcp } from "../../../tools/conversions";
import { InfoRow } from "../../../components";

const ProtocolStats = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const protocolInfo = useSelector((state) => state.Protocol);
  const historyInfo = useSelector((state) => state.History);

  const totalRewards = historyInfo.reward_distributions.reduce(
    (
      accum,
      {
        action: {
          SpawnReward: { maturity_e8s },
        },
      }
    ) => {
      return accum + Number(maturity_e8s);
    },
    0
  );

  return (
    <Box>
      <Flex mt={6}>
        <Text
          fontWeight="bold"
          color={colorMode === "light" ? darkColor : lightColor}
        >
          NeuronPool statistics
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
            title={"Stakers"}
            stat={
              protocolInfo.status === "succeeded" ? (
                protocolInfo.total_stakers
              ) : (
                <Spinner size="sm" />
              )
            }
          />
          <Divider />
          <InfoRow
            title={"Total staked"}
            stat={
              protocolInfo.status === "succeeded" ? (
                `${e8sToIcp(Number(protocolInfo.total_stake_amount)).toFixed(
                  2
                )} ICP`
              ) : (
                <Spinner size="sm" />
              )
            }
          />
          <Divider />
          <InfoRow
            title={"Rewards won"}
            stat={
              historyInfo.status === "succeeded" ? (
                `${e8sToIcp(Number(totalRewards)).toFixed(2)} ICP`
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

export default ProtocolStats;
