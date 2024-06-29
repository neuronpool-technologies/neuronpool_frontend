import React from "react";
import { Divider, VStack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { HintPopover, InfoRow } from "../../../../components";

const CollectInfo = () => {
  const protocolInfo = useSelector((state) => state.Protocol);

  return (
    <VStack align="start" p={3} gap={3} w="100%">
      <Divider />
      <InfoRow
        title={"Payout duration"}
        stat={protocolInfo.status === "succeeded" ? `7 days` : "--"}
      >
        <HintPopover
          details={
            "The duration it takes for your reward to unlock if won."
          }
        />
      </InfoRow>
      <Divider />
      <InfoRow
        title={"Reward fee"}
        stat={
          protocolInfo.status === "succeeded"
            ? `${protocolInfo.protocol_fee_percentage}%`
            : "--"
        }
      >
        <HintPopover
          details={"The reward fee is deducted from your reward winnings."}
        />
      </InfoRow>
    </VStack>
  );
};

export default CollectInfo;
