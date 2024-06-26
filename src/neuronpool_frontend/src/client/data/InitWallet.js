import { startLedgerIndexClient, startNeuronPoolClient } from "../Client";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
import { showToast } from "../../tools/toast";
import { deepConvertToString } from "../../tools/conversions";

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
      { claimed, all_prize_neurons },
    ] = await Promise.all([
      index.accountBalance({
        certified: false,
        accountIdentifier: account,
      }),
      neuronpool.get_staker_balance(),
      neuronpool.get_staker_prize_neurons(),
    ]);

    return {
      icp_address: account.toHex(),
      icp_balance: icpBalance.toString(),
      neuronpool_balance: neuronpoolBalance.toString(),
      claimed_prize_neurons: deepConvertToString(Array.from(claimed)),
      all_prize_neurons: deepConvertToString(Array.from(all_prize_neurons)),
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
      claimed_prize_neurons: [],
      all_prize_neurons: [],
    };
  }
};
