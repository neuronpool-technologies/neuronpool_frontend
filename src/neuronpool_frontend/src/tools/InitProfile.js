import {
  startLedgerIndexClient,
  startNeuronPoolClient,
} from "../client/Client";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";

export const InitProfile = async ({ principal }) => {
  const [neuronpool, index] = await Promise.all([
    startNeuronPoolClient(),
    startLedgerIndexClient(),
  ]);

  const account = AccountIdentifier.fromPrincipal({
    principal: Principal.fromText(principal),
  });

  const balance = await index.accountBalance({
    certified: false,
    accountIdentifier: account,
  });

  const [
    neuronpoolBalance,
    neuronpoolWithdrawalNeurons,
    { claimed, all_prize_neurons },
  ] = await Promise.all([
    neuronpool.get_staker_balance(),
    neuronpool.get_staker_withdrawal_neurons(),
    neuronpool.get_staker_prize_neurons(),
  ]);

  // TODO may need to convert elements within arrays to srings for redux
  return {
    icp_address: account.toHex(),
    icp_balance: balance.toString(),
    neuronpool_balance: neuronpoolBalance.toString(),
    neuronpool_withdrawal_neurons: Array.from(neuronpoolWithdrawalNeurons),
    claimed_prize_neurons: claimed,
    all_prize_neurons: Array.from(all_prize_neurons),
  };
};
