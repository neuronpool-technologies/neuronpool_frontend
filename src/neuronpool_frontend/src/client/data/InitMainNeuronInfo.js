import { deepConvertToString } from "../../tools/conversions";
import { showToast } from "../../tools/toast";
import { startNeuronPoolClient } from "../Client";

export const InitMainNeuronInfo = async () => {
  try {
    const neuronpool = await startNeuronPoolClient();

    const [res, rewardDistributions] = await Promise.all([
      await neuronpool.get_main_neuron(),
      neuronpool.get_reward_distributions(),
    ]);

    if ("err" in res) {
      console.error(res.err);

      showToast({
        title: "Error fetching main neuron information",
        description: res.err.toString(),
        status: "warning",
      });

      return {
        maturity_e8s_equivalent: "",
        reward_distributions: [],
      };
    } else {
      const {
        ok: { maturity_e8s_equivalent },
      } = res;

      return {
        maturity_e8s_equivalent: maturity_e8s_equivalent.toString(),
        reward_distributions: deepConvertToString(
          Array.from(rewardDistributions)
        ),
      };
    }
  } catch (error) {
    console.error(error);
    showToast({
      title: "Error fetching main neuron information",
      description: error.toString(),
      status: "warning",
    });

    return { maturity_e8s_equivalent: "", reward_distributions: [] };
  }
};
