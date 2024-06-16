import React from "react";
import {
  Container,
  useColorMode,
  Heading,
  Box,
  Flex,
  VStack,
  Divider,
} from "@chakra-ui/react";
import {
  darkColorBox,
  lightColorBox,
  lightBorderColor,
  darkBorderColor,
} from "../../colors";
import { Claim, ClaimBalance, ClaimWithdrawal } from "./claim";
import { Request, RequestBalance, RequestInfo } from "./request";
import { useSelector } from "react-redux";
import { WithdrawalFaq } from "../../components";

const Withdrawals = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const loggedIn = useSelector((state) => state.Profile.loggedIn);

  // TODO fetch the status of all the neurons withdrawing using a Promise.all
  // TODO pass this data into the ClaimBalance and the Claim withdrawal

  // TODO we need to access the neurons information such as how many days left and how long till spawn
  // TODO this will also allow us to have the ready and pending indicator
  // const fetchWithdrawalNeuronsStatus = async () => {
  //   const neuronpool = await startNeuronPoolClient();

  //   if (neuronpool_withdrawal_neurons.length > 0) {
  //     const neuronPromises = neuronpool_withdrawal_neurons.map((id) =>
  //       neuronpool.get_neuron_information(BigInt(id))
  //     );

  //     const neuronResults = await Promise.all(neuronPromises);
  //   }
  // };

  // useEffect(() => {
  //   fetchWithdrawalNeuronsStatus();
  // }, []);

  return (
    <Container maxW="xl" my={5}>
      {loggedIn ? <RequestBalance /> : null}
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
      {loggedIn ? <ClaimBalance /> : null}
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
        </Flex>
        <VStack spacing={3} align="start">
          <Divider />
          <Claim />
          <ClaimWithdrawal />
        </VStack>
      </Box>
      <WithdrawalFaq />
    </Container>
  );
};

export default Withdrawals;
