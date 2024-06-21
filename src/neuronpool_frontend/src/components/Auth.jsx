import React, { useEffect, useState } from "react";
import {
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuGroup,
  Icon,
  Avatar,
  Image as ChakraImage,
  useClipboard,
  useColorMode,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  CloseIcon,
  CopyIcon,
  CheckIcon,
} from "@chakra-ui/icons";
import {
  setLogin,
  setLogout,
  setPrincipal,
  fetchWallet,
} from "../state/ProfileSlice";
import { AuthClient } from "@dfinity/auth-client";
import { Usergeek } from "usergeek-ic-js";
import { useDispatch, useSelector } from "react-redux";
import IcLogo from "../../assets/ic-logo.png";
import { darkColorBox, lightColorBox } from "../colors";
import { fetchProtocolInformation } from "../state/ProtocolSlice";
import { fetchHistory } from "../state/HistorySlice";
import { fetchNeuron } from "../state/NeuronSlice";

const Auth = () => {
  const dispatch = useDispatch();
  const logged_in = useSelector((state) => state.Profile.logged_in);
  const protocolStatus = useSelector((state) => state.Protocol.status);
  const historyStatus = useSelector((state) => state.History.status);
  const neuronStatus = useSelector((state) => state.Neuron.status);

  const [client, setClient] = useState();

  const initAuth = async () => {
    Usergeek.init({
      apiKey: process.env.REACT_APP_USERGEEK_KEY,
      host: "https://lpfay-3aaaa-aaaal-qbupa-cai.raw.icp0.io",
    });

    const authClient = await AuthClient.create();
    setClient(authClient);

    const isAuthenticated = await authClient.isAuthenticated();

    if (isAuthenticated) {
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal();
      dispatch(setPrincipal(principal.toString()));
      dispatch(setLogin());
      Usergeek.setPrincipal(principal);
      Usergeek.trackSession();
    }
  };

  const fetchData = async () => {
    if (protocolStatus === "idle" || protocolStatus === "failed") {
      dispatch(fetchProtocolInformation());
    }

    if (historyStatus === "idle" || historyStatus === "failed") {
      dispatch(fetchHistory());
    }

    if (neuronStatus === "idle" || neuronStatus === "failed") {
      dispatch(fetchNeuron());
    }
  };

  const connect = () => {
    const isProduction = process.env.NODE_ENV === "production";

    client.login({
      identityProvider: "https://identity.ic0.app/",
      derivationOrigin: isProduction
        ? `https://${process.env.REACT_APP_FRONTEND_CANISTER_ID}.icp0.io`
        : null,
      onSuccess: async () => {
        const identity = client.getIdentity();
        const principal = identity.getPrincipal();
        dispatch(setPrincipal(principal.toString()));
        dispatch(setLogin());
        Usergeek.setPrincipal(principal);
        Usergeek.trackSession();
      },
      onError: (error) => {
        console.error("Authentication failed: ", error);
      },
    });
  };

  useEffect(() => {
    initAuth();
    fetchData();
  }, [logged_in]);

  return (
    <>
      {logged_in ? (
        <UserProfile />
      ) : (
        <Button onClick={connect} w="100%" rounded="full" boxShadow="base">
          <Flex align="center">
            Connect Identity&nbsp;
            <ChakraImage
              src={IcLogo}
              alt="Internet identity logo"
              h={"20px"}
              w={"auto"}
            />
          </Flex>
        </Button>
      )}
    </>
  );
};

export default Auth;

const UserProfile = () => {
  const dispatch = useDispatch();

  const principal = useSelector((state) => state.Profile.principal);
  const icp_address = useSelector((state) => state.Profile.icp_address);
  const { colorMode, toggleColorMode } = useColorMode();

  const logout = async () => {
    const authClient = await AuthClient.create();
    await authClient.logout();
    dispatch(setLogout());
    Usergeek.setPrincipal(undefined);
  };

  useEffect(() => {
    dispatch(fetchWallet({ principal }));
  }, []);

  return (
    <Menu autoSelect={false}>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        rounded="full"
        boxShadow="base"
      >
        <Flex align="center" gap={2}>
          <Avatar
            size="xs"
            src={`https://identicons.github.com/${principal[0]}.png`}
            alt="Avatar icon"
          />
          {principal
            ? principal.substring(0, 5) + "..." + principal.substring(60, 63)
            : null}
        </Flex>
      </MenuButton>
      <MenuList
        alignItems={"center"}
        zIndex={3}
        bg={colorMode === "light" ? lightColorBox : darkColorBox}
      >
        <Flex align="center" m={3} gap={2}>
          <Avatar
            size="sm"
            src={`https://identicons.github.com/${principal[0]}.png`}
            alt="Avatar icon"
          />
          {principal
            ? principal.substring(0, 7) + "..." + principal.substring(57, 63)
            : null}
        </Flex>
        <CopyToClipboardButton value={principal} type={"principal ID"} />
        <CopyToClipboardButton
          value={icp_address.toLowerCase()}
          type={"ICP address"}
        />
        <MenuDivider />
        <MenuGroup title="App version">
          <Flex align="center" mx={3} gap={2}>
            <Icon viewBox="0 0 200 200" color="orange.500">
              <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              />
            </Icon>
            {process.env.REACT_APP_VERSION}
          </Flex>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title="Blockchain network">
          <Flex align="center" mx={3} gap={2}>
            <Icon viewBox="0 0 200 200" color="green.500">
              <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              />
            </Icon>
            Internet Computer
          </Flex>
        </MenuGroup>
        <MenuDivider />
        <MenuItem
          icon={<CloseIcon />}
          onClick={logout}
          bg="none"
          _hover={{ opacity: "0.9" }}
        >
          Disconnect
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

const CopyToClipboardButton = ({ value, type }) => {
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <MenuItem
      closeOnSelect={false}
      icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
      onClick={value ? onCopy : null}
      bg="none"
      _hover={{ opacity: "0.9" }}
    >
      {value ? `Copy ${type}` : "Loading..."}
    </MenuItem>
  );
};
