import React from "react";
import { useSelector } from "react-redux";
import { Button } from "@chakra-ui/react";
import { Auth } from "../../../components";

const ClaimWithdrawal = () => {
  const loggedIn = useSelector((state) => state.Profile.loggedIn);

  return (
    <>
      {loggedIn ? (
        <Button w="100%" colorScheme="blue">
          Claim withdrawal
        </Button>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default ClaimWithdrawal;
