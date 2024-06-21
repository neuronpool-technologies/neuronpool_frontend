import React from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Button,
  Image as ChakraImage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Divider,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  Stepper,
  useSteps,
  Box,
  useColorMode,
  Spinner,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import {
  darkColor,
  darkColorBox,
  darkGrayTextColor,
  lightColor,
  lightColorBox,
  lightGrayTextColor,
  lightBorderColor,
  darkBorderColor,
} from "../../../colors";
import { useSelector } from "react-redux";
import { InfoRow } from "../../../components";
import { e8sToIcp } from "../../../tools/conversions";

const RewardPool = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const protocolInfo = useSelector((state) => state.Protocol);

  return (
    <Box>
      <Flex mt={6}>
        <Text
          fontWeight="bold"
          color={colorMode === "light" ? darkColor : lightColor}
        >
          Reward pool
        </Text>
      </Flex>
      <Box
        boxShadow="md"
        borderRadius="lg"
        p={3}
        mt={3}
        border={
          colorMode === "light"
            ? `solid ${lightBorderColor} 1px`
            : `solid ${darkBorderColor} 1px`
        }
        bg={colorMode === "light" ? lightColorBox : darkColorBox}
      >
        <VStack align="start" p={3} gap={3}>
          <InfoRow
            title={"Current reward pool"}
            stat={protocolInfo.status === "succeeded" ? "Need to fetch" : "--"}
          />
          <Divider />
          <InfoRow
            title={"Next distribution"}
            stat={
              protocolInfo.status === "succeeded" ? "Need to calculate" : "--"
            }
          />
        </VStack>
      </Box>
    </Box>
  );
};

export default RewardPool;
