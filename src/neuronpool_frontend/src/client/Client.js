import { HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { LedgerCanister, IndexCanister } from "@dfinity/ledger-icp";

export const startLedgerClient = async () => {
  const authClient = await AuthClient.create();
  const identity = await authClient.getIdentity();

  return LedgerCanister.create({
    agent: new HttpAgent({
      identity,
      host: "https://icp-api.io",
    }),
  });
};

export const startLedgerIndexClient = async () => {
  const authClient = await AuthClient.create();
  const identity = await authClient.getIdentity();

  return IndexCanister.create({
    agent: new HttpAgent({
      identity,
      host: "https://icp-api.io",
    }),
  });
};