import { showToast } from "../../tools/toast";
import { startNeuronPoolClient } from "../Client";
import { Usergeek } from "usergeek-ic-js";

export const InitProtocolInfo = async () => {
  try {
    const neuronpool = await startNeuronPoolClient();

    const priceUrl = "https://api.pro.coinbase.com/products/ICP-USD/ticker";
    const statsUrl = "https://ic-api.internetcomputer.org/api/v3/daily-stats";

    const [
      {
        ok: {
          account_identifier,
          icrc_identifier,
          minimum_stake,
          minimum_withdrawal,
          protocol_fee_percentage,
          reward_timer_duration_nanos,
          default_neuron_followee,
          main_neuron_id,
          main_neuron_dissolve_seconds,
          total_protocol_fees,
          total_stake_amount,
          total_stake_deposits,
          total_stakers,
        },
      },
      { price },
      {
        daily_stats: [
          {
            estimated_rewards_percentage: {
              "1_year": oneYearReward, // assign the destructured items
              "2_year": twoYearReward,
            },
          },
        ],
      },
    ] = await Promise.all([
      neuronpool.get_protocol_information(),
      fetch(priceUrl).then((x) => x.json()),
      fetch(statsUrl).then((x) => x.json()),
    ]);

    // Calculate the 6-month reward and subtract the 10% protocol fee
    const sixMonthRewardAfterFee =
      (oneYearReward - (twoYearReward - oneYearReward) / 2) * 0.9;

    // Estimate the ICP rewards for the 6-month stake
    const rewards_e8s =
      Number(total_stake_amount) * (sixMonthRewardAfterFee / 100);

    return {
      account_identifier: account_identifier.toString(),
      icrc_identifier: icrc_identifier.toString(),
      minimum_stake: minimum_stake.toString(),
      minimum_withdrawal: minimum_withdrawal.toString(),
      protocol_fee_percentage: protocol_fee_percentage.toString(),
      reward_timer_duration_nanos: reward_timer_duration_nanos.toString(),
      default_neuron_followee: default_neuron_followee.toString(),
      main_neuron_id: main_neuron_id.toString(),
      main_neuron_dissolve_seconds: main_neuron_dissolve_seconds.toString(),
      total_protocol_fees: total_protocol_fees.toString(),
      total_stake_amount: total_stake_amount.toString(),
      total_stake_deposits: total_stake_deposits.toString(),
      total_stakers: total_stakers.toString(),
      icp_price_usd: price,
      apr_estimate: sixMonthRewardAfterFee.toFixed(2).toString(),
      apr_e8s: rewards_e8s.toString(),
    };
  } catch (error) {
    console.error(error);

    Usergeek.trackEvent("Error fetching protocol information");

    showToast({
      title: "Error fetching protocol information",
      description: `${error.toString().substring(0, 200)}...`,
      status: "warning",
    });

    return {
      account_identifier: "",
      icrc_identifier: "",
      minimum_stake: "",
      minimum_withdrawal: "",
      protocol_fee_percentage: "",
      reward_timer_duration_nanos: "",
      default_neuron_followee: "",
      main_neuron_id: "",
      main_neuron_dissolve_seconds: "",
      total_protocol_fees: "",
      total_stake_amount: "",
      total_stake_deposits: "",
      total_stakers: "",
      icp_price_usd: "",
      apr_estimate: "",
      apr_e8s: "",
    };
  }
};
