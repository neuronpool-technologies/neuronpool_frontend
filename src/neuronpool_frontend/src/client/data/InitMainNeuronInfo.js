import { startNeuronPoolClient } from "../Client";

export const InitMainNeuronInfo = async () => {
  try {
    const neuronpool = await startNeuronPoolClient();

    const res = await neuronpool.get_main_neuron();

    if ("err" in res) {
      console.error(res.error);

      return { maturity_e8s_equivalent: "" };
    } else {
      const { ok: maturity_e8s_equivalent } = res;
      return maturity_e8s_equivalent;
    }
  } catch (error) {
    console.error(error);

    return { maturity_e8s_equivalent: "" };
  }
};
