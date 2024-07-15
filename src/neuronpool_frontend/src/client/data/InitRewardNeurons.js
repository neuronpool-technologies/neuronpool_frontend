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
    const unclaimedNeuronsIds = allNeurons.filter(
      (neuron) => !claimedNeuronIds.includes(neuron)
    );

    const { neuron_infos, full_neurons } =
      await neuronpool.list_neuron_information({
        neuronIds: unclaimedNeuronsIds,
        readable: false,
      });

    // while neurons are spawning the ICP amount is still maturity
    // when a neuron is ready to disburse the maturity is converted to the stake amount
    
    // Create a map of neuron ids to their full_neurons information for quick lookup
    const neuronMap = new Map(
      full_neurons.map((neuron) => {
        const neuronId = neuron.id[0].id;
        return [neuronId, neuron.maturity_e8s_equivalent];
      })
    );

    // Map through neuron_infos and add maturity_e8s_equivalent from corresponding full_neuron
    const enrichedNeurons = neuron_infos.map((info) => {
      const neuronId = info[0]; // Assuming neuron id is at index 0 in neuron_infos
      const maturity_e8s_equivalent = neuronMap.get(neuronId);
      return {
        id: neuronId,
        ...info[1],
        maturity_e8s_equivalent,
      };
    });

    return {
      claimed_prize_neurons_ids: deepConvertToString(Array.from(claimed)),
      unclaimed_prize_neurons_ids: deepConvertToString(
        Array.from(unclaimedNeuronsIds)
      ),
      unclaimed_prize_neurons_information: deepConvertToString(enrichedNeurons),
    };
  } catch (error) {
    console.error(error);

    showToast({
      title: "Error fetching prize neurons",
      description: `${error.toString().substring(0, 200)}...`,
      status: "warning",
    });

    return {
      claimed_prize_neurons_ids: [],
      unclaimed_prize_neurons_ids: [],
      unclaimed_prize_neurons_information: [],
    };
  }
};
