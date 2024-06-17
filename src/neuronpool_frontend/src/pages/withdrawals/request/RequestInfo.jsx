import React from "react";
import { Divider, VStack } from "@chakra-ui/react";
import { convertSecondsToDays, e8sToIcp } from "../../../tools/conversions";
import { useSelector } from "react-redux";
import { HintPopover, InfoRow } from "../../../components";

const RequestInfo = () => {
  const protocolInfo = useSelector((state) => state.Protocol);

  return (
    <VStack align="start" p={3} gap={3} w="100%">
      <InfoRow
        title={"Minimum withdrawal"}
        stat={
          protocolInfo.status === "succeeded"
            ? `${e8sToIcp(Number(protocolInfo.minimum_withdrawal))} ICP`
            : "--"
        }
      />
      <Divider />
      <InfoRow
        title={"Network fee"}
        stat={protocolInfo.status === "succeeded" ? `0.0001 ICP` : "--"}
      />
      <Divider />
      <InfoRow
        title={"Withdrawal duration"}
        stat={
          protocolInfo.status === "succeeded"
            ? `${convertSecondsToDays(
                Number(protocolInfo.main_neuron_dissolve_seconds)
              )} days`
            : "--"
        }
      />
      <Divider />
      <InfoRow
        title={"Withdrawal fee"}
        stat={protocolInfo.status === "succeeded" ? `FREE` : "--"}
      >
        <HintPopover
          details={"NeuronPool does not charge a fee on withdrawals."}
        />
      </InfoRow>
    </VStack>
  );
};

export default RequestInfo;
