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
import IcLogo from "../../../assets/ic-logo.png";
import { e8sToIcp, icpToE8s } from "../../tools/conversions";
import { useSelector, useDispatch } from "react-redux";
import Auth from "../../components/Auth";
import InfoRow from "../../components/InfoRow";
import {
  lightBorderColor,
  darkBorderColor,
  lightColorBox,
  darkColorBox,
} from "../../colors";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { startLedgerClient, startNeuronPoolClient } from "../../client/Client";
import { Principal } from "@dfinity/principal";
import { InitProfile } from "../../tools/InitProfile";
import { setWallet } from "../../state/LoginSlice";

const steps = [{ description: "Approve ICP" }, { description: "Stake ICP" }];

const IcpStake = () => {
  const icpBalance = useSelector((state) => state.Profile.icp_balance);
  const loggedIn = useSelector((state) => state.Profile.loggedIn);
  const principal = useSelector((state) => state.Profile.principal);
  const minimumStake = useSelector((state) => state.Protocol.minimum_stake);
  const dispatch = useDispatch();

  const networkFeeE8s = 20_000;

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
        amount: icpToE8s(Number(amount)),
        spender: {
          owner: Principal.fromText(
            process.env.REACT_APP_NEURONPOOL_CANISTER_ID
          ),
          subaccount: [],
        },
      });
      // if ok
      setActiveStep(1);

      // step 2 transfer icp to neuronpool:
      let stakeResult = await neuronpool.initiate_icp_stake_transfer();

      if ("err" in stakeResult) {
        const profile = await InitProfile({
          principal: principal,
        });

        dispatch(setWallet(profile));

        setStaking(false);
        setFailed(true);
        setStaked(true);
        console.error(stakeResult);
      } else {
        // refresh balances
        const profile = await InitProfile({
          principal: principal,
        });

        dispatch(setWallet(profile));

        // if ok
        setActiveStep(2);

        setStaking(false);
        setStaked(true);
      }
    } catch (error) {
      const profile = await InitProfile({
        principal: principal,
      });

      dispatch(setWallet(profile));

      setStaking(false);
      setFailed(true);
      setStaked(true);
      console.error(error);
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
            (amount !== "" && icpToE8s(Number(amount)) <= 10000) ||
            icpToE8s(Number(amount)) > Number(icpBalance)
          }
          type="number"
          onChange={(event) => setAmount(event.target.value)}
        />
        <InputRightElement width="4.5rem" h="100%">
          <Button
            _hover={{ opacity: "0.8" }}
            h="1.75rem"
            size="sm"
            isDisabled={staking || !loggedIn}
            onClick={() => {
              const newAmount = e8sToIcp(Number(icpBalance));
              setAmount(newAmount || "");
            }}
          >
            Max
          </Button>
        </InputRightElement>
      </InputGroup>
      {loggedIn ? (
        <>
          <Button
            onClick={onOpen}
            w="100%"
            colorScheme="blue"
            isDisabled={
              (!staked && Number(icpBalance) < Number(minimumStake)) ||
              icpToE8s(Number(amount)) < Number(minimumStake) + networkFeeE8s ||
              (!staked && icpToE8s(Number(amount)) > Number(icpBalance))
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
              <ModalCloseButton />
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
        <Auth large />
      )}
    </>
  );
};

export default IcpStake;
