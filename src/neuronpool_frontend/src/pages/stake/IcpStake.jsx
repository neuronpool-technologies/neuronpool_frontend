import React, { useState } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Button,
  Image as ChakraImage,
} from "@chakra-ui/react";
import IcLogo from "../../../assets/ic-logo.png";
import { e8sToIcp, icpToE8s } from "../../tools/conversions";
import { useSelector } from "react-redux";

const IcpStake = () => {
  const [amount, setAmount] = useState("");
  const icpBalance = useSelector((state) => state.Profile.icp_balance);
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
            isDisabled={staking}
            onClick={() => {
              const newAmount = e8sToIcp(Number(icpBalance));
              setAmount(newAmount || "");
            }}
          >
            Max
          </Button>
        </InputRightElement>
      </InputGroup>
      {/* Should open modal */}
      <Button size="lg" w="100%" colorScheme="blue">
        Stake
      </Button>
    </>
  );
};

export default IcpStake;
