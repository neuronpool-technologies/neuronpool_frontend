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
import { lightColorBox, darkColorBox } from "../../../../colors";
import { e8sToIcp } from "../../../../tools/conversions";
import { InfoRow, ProcessTime } from "../../../../components";
import { startNeuronPoolClient } from "../../../../client/Client";
import { showToast } from "../../../../tools/toast";
import { fetchWallet } from "../../../../state/ProfileSlice";
import { fetchRewardNeurons } from "../../../../state/RewardSlice";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

const CollectReward = ({ state, id, stake }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { principal } = useSelector((state) => state.Profile);
  const { protocol_fee_percentage } = useSelector((state) => state.Protocol);

  const networkFeeE8s = 10_000;
  const neuronPoolFee = Math.round(
    (Number(stake) * Number(protocol_fee_percentage)) / 100
  );

  const neuronPoolAndBlockchainFee = neuronPoolFee + networkFeeE8s;

  const dispatch = useDispatch();

  const [collecting, setCollecting] = useState(false);
  const [collected, setCollected] = useState(false);
  const [failed, setFailed] = useState(false);

  const collect = async () => {
    setCollecting(true);
    const neuronpool = await startNeuronPoolClient();

    try {
      let collectResult = await neuronpool.process_icp_prize_disburse({
        neuronId: BigInt(id),
      });

      if ("err" in collectResult) {
        setCollecting(false);
        setFailed(true);
        setCollected(true);
        console.error(collectResult.err);

        showToast({
          title: "Error collecting reward",
          description: collectResult.err.toString(),
          status: "warning",
        });
      } else {
        // success
        setCollecting(false);
        setCollected(true);
      }
    } catch (error) {
      setCollecting(false);
      setFailed(true);
      setCollected(true);
      console.error(error);

      showToast({
        title: "Error collecting reward",
        description: error.toString(),
        status: "warning",
      });
    }
  };

  const closeModal = () => {
    // because the reward neuron fetch is instant if no neurons left,
    // it's best to update after user has closed the modal
    // otherwise the popup will remove from the UI
    dispatch(fetchWallet({ principal }));
    dispatch(fetchRewardNeurons());

    setCollecting(false);
    setCollected(false);
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
        colorScheme="blue"
      >
        Collect reward
      </Button>

      <Modal isOpen={isOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent bg={colorMode === "light" ? lightColorBox : darkColorBox}>
          <ModalHeader align="center">Collect reward</ModalHeader>
          {!collecting ? <ModalCloseButton /> : null}
          <ModalBody>
            {collected && !failed ? (
              <Fireworks autorun={{ speed: 3, duration: 3 }} />
            ) : null}
            {!collected ? (
              <>
                <ProcessTime estimate={"30 secs"} />
                <VStack align="start" p={3} gap={3}>
                  <InfoRow
                    title={"Reward amount"}
                    stat={`${e8sToIcp(Number(stake)).toFixed(4)} ICP`}
                  />
                  <Divider />
                  <InfoRow
                    title={"NeuronPool fee"}
                    stat={`${e8sToIcp(neuronPoolAndBlockchainFee).toFixed(
                      4
                    )} ICP`}
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
                        Number(
                          BigInt(stake) -
                            BigInt(networkFeeE8s) -
                            BigInt(neuronPoolAndBlockchainFee)
                        )
                      ).toFixed(4)} ICP`}
                    />
                  </Box>
                </VStack>
              </>
            ) : null}
            {collected && !failed ? (
              <Center>
                <Icon as={CheckCircleIcon} boxSize={100} />
              </Center>
            ) : null}
            {collected && failed ? (
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
              isLoading={collecting}
              onClick={collected ? closeModal : collect}
            >
              {!collected ? "Confirm collection" : null}
              {collected && !failed ? "Collection completed" : null}
              {collected && failed ? "Collection failed" : null}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CollectReward;
