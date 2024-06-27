import { deepConvertToString } from "../../tools/conversions";
import { showToast } from "../../tools/toast";
import { startNeuronPoolClient } from "../Client";

export const InitWithdrawalNeurons = async () => {
  // we need to get information about the withdrawl neurons since all we have is the IDs
  try {
    const neuronpool = await startNeuronPoolClient();
    const neuronIds = await neuronpool.get_staker_withdrawal_neurons();

    const neuronpool_withdrawal_neurons = Array.from(neuronIds);

    if (neuronpool_withdrawal_neurons.length > 0) {
      const neuronPromises = neuronpool_withdrawal_neurons.map((id) =>
        neuronpool.get_neuron_information(BigInt(id))
      );

      const neuronResults = await Promise.all(neuronPromises);

      // Filter results to only include neurons wrapped in 'ok'
      const validNeurons = neuronResults
        .filter(
          (result) => "ok" in result && result.ok.cached_neuron_stake_e8s > 0
        )
        .map((result) => result.ok);

      return {
        neuronpool_withdrawal_neurons_information:
          deepConvertToString(validNeurons),
        neuronpool_withdrawal_neurons_ids: deepConvertToString(
          Array.from(neuronIds)
        ),
      };
    } else {
      return {
        neuronpool_withdrawal_neurons_information: [],
        neuronpool_withdrawal_neurons_ids: [],
      };
    }
  } catch (error) {
    console.error(error);

    showToast({
      title: "Error fetching withdrawal neurons",
      description: error.toString(),
      status: "warning",
    });

    return {
      neuronpool_withdrawal_neurons_information: [],
      neuronpool_withdrawal_neurons_ids: [],
    };
  }
};
