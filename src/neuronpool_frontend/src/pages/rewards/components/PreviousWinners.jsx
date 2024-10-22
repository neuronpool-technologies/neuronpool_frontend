import React, { useState } from "react";
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
  Button,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
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
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;

  // reverse to show last first in a shallow copy
  const reversedRewards = [...reward_distributions].reverse();

  const rewardsToShow = reversedRewards.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );
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
                px={3}
                color={
                  colorMode === "light" ? lightGrayTextColor : darkGrayTextColor
                }
                fontWeight={500}
                fontSize="md"
                textTransform="none"
                letterSpacing="none"
                textAlign="start"
              >
                Winner
              </Th>
              <Th
                px={3}
                color={
                  colorMode === "light" ? lightGrayTextColor : darkGrayTextColor
                }
                fontWeight={500}
                fontSize="md"
                textTransform="none"
                letterSpacing="none"
                textAlign="start"
              >
                Date
              </Th>
              <Th
                px={3}
                color={
                  colorMode === "light" ? lightGrayTextColor : darkGrayTextColor
                }
                fontWeight={500}
                fontSize="md"
                textTransform="none"
                letterSpacing="none"
                textAlign="end"
              >
                Amount
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {rewardsToShow.map((reward) => {
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
        <Flex w="100%" align="center" justify="center" gap={3}>
          <Button
            aria-label="Previous page"
            leftIcon={<ChevronLeftIcon />}
            rounded="full"
            boxShadow="base"
            w="100%"
            isDisabled={!page}
            onClick={() =>
              setPage((prevPage) => {
                return prevPage - 1;
              })
            }
          >
            Prev
          </Button>
          <Button
            aria-label="Previous page"
            rightIcon={<ChevronRightIcon />}
            rounded="full"
            boxShadow="base"
            w="100%"
            isDisabled={
              page * itemsPerPage + itemsPerPage >= reversedRewards.length
            }
            onClick={() =>
              setPage((prevPage) => {
                return prevPage + 1;
              })
            }
          >
            Next
          </Button>
        </Flex>
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
        <Td px={3} textAlign="start">
          {winner.substring(0, 5) +
            "..." +
            winner.substring(winner.length - 3, winner.length)}
        </Td>
        <Td px={3} textAlign="start">
          {convertNanoToFormattedDate(Number(timestamp))}
        </Td>
        <Td px={3} textAlign="end">
          {e8sToIcp(Number(amount)).toFixed(2)} ICP
        </Td>
      </Tr>
    </>
  );
};
