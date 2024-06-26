import React, { useState } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Button,
  Image as ChakraImage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Divider,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  Stepper,
  useSteps,
  Box,
  useColorMode,
  Spinner,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import IcLogo from "../../../../assets/ic-logo.png";
import { e8sToIcp, icpToE8s } from "../../../tools/conversions";
import { useSelector, useDispatch } from "react-redux";
import { Auth, InfoRow } from "../../../components";
import {
  lightBorderColor,
  darkBorderColor,
  lightColorBox,
  darkColorBox,
} from "../../../colors";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import {
  startLedgerClient,
  startNeuronPoolClient,
} from "../../../client/Client";
import { Principal } from "@dfinity/principal";
import { fetchWallet } from "../../../state/ProfileSlice";
import StakingWarning from "./StakingWarning";
import { showToast } from "../../../tools/toast";

const steps = [{ description: "Approve ICP" }, { description: "Stake ICP" }];

const IcpStake = () => {
  const { icp_balance, logged_in, principal } = useSelector(
    (state) => state.Profile
  );
  const { icrc_identifier, minimum_stake } = useSelector(
    (state) => state.Protocol
  );
  const dispatch = useDispatch();

  const networkFeeE8s = 10_000;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [amount, setAmount] = useState("");
  const [staking, setStaking] = useState(false);
  const [staked, setStaked] = useState(false);
  const [failed, setFailed] = useState(false);

  const { colorMode, toggleColorMode } = useColorMode();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const stake = async () => {
    setStaking(true);
    const [neuronpool, ledger] = await Promise.all([
      startNeuronPoolClient(),
      startLedgerClient(),
    ]);

    try {
      // step 1 approve:
      await ledger.icrc2Approve({
        amount: icpToE8s(Number(amount)) - BigInt(networkFeeE8s),
        spender: {
          owner: Principal.fromText(icrc_identifier),
          subaccount: [],
        },
      });

      // if ok
      setActiveStep(1);

      // step 2 transfer icp to neuronpool:
      let stakeResult = await neuronpool.initiate_icp_stake_transfer();

      if ("err" in stakeResult) {
        dispatch(fetchWallet({ principal }));

        setStaking(false);
        setFailed(true);
        setStaked(true);
        console.error(stakeResult.err);

        showToast({
          title: "Error staking",
          description: stakeResult.err.toString(),
          status: "warning",
        });
      } else {
        // refresh balances
        dispatch(fetchWallet({ principal }));

        // if ok
        setActiveStep(2);

        setStaking(false);
        setStaked(true);
      }
    } catch (error) {
      dispatch(fetchWallet({ principal }));

      setStaking(false);
      setFailed(true);
      setStaked(true);
      console.error(error);

      showToast({
        title: "Error staking",
        description: error.toString(),
        status: "warning",
      });
    }
  };

  const closeModal = () => {
    setAmount("");
    setStaking(false);
    setStaked(false);
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
          isDisabled={staking}
          isInvalid={
            (amount !== "" &&
              icpToE8s(Number(amount)) <
                Number(minimum_stake) + networkFeeE8s * 2) ||
            (!staked && icpToE8s(Number(amount)) > Number(icp_balance))
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
            isDisabled={staking || !logged_in}
            onClick={() => {
              const newAmount = e8sToIcp(Number(icp_balance));
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
            onClick={onOpen}
            rounded="full"
            boxShadow="base"
            w="100%"
            colorScheme="blue"
            isDisabled={
              (!staked && Number(icp_balance) < Number(minimum_stake)) ||
              icpToE8s(Number(amount)) <
                Number(minimum_stake) + networkFeeE8s * 2 ||
              (!staked && icpToE8s(Number(amount)) > Number(icp_balance))
            }
          >
            Stake
          </Button>

          <Modal isOpen={isOpen} onClose={closeModal} isCentered z>
            <ModalOverlay />
            <ModalContent
              bg={colorMode === "light" ? lightColorBox : darkColorBox}
            >
              <ModalHeader align="center">Confirm stake</ModalHeader>
              {!staking ? <ModalCloseButton /> : null}
              <ModalBody>
                {staked && !failed ? (
                  <Fireworks autorun={{ speed: 3, duration: 3 }} />
                ) : null}
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
                                ) : staking ? (
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
                    title={"Stake amount"}
                    stat={`${Number(amount)} ICP`}
                  />
                  <Divider />
                  <InfoRow
                    title={"Network fee"}
                    stat={`${e8sToIcp(networkFeeE8s * 2)} ICP`}
                  />
                  <Divider />
                  <Box w="100%" color="green.500">
                    <InfoRow
                      title={"Amount after fee"}
                      stat={`${e8sToIcp(
                        Number(
                          icpToE8s(Number(amount)) - BigInt(networkFeeE8s * 2)
                        )
                      )} ICP`}
                    />
                  </Box>
                  <Divider />
                </VStack>
                <StakingWarning />
              </ModalBody>

              <ModalFooter>
                <Button
                  rounded="full"
                  boxShadow="base"
                  w="100%"
                  colorScheme="blue"
                  isLoading={staking}
                  onClick={staked ? closeModal : stake}
                >
                  {!staked ? "Confirm stake" : null}
                  {staked && !failed ? "Asset staked" : null}
                  {staked && failed ? "Staking failed" : null}
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

export default IcpStake;
