import { startLedgerIndexClient } from "../client/Client";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";

export const InitProfile = async ({ principal }) => {
  const index = await startLedgerIndexClient();

  const account = AccountIdentifier.fromPrincipal({
    principal: Principal.fromText(principal),
  });

  const balance = await index.accountBalance({
    certified: false,
    accountIdentifier: account,
  });

  return {
    icp_address: account.toHex(),
    icp_balance: balance.toString(),
  };
};
