import React from "react";
import {
  Box,
  useColorMode,
  Flex,
  Text,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
} from "@chakra-ui/react";
import {
  darkColor,
  darkColorBox,
  lightColor,
  lightColorBox,
  lightBorderColor,
  darkBorderColor,
  lightGrayTextColor,
  darkGrayTextColor,
} from "../../../colors";
import { useSelector } from "react-redux";
import {
  convertNanoToFormattedDate,
  e8sToIcp,
} from "../../../tools/conversions";

const PreviousWinners = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { reward_distributions } = useSelector((state) => state.History);

  // reverse to show last first in a shallow copy
  const reversedRewards = [...reward_distributions].reverse();
  return (
    <Box>
      <Flex mt={6}>
        <Text
          fontWeight="bold"
          color={colorMode === "light" ? darkColor : lightColor}
        >
          Previous winners
        </Text>
      </Flex>

      <TableContainer
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
        <Table variant="unstyled">
          <Thead>
            <Tr>
              <Th
                px={4}
                color={
                  colorMode === "light" ? lightGrayTextColor : darkGrayTextColor
                }
                fontWeight={500}
                fontSize="md"
                textTransform="none"
                letterSpacing="none"
              >
                Winner
              </Th>
              <Th
                px={4}
                color={
                  colorMode === "light" ? lightGrayTextColor : darkGrayTextColor
                }
                fontWeight={500}
                fontSize="md"
                textTransform="none"
                letterSpacing="none"
              >
                Date
              </Th>
              <Th
                px={4}
                color={
                  colorMode === "light" ? lightGrayTextColor : darkGrayTextColor
                }
                fontWeight={500}
                fontSize="md"
                textTransform="none"
                letterSpacing="none"
              >
                Amount
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {reversedRewards.map((reward) => {
              return (
                <WinnerTableItem
                  key={reward.timestamp_nanos}
                  winner={reward.action.SpawnReward.winner}
                  timestamp={reward.timestamp_nanos}
                  amount={reward.action.SpawnReward.maturity_e8s}
                />
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PreviousWinners;

const WinnerTableItem = ({ winner, timestamp, amount }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Tr
        fontWeight={500}
        borderTop={
          colorMode === "light" ? `solid #edf2f5 1px` : `solid #414951 1px`
        }
      >
        <Td px={4}>
          {winner.substring(0, 5) +
            "..." +
            winner.substring(winner.length - 3, winner.length)}
        </Td>
        <Td px={4}>{convertNanoToFormattedDate(Number(timestamp))}</Td>
        <Td px={4}>{e8sToIcp(Number(amount)).toFixed(2)} ICP</Td>
      </Tr>
    </>
  );
};
