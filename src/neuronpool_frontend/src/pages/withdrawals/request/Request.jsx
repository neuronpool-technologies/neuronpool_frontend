import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchWallet } from "../../../state/ProfileSlice";
import {
  Button,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Image as ChakraImage,
  useDisclosure,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Step,
  VStack,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepDescription,
  StepSeparator,
  Stepper,
  Spinner,
  Divider,
  Box,
  useSteps,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import {
  lightBorderColor,
  darkBorderColor,
  lightColorBox,
  darkColorBox,
} from "../../../colors";
import { Auth } from "../../../components";
import IcLogo from "../../../../assets/ic-logo.png";
import { e8sToIcp, icpToE8s } from "../../../tools/conversions";
import { InfoRow } from "../../../components";
import { startNeuronPoolClient } from "../../../client/Client";
import { InitWallet } from "../../../client/data/InitWallet";

const steps = [
  { description: "Request ICP" },
  { description: "Start withdrawal" },
];

const Request = () => {
  const { logged_in, neuronpool_balance, principal } = useSelector(
    (state) => state.Profile
  );
  const { minimum_withdrawal } = useSelector((state) => state.Protocol);
  const dispatch = useDispatch();
  const networkFeeE8s = 10_000;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [amount, setAmount] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);
  const [failed, setFailed] = useState(false);

  const request = async () => {
    setRequesting(true);
    const neuronpool = await startNeuronPoolClient();

    try {
      // step 1 request ICP:
      let withdrawalResult = await neuronpool.initiate_icp_stake_withdrawal({
        amount_e8s: icpToE8s(Number(amount)),
      });

      // check the withdrawal result
      if ("err" in withdrawalResult) {
        dispatch(fetchWallet({ principal }));

        setRequesting(false);
        setFailed(true);
        setRequested(true);
        console.error(withdrawalResult);
      } else {
        // if ok
        setActiveStep(1);
        // step 2 dissolve ICP
        const { neuronpool_withdrawal_neurons } = await InitWallet({
          principal,
        });

        // get the last ID added
        const latestId =
          neuronpool_withdrawal_neurons[
            neuronpool_withdrawal_neurons.length - 1
          ];

        // start dissolving
        let dissolveResult = await neuronpool.process_icp_stake_dissolve({
          neuronId: BigInt(latestId),
        });

        // check the dissolve result
        if ("err" in dissolveResult) {
          dispatch(fetchWallet({ principal }));

          setRequesting(false);
          setFailed(true);
          setRequested(true);
          console.error(dissolveResult);
        } else {
          dispatch(fetchWallet({ principal }));
          // if ok
          setActiveStep(2);

          setRequesting(false);
          setRequested(true);
        }
      }
      // catch network errors
    } catch (error) {
      dispatch(fetchWallet({ principal }));

      setRequesting(false);
      setFailed(true);
      setRequested(true);
      console.error(error);
    }
  };

  const closeModal = () => {
    setAmount("");
    setRequesting(false);
    setRequested(false);
    setFailed(false);
    setActiveStep(0);
    onClose();
  };

  return (
    <>
      <InputGroup>
        <InputLeftElement pointerEvents="none" h="100%">
          <ChakraImage
            src={IcLogo}
            alt="Internet identity logo"
            h={"20px"}
            w={"auto"}
          />
        </InputLeftElement>
        <Input
          pl={10}
          placeholder="ICP amount"
          size="lg"
          value={amount}
          isDisabled={requesting}
          isInvalid={
            (amount !== "" &&
              icpToE8s(Number(amount)) <
                Number(minimum_withdrawal) + networkFeeE8s) ||
            icpToE8s(Number(amount)) > Number(neuronpool_balance)
          }
          type="number"
          onChange={(event) => setAmount(event.target.value)}
        />
        <InputRightElement width="4.5rem" h="100%">
          <Button
            rounded="full"
            boxShadow="base"
            _hover={{ opacity: "0.8" }}
            h="1.75rem"
            size="sm"
            isDisabled={requesting || !logged_in}
            onClick={() => {
              const newAmount = e8sToIcp(Number(neuronpool_balance));
              setAmount(newAmount || "");
            }}
          >
            Max
          </Button>
        </InputRightElement>
      </InputGroup>
      {logged_in ? (
        <>
          <Button
            rounded="full"
            boxShadow="base"
            onClick={onOpen}
            w="100%"
            colorScheme="blue"
            isDisabled={
              (!requested &&
                Number(neuronpool_balance) < Number(minimum_withdrawal)) ||
              icpToE8s(Number(amount)) <
                Number(minimum_withdrawal) + networkFeeE8s ||
              (!requested &&
                icpToE8s(Number(amount)) > Number(neuronpool_balance))
            }
          >
            Request withdrawal
          </Button>

          <Modal isOpen={isOpen} onClose={closeModal} isCentered>
            <ModalOverlay />
            <ModalContent
              bg={colorMode === "light" ? lightColorBox : darkColorBox}
            >
              <ModalHeader align="center">Confirm request</ModalHeader>
              {!requesting ? <ModalCloseButton /> : null}
              <ModalBody>
                <Box
                  border={
                    colorMode === "light"
                      ? `solid ${lightBorderColor} 1px`
                      : `solid ${darkBorderColor} 1px`
                  }
                  borderRadius="md"
                  p={3}
                  mb={3}
                >
                  <Stepper index={activeStep}>
                    {steps.map((step, index) => (
                      <Step key={index}>
                        <VStack align="center" gap={1}>
                          <StepIndicator>
                            <StepStatus
                              complete={<StepIcon />}
                              incomplete={<StepNumber />}
                              active={
                                failed ? (
                                  <WarningIcon color="red.500" />
                                ) : requesting ? (
                                  <Spinner size="sm" />
                                ) : (
                                  <StepNumber />
                                )
                              }
                            />
                          </StepIndicator>
                          <StepDescription>{step.description}</StepDescription>
                        </VStack>

                        <StepSeparator />
                      </Step>
                    ))}
                  </Stepper>
                </Box>
                <VStack align="start" p={3} gap={3}>
                  <InfoRow
                    title={"Request amount"}
                    stat={`${Number(amount)} ICP`}
                  />
                  <Divider />
                  <InfoRow
                    title={"Network fee"}
                    stat={`${e8sToIcp(networkFeeE8s)} ICP`}
                  />
                  <Divider />
                  <Box w="100%" color="green.500">
                    <InfoRow
                      title={"Amount after fee"}
                      stat={`${e8sToIcp(
                        Number(icpToE8s(Number(amount)) - BigInt(networkFeeE8s))
                      )} ICP`}
                    />
                  </Box>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button
                  rounded="full"
                  boxShadow="base"
                  w="100%"
                  colorScheme="blue"
                  isLoading={requesting}
                  onClick={requested ? closeModal : request}
                >
                  {!requested ? "Confirm request" : null}
                  {requested && !failed ? "Request completed" : null}
                  {requested && failed ? "Request failed" : null}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default Request;
