import React from "react";
import { Divider, VStack } from "@chakra-ui/react";
import { convertSecondsToDays, e8sToIcp } from "../../tools/conversions";
import { useSelector } from "react-redux";
import { HintPopover, InfoRow } from "../../components";

const StakeInfo = () => {
  const protocolInfo = useSelector((state) => state.Protocol);

  return (
    <VStack align="start" p={3} gap={3} w="100%">
      <InfoRow
        title={"Minimum stake"}
        stat={
          protocolInfo.minimum_stake
            ? `${e8sToIcp(Number(protocolInfo.minimum_stake))} ICP`
            : "--"
        }
      />
      <Divider />
      <InfoRow
        title={"Network fee"}
        stat={protocolInfo.minimum_stake ? `0.0002 ICP` : "--"}
      />
      <Divider />
      <InfoRow
        title={"Withdrawal duration"}
        stat={
          protocolInfo.minimum_stake
            ? `${convertSecondsToDays(
                Number(protocolInfo.main_neuron_dissolve_seconds)
              )} days`
            : "--"
        }
      />
      <Divider />
      <InfoRow
        title={"Reward fee"}
        stat={
          protocolInfo.minimum_stake
            ? `${protocolInfo.protocol_fee_percentage}%`
            : "--"
        }
      >
        <HintPopover
          details={
            "This fee applies to staking reward winnings only and is not taken from your staked amount."
          }
        />
      </InfoRow>
    </VStack>
  );
};

export default StakeInfo;
