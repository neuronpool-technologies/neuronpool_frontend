import { showToast } from "../../tools/toast";
import { startNeuronPoolClient } from "../Client";

export const InitMainNeuronInfo = async () => {
  try {
    const neuronpool = await startNeuronPoolClient();

    const res = await neuronpool.get_main_neuron();

    if ("err" in res) {
      console.error(res.err);

      showToast({
        title: "Error fetching main neuron information",
        description: res.err.toString(),
        status: "warning",
      });

      return { maturity_e8s_equivalent: "" };
    } else {
      const { ok: maturity_e8s_equivalent } = res;
      return maturity_e8s_equivalent.toString();
    }
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
