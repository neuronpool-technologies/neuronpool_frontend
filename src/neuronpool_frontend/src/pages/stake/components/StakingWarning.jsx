import React from "react";
import {
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Flex,
} from "@chakra-ui/react";
import {
  convertNanosecondsToDays,
  convertSecondsToDays,
} from "../../../tools/conversions";
import { useSelector } from "react-redux";

const StakingWarning = () => {
  const { main_neuron_dissolve_seconds, reward_timer_duration_nanos } =
    useSelector((state) => state.Protocol);

  const stakingWarning = `By staking with NeuronPool, you accept the risks involved, including the potential loss of funds due to exploits, hacks, etc. Your staked funds will be locked for a minimum of ${convertSecondsToDays(
    Number(main_neuron_dissolve_seconds)
  )} days and will remain locked until you initiate the withdrawal process. Additionally, all of the staking rewards will be added to the reward pool. A winner is then selected randomly and awarded the pool every ${convertNanosecondsToDays(
    Number(reward_timer_duration_nanos)
  )} days. Please note that winning rewards are not guaranteed, and there is a possibility that you may not receive any rewards.`;

  return (
    <Flex align="center" justify="center" w="100%">
      <Popover trigger="hover">
        <PopoverTrigger>
          <Text
            as="u"
            color="blue.500"
            fontWeight={500}
            _hover={{ cursor: "pointer" }}
          >
            Staking Terms and Conditions
          </Text>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody fontSize="sm">{stakingWarning}</PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};

export default StakingWarning;
