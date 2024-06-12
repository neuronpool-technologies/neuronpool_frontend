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
} from "@chakra-ui/react";
import IcLogo from "../../../assets/ic-logo.png";
import { e8sToIcp, icpToE8s } from "../../tools/conversions";
import { useSelector } from "react-redux";
import Auth from "../../components/Auth";
import InfoRow from "../../components/InfoRow";

const IcpStake = () => {
  const [amount, setAmount] = useState("");
  const icpBalance = useSelector((state) => state.Profile.icp_balance);
  const loggedIn = useSelector((state) => state.Profile.loggedIn);
  const [staking, setStaking] = useState(false);

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
      <StakeModal amount={amount} />
    </>
  );
};

export default IcpStake;

const StakeModal = ({ amount }) => {
  const loggedIn = useSelector((state) => state.Profile.loggedIn);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {loggedIn ? (
        <>
          <Button onClick={onOpen} w="100%" size="lg" colorScheme="blue">
            Stake
          </Button>

          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader align="center">Stake</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack align="start" p={3} gap={3}>
                  <InfoRow title={"Stake amount"} stat={"hello"} />
                  <Divider />
                  <InfoRow title={"Network fee"} stat={"hello"} />
                  <Divider />
                  <InfoRow title={"Amount after fees"} stat={"hello"} />
                </VStack>
                {/* TODO add 3 steps */}
              </ModalBody>

              <ModalFooter>
                <Button w="100%" colorScheme="blue">
                  Confirm stake
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
