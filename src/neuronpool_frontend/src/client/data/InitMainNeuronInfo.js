import { showToast } from "../../tools/toast";
import { startNeuronPoolClient } from "../Client";
import { Usergeek } from "usergeek-ic-js";

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

    Usergeek.trackEvent("Error fetching main neuron information");

    showToast({
      title: "Error fetching main neuron information",
      description: `${error.toString().substring(0, 200)}...`,
      status: "warning",
    });

    return { maturity_e8s_equivalent: "" };
  }
};
