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
  Tbody,
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

const PreviousWinners = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { reward_distributions } = useSelector((state) => state.History);

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
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th px={4}>Winner</Th>
              <Th px={4}>Amount</Th>
              <Th px={4}>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* {reversedHistory.map((pool) => {
                if (pool[0].token == "ICP") {
                  return (
                    <PoolTableModal
                      key={Number(pool[0].drawId)}
                      pool={pool[0]}
                    />
                  );
                }
              })} */}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PreviousWinners;
