import React, { useEffect } from "react";
import {
  Container,
  useColorMode,
  Heading,
  Box,
  Flex,
  VStack,
  Divider,
  Spacer,
  Button,
} from "@chakra-ui/react";
import {
  darkColorBox,
  lightColorBox,
  lightBorderColor,
  darkBorderColor,
} from "../../colors";
import { Claim, ClaimBalance } from "./claim";
import { Request, RequestBalance, RequestInfo } from "./request";
import { useSelector, useDispatch } from "react-redux";
import { WithdrawalFaq } from "../../components";
import { fetchWithdrawals } from "../../state/WithdrawalsSlice";
import Auth from "../../components/Auth";

const Withdrawals = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { logged_in } = useSelector((state) => state.Profile);
  const { neuronpool_withdrawal_neurons_information, status } = useSelector(
    (state) => state.Withdrawals
  );

  const dispatch = useDispatch();

  const fetchWithdrawalInfo = async () => {
    dispatch(fetchWithdrawals());
  };

  useEffect(() => {
    if (logged_in) {
      if (status === "idle" || status === "failed") {
        fetchWithdrawalInfo();
      }
    }
  }, [logged_in]);

  return (
    <Container maxW="xl" my={5}>
      {logged_in ? <RequestBalance /> : null}
      <Box
        boxShadow="md"
        borderRadius="lg"
        p={3}
        mb={6}
        border={
          colorMode === "light"
            ? `solid ${lightBorderColor} 1px`
            : `solid ${darkBorderColor} 1px`
        }
        bg={colorMode === "light" ? lightColorBox : darkColorBox}
      >
        <Flex align="center" mb={3}>
          <Heading size={"md"} noOfLines={1}>
            Request
          </Heading>
        </Flex>
        <VStack spacing={3} align="start">
          <Divider />
          <Request />
          <RequestInfo />
        </VStack>
      </Box>
      {logged_in ? (
        <ClaimBalance
          withdrawalNeuronsInfo={neuronpool_withdrawal_neurons_information}
        />
      ) : null}
      <Box
        boxShadow="md"
        borderRadius="lg"
        p={3}
        mb={6}
        border={
          colorMode === "light"
            ? `solid ${lightBorderColor} 1px`
            : `solid ${darkBorderColor} 1px`
        }
        bg={colorMode === "light" ? lightColorBox : darkColorBox}
      >
        <Flex align="center" mb={3}>
          <Heading size={"md"} noOfLines={1}>
            Claim
          </Heading>
          <Spacer />
        </Flex>
        <VStack spacing={3} align="start">
          <Divider />
          <Claim
            withdrawalNeuronsInfo={neuronpool_withdrawal_neurons_information}
            status={status}
          />
          {logged_in ? (
            <Button
              w="100%"
              rounded="full"
              boxShadow="base"
              isLoading={status === "loading"}
              onClick={fetchWithdrawalInfo}
            >
              Resync
            </Button>
          ) : (
            <Auth />
          )}
        </VStack>
      </Box>
      <WithdrawalFaq />
    </Container>
  );
};

export default Withdrawals;
