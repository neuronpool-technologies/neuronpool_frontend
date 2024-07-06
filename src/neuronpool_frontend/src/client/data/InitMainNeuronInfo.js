import { showToast } from "../../tools/toast";
import { startNeuronPoolClient } from "../Client";

export const InitMainNeuronInfo = async () => {
  try {
    const neuronpool = await startNeuronPoolClient();

    const {
      full_neurons: [{ maturity_e8s_equivalent }],
    } = await neuronpool.list_neuron_information({
      neuronIds: [BigInt(process.env.REACT_APP_MAIN_NEURON_ID)],
      readable: false,
    });

    return {
      maturity_e8s_equivalent: maturity_e8s_equivalent.toString(),
    };
  } catch (error) {
    console.error(error);
    showToast({
      title: "Error fetching main neuron information",
      description: error.toString(),
      status: "warning",
    });

    return { maturity_e8s_equivalent: "" };
  }
};
