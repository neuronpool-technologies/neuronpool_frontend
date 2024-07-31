import React, { useState, useEffect } from "react";
import {
  Button,
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
  Text,
  Flex,
} from "@chakra-ui/react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import {
  darkColorBox,
  lightColorBox,
  lightBorderColor,
  darkBorderColor,
  darkColor,
  lightColor,
} from "../../../colors";
import { InfoRow, ProcessTime } from "../../../components";
import { WarningIcon } from "@chakra-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import Auth from "../../../components/Auth";
import {
  startGiveawayClient,
  startLedgerClient,
  startNeuronPoolClient,
} from "../../../client/Client";
import { e8sToIcp } from "../../../tools/conversions";
import { fetchWallet } from "../../../state/ProfileSlice";
import { showToast } from "../../../tools/toast";
import { Principal } from "@dfinity/principal";
import { fetchProtocolInformation } from "../../../state/ProtocolSlice";

const steps = [
  { description: "Verify claim" },
  { description: "Process bonus" },
];

// we are not using stable state here as this component will be removed shortly after launch and all icp is claimed
const Giveaway = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const { logged_in, principal } = useSelector((state) => state.Profile);
  const { icrc_identifier } = useSelector((state) => state.Protocol);

  const networkFeeE8s = 10_000;

  const dispatch = useDispatch();

  // stats state
  const [loading, setLoading] = useState(false);
  const [giveawayInfo, setGiveawayInfo] = useState({});
  const [eligibility, setEligibility] = useState(false);

  // claim state
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [failed, setFailed] = useState(false);

  const fetchGiveawayInfo = async () => {
    setLoading(true);
    const giveaway = await startGiveawayClient();

    const [elig, { bonus_amount, claims_left, total_claims }] =
      await Promise.all([
        await giveaway.check_eligibility(),
        await giveaway.get_giveaway_information(),
      ]);

    setEligibility(elig);
    setGiveawayInfo({ bonus_amount, claims_left, total_claims });

    setLoading(false);
  };

  const claim = async () => {
    setClaiming(true);
    const [neuronpool, giveaway, ledger] = await Promise.all([
      startNeuronPoolClient(),
      startGiveawayClient(),
      startLedgerClient(),
    ]);

    try {
      // step 1 claim:
      let claimResult = await giveaway.claim_giveaway({
        secret: process.env.REACT_APP_GIVEAWAY_SECRET,
      });

      if ("err" in claimResult) {
        dispatch(fetchWallet({ principal }));

        setClaiming(false);
        setClaimed(true);
        setFailed(true);
        console.error(claimResult.err);

        showToast({
          title: "Error claiming bonus",
          description: claimResult.err.toString(),
          status: "warning",
        });
      } else {
        await ledger.icrc2Approve({
          amount: BigInt(giveawayInfo.bonus_amount) + BigInt(networkFeeE8s), // approve 0.1001 ICP
          spender: {
            owner: Principal.fromText(icrc_identifier),
            subaccount: [],
          },
        });

        setActiveStep(1);

        // step 2 transfer icp to neuronpool:
        let stakeResult = await neuronpool.initiate_icp_stake_transfer();
        if ("err" in stakeResult) {
          dispatch(fetchWallet({ principal }));

          setClaiming(false);
          setFailed(true);
          setClaimed(true);
          console.error(stakeResult.err);

          showToast({
            title: "Error claiming bonus",
            description: stakeResult.err.toString(),
            status: "warning",
          });
        } else {
          // refresh balances
          dispatch(fetchWallet({ principal }));
          dispatch(fetchProtocolInformation());

          // if ok
          setActiveStep(2);

          setClaiming(false);
          setClaimed(true);
          // at the end:
          setEligibility("ineligible");
        }
      }
    } catch (error) {
      dispatch(fetchWallet({ principal }));

      setClaiming(false);
      setClaimed(true);
      setFailed(true);
      console.error(error);

      showToast({
        title: "Error claiming bonus",
        description: error.toString(),
        status: "warning",
      });
    }
  };

  useEffect(() => {
    fetchGiveawayInfo();
  }, [logged_in]);

  const closeModal = () => {
    setActiveStep(0);
    setClaiming(false);
    setClaimed(false);
    setFailed(false);
    onClose();
    fetchGiveawayInfo();
  };

  return (
    <Box>
      <Flex mt={6}>
        <Text
          fontWeight="bold"
          color={colorMode === "light" ? darkColor : lightColor}
        >
          Claim your free stake bonus
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
            title={"Bonus amount"}
            stat={
              loading ? (
                <Spinner size="sm" />
              ) : (
                `${e8sToIcp(Number(giveawayInfo.bonus_amount))} ICP`
              )
            }
          />
          <Divider />
          <InfoRow
            title={"Total claimed"}
            stat={
              loading ? (
                <Spinner size="sm" />
              ) : (
                Number(giveawayInfo.total_claims).toString()
              )
            }
          />
          <Divider />
          <InfoRow
            title={"Claims left"}
            stat={
              loading ? (
                <Spinner size="sm" />
              ) : (
                Number(giveawayInfo.claims_left).toString()
              )
            }
          />
        </VStack>
        {logged_in ? (
          <>
            <Button
              w="100%"
              rounded="full"
              boxShadow="base"
              colorScheme="blue"
              mt={3}
              isDisabled={
                eligibility !== "eligible" ||
                Number(giveawayInfo.claims_left) === 0
              }
              isLoading={loading}
              onClick={onOpen}
            >
              {eligibility === "eligible" ? "Claim bonus" : "Bonus claimed"}
            </Button>

            <Modal isOpen={isOpen} onClose={closeModal} isCentered>
              <ModalOverlay />
              <ModalContent
                bg={colorMode === "light" ? lightColorBox : darkColorBox}
              >
                <ModalHeader align="center">Confirm bonus</ModalHeader>
                {!claiming ? <ModalCloseButton /> : null}
                <ModalBody>
                  {claimed && !failed ? (
                    <Fireworks autorun={{ speed: 3, duration: 3 }} />
                  ) : null}
                  <ProcessTime estimate={"1 min"} />
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
                                  ) : claiming ? (
                                    <Spinner size="sm" />
                                  ) : (
                                    <StepNumber />
                                  )
                                }
                              />
                            </StepIndicator>
                            <StepDescription>
                              {step.description}
                            </StepDescription>
                          </VStack>
                          <StepSeparator />
                        </Step>
                      ))}
                    </Stepper>
                  </Box>
                  <VStack align="start" p={3} gap={3}>
                    <Box w="100%" color="green.500">
                      <InfoRow
                        title={"Stake bonus amount"}
                        stat={`${e8sToIcp(
                          Number(giveawayInfo.bonus_amount)
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
                    isLoading={claiming}
                    onClick={claimed ? closeModal : claim}
                  >
                    {!claimed ? "Confirm bonus" : null}
                    {claimed && !failed ? "Bonus claimed" : null}
                    {claimed && failed ? "claim failed" : null}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        ) : (
          <Auth />
        )}
      </Box>
    </Box>
  );
};

export default Giveaway;
