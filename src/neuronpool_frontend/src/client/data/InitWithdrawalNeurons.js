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
      const { neuron_infos } = await neuronpool.list_neuron_information({
        neuronIds: neuronpool_withdrawal_neurons,
        readable: false,
      });

      const validNeurons = neuron_infos
        .filter((item) => item[1].stake_e8s > 0n) // Filter arrays with stake_e8s > 0
        .map((item) => {
          // Map to a new structure
          return {
            id: item[0],
            ...item[1],
          };
        });

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
