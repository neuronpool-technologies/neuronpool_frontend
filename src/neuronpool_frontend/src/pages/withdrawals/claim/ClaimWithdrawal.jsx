import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  useDisclosure,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Divider,
  Box,
  Center,
  Icon,
} from "@chakra-ui/react";
import { WarningIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { lightColorBox, darkColorBox } from "../../../colors";
import { e8sToIcp } from "../../../tools/conversions";
import { InfoRow } from "../../../components";
import { startNeuronPoolClient } from "../../../client/Client";
import { showToast } from "../../../tools/toast";
import { fetchWithdrawals } from "../../../state/WithdrawalsSlice";
import { fetchWallet } from "../../../state/ProfileSlice";

const ClaimWithdrawal = ({ state, id, stake }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { principal } = useSelector((state) => state.Profile);

  const networkFeeE8s = 10_000;
  const dispatch = useDispatch();

  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [failed, setFailed] = useState(false);

  const claim = async () => {
    setClaiming(true);
    const neuronpool = await startNeuronPoolClient();

    try {
      let claimResult = await neuronpool.process_icp_stake_disburse({
        neuronId: BigInt(id),
      });

      if ("err" in claimResult) {
        dispatch(fetchWithdrawals());

        setClaiming(false);
        setFailed(true);
        setClaimed(true);
        console.error(claimResult.err);

        showToast({
          title: "Error claiming withdrawal",
          description: claimResult.err.toString(),
          status: "warning",
        });
      } else {
        // success
        dispatch(fetchWallet({ principal }));
        dispatch(fetchWithdrawals());

        setClaiming(false);
        setClaimed(true);
      }
    } catch (error) {
      dispatch(fetchWithdrawals());

      setClaiming(false);
      setFailed(true);
      setClaimed(true);
      console.error(error);

      showToast({
        title: "Error claiming withdrawal",
        description: error.toString(),
        status: "warning",
      });
    }
  };

  const closeModal = () => {
    setClaiming(false);
    setClaimed(false);
    setFailed(false);
    onClose();
  };

  return (
    <>
      <Button
        rounded="full"
        boxShadow="base"
        onClick={onOpen}
        w="100%"
        isDisabled={state !== "3"}
      >
        Claim withdrawal
      </Button>

      <Modal isOpen={isOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent bg={colorMode === "light" ? lightColorBox : darkColorBox}>
          <ModalHeader align="center">Claim withdrawal</ModalHeader>
          {!claiming ? <ModalCloseButton /> : null}
          <ModalBody>
            {!claimed ? (
              <VStack align="start" p={3} gap={3}>
                <InfoRow title={"ID"} stat={id} />
                <Divider />
                <InfoRow
                  title={"Claim amount"}
                  stat={`${e8sToIcp(Number(stake)).toFixed(4)} ICP`}
                />
                <Divider />
                <InfoRow
                  title={"Network fee"}
                  stat={`${e8sToIcp(networkFeeE8s).toFixed(4)} ICP`}
                />
                <Divider />
                <Box w="100%" color="green.500">
                  <InfoRow
                    title={"Amount after fee"}
                    stat={`${e8sToIcp(
                      Number(BigInt(stake) - BigInt(networkFeeE8s))
                    ).toFixed(4)} ICP`}
                  />
                </Box>
              </VStack>
            ) : null}
            {claimed && !failed ? (
              <Center>
                <Icon as={CheckCircleIcon} boxSize={100} />
              </Center>
            ) : null}
            {claimed && failed ? (
              <Center>
                <Icon as={WarningIcon} boxSize={100} />
              </Center>
            ) : null}
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
              {!claimed ? "Confirm claim" : null}
              {claimed && !failed ? "Claim completed" : null}
              {claimed && failed ? "Claim failed" : null}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ClaimWithdrawal;
