import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorMode,
  Text,
} from "@chakra-ui/react";
import {
  darkColorBox,
  lightColorBox,
  lightBorderColor,
  darkBorderColor,
} from "../../colors";

const FaqItem = ({ title, body }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Accordion
      w="100%"
      allowMultiple
      reduceMotion
      bg={colorMode === "light" ? lightColorBox : darkColorBox}
      border={
        colorMode === "light"
          ? `solid ${lightBorderColor} 1px`
          : `solid ${darkBorderColor} 1px`
      }
      boxShadow="md"
      borderRadius="lg"
    >
      <AccordionItem border="none">
        <AccordionButton p={6} _hover={{}}>
          <Text
            flex="1"
            textAlign="left"
            fontWeight="bold"
            fontSize={{ base: "sm", md: "md" }}
          >
            {title}
          </Text>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4} fontWeight={500} px={6}>
          {body}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default FaqItem;
