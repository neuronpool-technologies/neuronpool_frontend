import React from "react";
import {
  Box,
  useColorMode,
  Flex,
  Text,
  VStack,
  Divider,
} from "@chakra-ui/react";
import {
  darkColorBox,
  lightColorBox,
  lightBorderColor,
  darkBorderColor,
  darkColor,
  lightColor,
} from "../../colors";
import { useSelector } from "react-redux";
import { e8sToIcp } from "../../tools/conversions";
import { InfoRow } from "../../components";

const ProtocolStats = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { total_stake_amount, total_stakers, icp_price_usd } = useSelector(
    (state) => state.Protocol
  );

  let tvl = Number(icp_price_usd * e8sToIcp(total_stake_amount)).toFixed(2);

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
            stat={total_stakers ? total_stakers : "--"}
          />
          <Divider />
          <InfoRow
            title={"Total staked"}
            stat={
              total_stake_amount
                ? `${e8sToIcp(Number(total_stake_amount)).toFixed(2)} ICP`
                : "--"
            }
          />
          <Divider />
          <InfoRow
            title={"Total value locked"}
            stat={total_stake_amount ? `$${tvl}` : "--"}
          />
        </VStack>
      </Box>
    </Box>
  );
};

export default ProtocolStats;
