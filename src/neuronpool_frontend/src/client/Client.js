import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { LedgerCanister, IndexCanister } from "@dfinity/ledger-icp";
import { idlFactory as NeuronPoolCanisterIDL } from "../../../declarations/NeuronPool/index";

const ICP_API = "https://icp-api.io";

export const startNeuronPoolClient = async () => {
  const canisterId = process.env.REACT_APP_NEURONPOOL_CANISTER_ID;

  const authClient = await AuthClient.create();
  const identity = await authClient.getIdentity();

  return Actor.createActor(NeuronPoolCanisterIDL, {
    agent: new HttpAgent({
      identity,
      host: ICP_API,
    }),
    canisterId: canisterId,
  });
};

export const startLedgerClient = async () => {
  const authClient = await AuthClient.create();
  const identity = await authClient.getIdentity();

  return LedgerCanister.create({
    agent: new HttpAgent({
      identity,
      host: ICP_API,
    }),
  });
};

export const startLedgerIndexClient = async () => {
  const authClient = await AuthClient.create();
  const identity = await authClient.getIdentity();

  return IndexCanister.create({
    agent: new HttpAgent({
      identity,
      host: ICP_API,
    }),
  });
};
