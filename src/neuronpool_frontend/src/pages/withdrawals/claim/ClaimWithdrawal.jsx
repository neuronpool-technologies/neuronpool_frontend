import React from "react";
import { useSelector } from "react-redux";
import { Button } from "@chakra-ui/react";
import { Auth } from "../../../components";

const ClaimWithdrawal = () => {
  const logged_in = useSelector((state) => state.Profile.logged_in);

  return (
    <>
      {logged_in ? (
        <Button w="100%" colorScheme="blue" rounded="full" boxShadow="base">
          Claim withdrawal
        </Button>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default ClaimWithdrawal;
