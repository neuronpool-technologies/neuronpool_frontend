import React from "react";
import { Nav, Footer } from "./components";
import {
  Flex,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { Stake, Wallet, Withdrawals, Rewards, ErrorPage } from "./pages";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Stake />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/withdrawals" element={<Withdrawals />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

const AppLayout = () => {
  // A layout component with navbar and footer
  // Outlet renders all the sub routes
  return (
    <Flex direction="column" h="100vh">
      <Box flex="1">
        <Nav />
        <Alert
          status="warning"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          flexDirection="column"
        >
          <AlertIcon />
          <AlertTitle>Important: Neuron Pool App Closing</AlertTitle>
          <AlertDescription>
            This app will be decommissioned in the coming year. Please unstake
            and withdraw your ICP at your earliest convenience to avoid any
            interruption. We appreciate your prompt attention and apologize for
            any inconvenience this may cause.
          </AlertDescription>
        </Alert>
        <Outlet />
      </Box>
      <Footer />
    </Flex>
  );
};
