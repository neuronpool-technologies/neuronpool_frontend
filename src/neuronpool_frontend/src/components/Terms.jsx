import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  useColorMode,
  Badge,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  darkColorBox,
  darkGrayTextColor,
  lightColorBox,
  lightGrayTextColor,
} from "../colors";
import { convertSecondsToDays, e8sToIcp } from "../tools/conversions";
import { useSelector } from "react-redux";

const Terms = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    minimum_stake,
    minimum_withdrawal,
    protocol_fee_percentage,
    main_neuron_dissolve_seconds,
  } = useSelector((state) => state.Protocol);

  return (
    <>
      <Badge
        noOfLines={1}
        color={colorMode === "light" ? lightGrayTextColor : darkGrayTextColor}
        fontWeight={500}
        _hover={{ opacity: "0.8", cursor: "pointer" }}
        onClick={onOpen}
      >
        Terms of use
      </Badge>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent bg={colorMode === "light" ? lightColorBox : darkColorBox}>
          <ModalHeader align="center">Terms of use</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" mb={3}>
              <Text fontWeight={500} fontSize="sm">
                Welcome to NeuronPool, operated by NeuronPool Technologies
                ("we", "us", "our"). By using our services, you agree to these
                Terms of Use ("Terms"). If you do not agree, please do not use
                our services.
              </Text>
              <Text fontWeight={500} fontSize="sm">
                1. Services Description
              </Text>
              <Text fontWeight={500} fontSize="sm">
                NeuronPool allows users to: Stake ICP tokens with a minimum of{" "}
                {e8sToIcp(Number(minimum_stake))} ICP. Earn staking rewards,
                which are distributed to one randomly selected user. Withdraw
                your stake (minimum {e8sToIcp(Number(minimum_withdrawal))} ICP)
                anytime, subject to a{" "}
                {convertSecondsToDays(Number(main_neuron_dissolve_seconds))} day
                dissolve delay.
              </Text>
              <Text fontWeight={500} fontSize="sm">
                2. Fees
              </Text>
              <Text fontWeight={500} fontSize="sm">
                Users pay ICP transaction fees when entering and leaving the
                protocol. We take {protocol_fee_percentage}% of the staking
                rewards as a fee.
              </Text>
              <Text fontWeight={500} fontSize="sm">
                3. Limited Liability
              </Text>
              <Text fontWeight={500} fontSize="sm">
                To the fullest extent permitted by law, NeuronPool and its team
                are not liable for any indirect, incidental, special,
                consequential, or punitive damages. This includes loss of
                profits, data, or other intangible losses, and specifically
                includes any loss of funds resulting from: Your use or inability
                to use our services. Unauthorized access to your data. Bugs,
                hacks, exploits, or viruses transmitted through our services.
                Errors or omissions in our services.
              </Text>
              <Text fontWeight={500} fontSize="sm">
                4. Security and Bug Reporting
              </Text>
              <Text fontWeight={500} fontSize="sm">
                Our smart contract is open-sourced for transparency. Report
                security issues, bugs, hacks, or exploits to
                hello@neuronpool.com for potential compensation.
              </Text>
              <Text fontWeight={500} fontSize="sm">
                5. Acceptance of Terms
              </Text>
              <Text fontWeight={500} fontSize="sm">
                By using NeuronPool, you acknowledge that you have read and
                agree to these Terms.
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Terms;
