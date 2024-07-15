import { startLedgerIndexClient, startNeuronPoolClient } from "../Client";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";

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
    const [icpBalance, neuronpoolBalance] = await Promise.all([
      index.accountBalance({
        certified: false,
        accountIdentifier: account,
      }),
      neuronpool.get_staker_balance(),
    ]);

    return {
      icp_address: account.toHex(),
      icp_balance: icpBalance.toString(),
      neuronpool_balance: neuronpoolBalance.toString(),
    };
  } catch (error) {
    console.error(error);

    // if wallet cannot be fetched it's best to log out the user anyway
    // this allows them to try again
    const authClient = await AuthClient.create();
    await authClient.logout();
    window.location.reload();

    return {
      icp_address: "",
      icp_balance: "",
      neuronpool_balance: "",
    };
  }
};
