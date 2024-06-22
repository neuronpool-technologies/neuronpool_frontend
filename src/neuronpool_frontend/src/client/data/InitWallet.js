import { startLedgerIndexClient, startNeuronPoolClient } from "../Client";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
import { showToast } from "../../tools/toast";

export const InitWallet = async ({ principal }) => {
  try {
    const [neuronpool, index] = await Promise.all([
      startNeuronPoolClient(),
      startLedgerIndexClient(),
    ]);

    // get account information
    const account = AccountIdentifier.fromPrincipal({
      principal: Principal.fromText(principal),
    });

    // get neuronpool information
    const [
      icpBalance,
      neuronpoolBalance,
      neuronpoolWithdrawalNeurons,
      { claimed, all_prize_neurons },
    ] = await Promise.all([
      index.accountBalance({
        certified: false,
        accountIdentifier: account,
      }),
      neuronpool.get_staker_balance(),
      neuronpool.get_staker_withdrawal_neurons(),
      neuronpool.get_staker_prize_neurons(),
    ]);

    // TODO may need to convert elements within arrays to srings for redux
    return {
      icp_address: account.toHex(),
      icp_balance: icpBalance.toString(),
      neuronpool_balance: neuronpoolBalance.toString(),
      neuronpool_withdrawal_neurons: Array.from(neuronpoolWithdrawalNeurons),
      claimed_prize_neurons: claimed,
      all_prize_neurons: Array.from(all_prize_neurons),
    };
  } catch (error) {
    console.error(error);

    showToast({
      title: "Error fetching wallet information",
      description: error.toString(),
      status: "warning",
    });

    return {
      icp_address: "",
      icp_balance: "",
      neuronpool_balance: "",
      neuronpool_withdrawal_neurons: [],
      claimed_prize_neurons: [],
      all_prize_neurons: [],
    };
  }
};
