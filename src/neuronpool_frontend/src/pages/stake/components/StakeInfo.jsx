import React from "react";
import { Divider, VStack, Spinner } from "@chakra-ui/react";
import { convertSecondsToDays, e8sToIcp } from "../../../tools/conversions";
import { useSelector } from "react-redux";
import { HintPopover, InfoRow } from "../../../components";

const StakeInfo = () => {
  const protocolInfo = useSelector((state) => state.Protocol);

  return (
    <VStack align="start" p={3} gap={3} w="100%">
      <InfoRow
        title={"Minimum stake"}
        stat={
          protocolInfo.status === "succeeded" ? (
            `${e8sToIcp(Number(protocolInfo.minimum_stake))} ICP`
          ) : (
            <Spinner size="sm" />
          )
        }
      />
      <Divider />
      <InfoRow
        title={"Network fee"}
        stat={
          protocolInfo.status === "succeeded" ? (
            `0.0002 ICP`
          ) : (
            <Spinner size="sm" />
          )
        }
      />
      <Divider />
      <InfoRow
        title={"Withdrawal duration"}
        stat={
          protocolInfo.status === "succeeded" ? (
            `${convertSecondsToDays(
              Number(protocolInfo.main_neuron_dissolve_seconds)
            )} days`
          ) : (
            <Spinner size="sm" />
          )
        }
      />
      <Divider />
      <InfoRow
        title={"Reward fee"}
        stat={
          protocolInfo.status === "succeeded" ? (
            `${Number(protocolInfo.protocol_fee_percentage)}%`
          ) : (
            <Spinner size="sm" />
          )
        }
      >
        <HintPopover
          details={
            "This fee is deducted from staking reward winnings only and is not taken from your staked amount."
          }
        />
      </InfoRow>
    </VStack>
  );
};

export default StakeInfo;
