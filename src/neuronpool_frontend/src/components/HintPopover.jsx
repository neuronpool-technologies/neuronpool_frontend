import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

const HintPopover = ({ details }) => {
  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <InfoIcon
          color="gray.500"
          aria-label="Info icon"
          _hover={{
            cursor: "pointer",
          }}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>{details}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default HintPopover;
