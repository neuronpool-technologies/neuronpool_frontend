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
  IconButton,
} from "@chakra-ui/react";
import {
  CopyIcon,
  CheckIcon,
  CheckCircleIcon,
  WarningIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import IcLogo from "../../../../assets/ic-logo.png";
import { useSelector, useDispatch } from "react-redux";
import { e8sToIcp, icpToE8s } from "../../../tools/conversions";
import { startLedgerClient } from "../../../client/Client";
import { fetchWallet } from "../../../state/ProfileSlice";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import {
  darkBorderColor,
  darkColorBox,
  darkGrayColorBox,
  lightBorderColor,
  lightColorBox,
  lightGrayColorBox,
} from "../../../colors";
import { Auth } from "../../../components";
import { showToast } from "../../../tools/toast";
import InfoRow from "../../../components/InfoRow";

const IcpWallet = () => {
  const { logged_in, icp_balance, principal } = useSelector(
    (state) => state.Profile
  );

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
          {logged_in ? Number(e8sToIcp(icp_balance)).toFixed(4) : "0.0000"}
        </Heading>
        <Refresh principal={principal} logged_in={logged_in} />
      </Flex>
      {logged_in ? (
        <Flex w="100%" gap={3}>
          <ReceiveIcp />
          <SendIcp />
        </Flex>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default IcpWallet;

const Refresh = ({ principal, logged_in }) => {
  const dispatch = useDispatch();
  const [rotation, setRotation] = useState(0);

  const refresh = () => {
    const newRotation = rotation + 360; // Increment by 360 degrees
    setRotation(newRotation);

    dispatch(fetchWallet({ principal }));
  };

  return (
    <IconButton
      ms={2}
      icon={
        <RepeatIcon
          transition={"transform 0.5s linear"}
          transform={`rotate(${rotation}deg)`}
        />
      }
      isDisabled={logged_in === false}
      size="xs"
      onClick={refresh}
      rounded="full"
      boxShadow="base"
      aria-label="Refresh wallet button"
    />
  );
};

const ReceiveIcp = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const icpAddress = useSelector((state) => state.Profile.icp_address);
  const { colorMode, toggleColorMode } = useColorMode();
  const { hasCopied, onCopy } = useClipboard(icpAddress.toLowerCase());

  return (
    <>
      <Button onClick={onOpen} w={"100%"} rounded="full" boxShadow="base">
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
                bg={
                  colorMode === "light" ? lightGrayColorBox : darkGrayColorBox
                }
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
                    rounded="full"
                    boxShadow="base"
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
            <Button w="100%" onClick={onClose} rounded="full" boxShadow="base">
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const SendIcp = () => {
  const { icp_balance, principal } = useSelector((state) => state.Profile);
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

        setSending(false);
        setSent(true);
      } catch (error) {
        setSending(false);
        setSent(true);
        setFailed(true);

        showToast({
          title: "Error sending ICP",
          description: error.toString(),
          status: "warning",
        });
      }
    }
  };

  const closeModal = () => {
    setAddress("");
    setAmount("");
    setSending(false);
    setSent(false);
    onClose();

    // index canister does not update instantly
    // but it should update by the time the modal is closed
    // so balance will be most accurate here
    dispatch(fetchWallet({ principal }));
  };

  return (
    <>
      <Button onClick={onOpen} w={"100%"} rounded="full" boxShadow="base">
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
                  size="lg"
                  mb={3}
                  placeholder="Destination address"
                  isDisabled={sending}
                  value={address}
                  isInvalid={address !== "" && address.length !== 64}
                  onChange={(event) => setAddress(event.target.value)}
                />
                <InputGroup>
                  <Input
                    size="lg"
                    placeholder="Amount"
                    value={amount}
                    isDisabled={sending}
                    isInvalid={
                      (amount !== "" && icpToE8s(Number(amount)) <= 10000) ||
                      icpToE8s(Number(amount)) > Number(icp_balance)
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
                      isDisabled={sending}
                      onClick={() => {
                        const newAmount = e8sToIcp(Number(icp_balance));
                        setAmount(newAmount || "");
                      }}
                    >
                      Max
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <VStack align="start" p={3} gap={3}>
                  <InfoRow
                    title={"Wallet balance"}
                    stat={`${e8sToIcp(icp_balance)} ICP`}
                  />
                  <Divider />
                  <InfoRow title={"Network fee"} stat={"0.0001 ICP"} />
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
              rounded="full"
              boxShadow="base"
              w="100%"
              onClick={sent ? closeModal : Transfer}
              isLoading={sending}
              isDisabled={
                address.length !== 64 ||
                icpToE8s(Number(amount)) <= 10000 ||
                (!sent && icpToE8s(Number(amount)) > Number(icp_balance))
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
