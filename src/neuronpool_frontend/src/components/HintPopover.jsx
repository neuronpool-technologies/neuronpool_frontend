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
    <Popover>
      <PopoverTrigger>
        <InfoIcon
          color="gray.500"
          aria-label="info"
          _hover={{
            cursor: "pointer",
            transform: "scale(1.1)",
            transition: "transform 0.2s",
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
