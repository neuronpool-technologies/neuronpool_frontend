import { startNeuronPoolClient } from "../client/Client";

export const InitProtocolInformation = async () => {
  try {
    const neuronpool = await startNeuronPoolClient();

    const {
      ok: {
        account_identifier,
        icrc_identifier,
        minimum_stake,
        minimum_withdrawal,
        protocol_fee_percentage,
        reward_timer_duration_nanos,
        default_neuron_followee,
        main_neuron_dissolve_seconds,
        total_protocol_fees,
        total_stake_amount,
        total_stakers,
      },
    } = await neuronpool.get_protocol_information();

    // get usd information
    const url = "https://api.pro.coinbase.com/products/ICP-USD/ticker";
    const { price } = await fetch(url).then((x) => x.json());

    return {
      account_identifier: account_identifier.toString(),
      icrc_identifier: icrc_identifier.toString(),
      minimum_stake: minimum_stake.toString(),
      minimum_withdrawal: minimum_withdrawal.toString(),
      protocol_fee_percentage: protocol_fee_percentage.toString(),
      reward_timer_duration_nanos: reward_timer_duration_nanos.toString(),
      default_neuron_followee: default_neuron_followee.toString(),
      main_neuron_dissolve_seconds: main_neuron_dissolve_seconds.toString(),
      total_protocol_fees: total_protocol_fees.toString(),
      total_stake_amount: total_stake_amount.toString(),
      total_stakers: total_stakers.toString(),
      icp_price_usd: price,
    };
  } catch (error) {
    console.error(error);

    return {
      account_identifier: "",
      icrc_identifier: "",
      minimum_stake: "",
      minimum_withdrawal: "",
      protocol_fee_percentage: "",
      reward_timer_duration_nanos: "",
      default_neuron_followee: "",
      main_neuron_dissolve_seconds: "",
      total_protocol_fees: "",
      total_stake_amount: "",
      total_stakers: "",
      icp_price_usd: "",
    };
  }
};
