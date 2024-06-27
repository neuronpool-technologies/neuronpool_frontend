import { startNeuronPoolClient } from "../Client";
import { showToast } from "../../tools/toast";
import { deepConvertToString } from "../../tools/conversions";

export const InitRewardNeurons = async () => {
  try {
    const neuronpool = await startNeuronPoolClient();

    const { claimed, all_prize_neurons } =
      await neuronpool.get_staker_prize_neurons();

    const allNeurons = Array.from(all_prize_neurons);
    const claimedNeurons = Array.from(claimed);

    // get unclaimed neurons
    const claimedNeuronIds = claimedNeurons.map((neuron) => neuron.neuron_id);
    const unclaimedNeurons = allNeurons.filter(
      (neuron) => !claimedNeuronIds.includes(neuron)
    );

    // TODO may want to fetch more information here about the prize neurons like the withdrawals
    // TODO to continue that on testing I will need to actually win a reward
    return {
      claimed_prize_neurons: deepConvertToString(Array.from(claimed)),
      unclaimed_prize_neurons: deepConvertToString(
        Array.from(unclaimedNeurons)
      ),
    };
  } catch (error) {
    console.error(error);

    showToast({
      title: "Error fetching prize neurons",
      description: error.toString(),
      status: "warning",
    });

    return {
      claimed_prize_neurons: [],
      unclaimed_prize_neurons: [],
    };
  }
};
