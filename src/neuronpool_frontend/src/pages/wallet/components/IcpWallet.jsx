import React, { useState } from "react";
import {
  Heading,
  VStack,
  Button,
  Flex,
  Box,
  Text,
  Image as ChakraImage,
  Badge,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  InputGroup,
  InputRightElement,
  Input,
  Icon,
  Center,
  useColorMode,
  useClipboard,
  Divider,
} from "@chakra-ui/react";
import {
  CopyIcon,
  CheckIcon,
  CheckCircleIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import IcLogo from "../../../../assets/ic-logo.png";
import { useSelector, useDispatch } from "react-redux";
import { e8sToIcp, icpToE8s } from "../../../tools/conversions";
import { startLedgerClient } from "../../../client/Client";
import { fetchWallet } from "../../../state/LoginSlice";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import {
  darkBorderColor,
  darkColorBox,
  darkGrayColor,
  darkGrayTextColor,
  lightBorderColor,
  lightColorBox,
  lightGrayColor,
  lightGrayTextColor,
} from "../../../colors";
import { Auth } from "../../../components";

const IcpWallet = () => {
  const icpBalance = useSelector((state) => state.Profile.icp_balance);
  const loggedIn = useSelector((state) => state.Profile.loggedIn);

  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Flex align="center" p={1} w="100%" mb={3}>
        <ChakraImage
          src={IcLogo}
          alt="ICP logo"
          bg={colorMode === "light" ? "#edf2f6" : "white"}
          borderRadius="full"
          p={1}
          h={45}
          mr={3}
          w={45}
        />
        <VStack align="start" spacing="1">
          <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
            Internet Computer
          </Text>
          <Badge fontWeight="bold" fontSize={{ base: "xs", md: "sm" }}>
            ICP
          </Badge>
        </VStack>
        <Spacer />
        <Heading size={{ base: "sm", md: "md" }} noOfLines={1}>
          {loggedIn ? Number(e8sToIcp(icpBalance)).toFixed(4) : "--"}
        </Heading>
      </Flex>
      {loggedIn ? (
        <Flex w="100%" gap={3}>
          <ReceiveIcp />
          <SendIcp />
        </Flex>
      ) : (
        <Auth large />
      )}
    </>
  );
};

export default IcpWallet;

const ReceiveIcp = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const icpAddress = useSelector((state) => state.Profile.icp_address);
  const { colorMode, toggleColorMode } = useColorMode();
  const { hasCopied, onCopy } = useClipboard(icpAddress.toLowerCase());

  return (
    <>
      <Button onClick={onOpen} w={"100%"}>
        Receive
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={colorMode === "light" ? lightColorBox : darkColorBox}>
          <ModalHeader align="center">Receive</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Box
                bg={colorMode === "light" ? lightGrayColor : darkGrayColor}
                border={
                  colorMode === "light"
                    ? `solid ${lightBorderColor} 1px`
                    : `solid ${darkBorderColor} 1px`
                }
                borderRadius="md"
                p={3}
              >
                <Text noOfLines={3}>{icpAddress.toLowerCase()}</Text>
                <Flex mt={3}>
                  <Spacer />
                  <Button
                    rightIcon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                    size="sm"
                    onClick={onCopy}
                  >
                    {hasCopied ? "Copied" : "Copy"}
                  </Button>
                </Flex>
              </Box>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button w="100%" onClick={onClose}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const SendIcp = () => {
  const { icpBalance, principal } = useSelector((state) => state.Profile);
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  const Transfer = async () => {
    const amountConverted = icpToE8s(amount);

    const icp_fee = 10000n;

    if (address.length === 64 && amountConverted > icp_fee) {
      setSending(true);
      const ledger = await startLedgerClient();

      try {
        await ledger.transfer({
          to: AccountIdentifier.fromHex(address),
          amount: amountConverted - icp_fee,
        });

        dispatch(fetchWallet({ principal }));

        setSending(false);
        setSent(true);
      } catch (error) {
        setSending(false);
        setSent(true);
        setFailed(true);
      }
    }
  };

  const closeModal = () => {
    setAddress("");
    setAmount("");
    setSending(false);
    setSent(false);
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen} w={"100%"}>
        Send
      </Button>
      <Modal isOpen={isOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent bg={colorMode === "light" ? lightColorBox : darkColorBox}>
          <ModalHeader align="center">Send</ModalHeader>
          {!sending ? <ModalCloseButton /> : null}
          <ModalBody>
            {!sent ? (
              <FormControl>
                <Input
                  mb={3}
                  placeholder="Destination address"
                  isDisabled={sending}
                  value={address}
                  isInvalid={address !== "" && address.length !== 64}
                  onChange={(event) => setAddress(event.target.value)}
                />
                <InputGroup>
                  <Input
                    placeholder="Amount"
                    value={amount}
                    isDisabled={sending}
                    isInvalid={
                      (amount !== "" && icpToE8s(Number(amount)) <= 10000) ||
                      icpToE8s(Number(amount)) > Number(icpBalance)
                    }
                    type="number"
                    onChange={(event) => setAmount(event.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      _hover={{ opacity: "0.8" }}
                      h="1.75rem"
                      size="sm"
                      isDisabled={sending}
                      onClick={() => {
                        const newAmount = e8sToIcp(Number(icpBalance));
                        setAmount(newAmount || "");
                      }}
                    >
                      Max
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <VStack
                  align="start"
                  borderLeft={
                    colorMode === "light"
                      ? `solid ${lightBorderColor} 1px`
                      : `solid ${darkBorderColor} 1px`
                  }
                  borderRight={
                    colorMode === "light"
                      ? `solid ${lightBorderColor} 1px`
                      : `solid ${darkBorderColor} 1px`
                  }
                  borderBottom={
                    colorMode === "light"
                      ? `solid ${lightBorderColor} 1px`
                      : `solid ${darkBorderColor} 1px`
                  }
                  borderBottomRadius="lg"
                  p={3}
                  mt={-0.5}
                  bg={colorMode === "light" ? lightGrayColor : darkGrayColor}
                >
                  <Flex w="100%">
                    <Flex align={"center"} gap={1}>
                      <Text
                        noOfLines={1}
                        fontWeight={500}
                        color={
                          colorMode === "light"
                            ? lightGrayTextColor
                            : darkGrayTextColor
                        }
                      >
                        Available
                      </Text>
                    </Flex>
                    <Spacer />
                    <Text noOfLines={1} fontWeight={500}>
                      {e8sToIcp(icpBalance)} ICP
                    </Text>
                  </Flex>
                  <Divider />
                  <Flex w="100%">
                    <Flex align={"center"} gap={1}>
                      <Text
                        noOfLines={1}
                        fontWeight={500}
                        color={
                          colorMode === "light"
                            ? lightGrayTextColor
                            : darkGrayTextColor
                        }
                      >
                        Network fee
                      </Text>
                    </Flex>
                    <Spacer />
                    <Text noOfLines={1} fontWeight={500}>
                      0.0001 ICP
                    </Text>
                  </Flex>
                </VStack>
              </FormControl>
            ) : null}
            {sent && !failed ? (
              <Center>
                <Icon as={CheckCircleIcon} boxSize={100} />
              </Center>
            ) : null}
            {sent && failed ? (
              <Center>
                <Icon as={WarningIcon} boxSize={100} />
              </Center>
            ) : null}
          </ModalBody>

          <ModalFooter>
            <Button
              w="100%"
              onClick={sent ? closeModal : Transfer}
              isLoading={sending}
              isDisabled={
                address.length !== 64 ||
                icpToE8s(Number(amount)) <= 10000 ||
                (!sent && icpToE8s(Number(amount)) > Number(icpBalance))
              }
            >
              {!sent ? "Send now" : null}
              {sent && !failed ? "Transaction completed" : null}
              {sent && failed ? "Transaction failed" : null}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
