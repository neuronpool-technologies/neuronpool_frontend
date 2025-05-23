import { deepConvertToString } from "../../tools/conversions";
import { showToast } from "../../tools/toast";
import { startNeuronPoolClient } from "../Client";
import { Usergeek } from "usergeek-ic-js";

export const InitOperationHistory = async () => {
  try {
    const neuronpool = await startNeuronPoolClient();

    // return the last x entries
    const amountToFetch = 20;

    // get the total amount by fetching once and get the reward distributions
    const [res, rewardDistributions] = await Promise.all([
      neuronpool.get_operation_history({ start: 0, length: 1 }),
      neuronpool.get_reward_distributions(),
    ]);

    const totalOperations = res.ok.total;

    if ("err" in res) {
      console.error(res.err);
      
      Usergeek.trackEvent("Error fetching operation history");

      showToast({
        title: "Error fetching operation history",
        description: res.err.toString(),
        status: "warning",
      });

      return { total: "", operations: [], reward_distributions: [] };
    } else {
      if (totalOperations > amountToFetch) {
        const {
          ok: { total, operations },
        } = await neuronpool.get_operation_history({
          start: Number(totalOperations - BigInt(amountToFetch)),
          length: amountToFetch,
        });

        return {
          total: total.toString(),
          operations: deepConvertToString(operations),
          reward_distributions: deepConvertToString(
            Array.from(rewardDistributions)
          ),
        };
      } else {
        const {
          ok: { total, operations },
        } = await neuronpool.get_operation_history({
          start: 0,
          length: totalOperations,
        });

        return {
          total: total.toString(),
          operations: deepConvertToString(operations),
          reward_distributions: deepConvertToString(
            Array.from(rewardDistributions)
          ),
        };
      }
    }
  } catch (error) {
    console.error(error);

    Usergeek.trackEvent("Error fetching operation history");

    showToast({
      title: "Error fetching operation history",
      description: `${error.toString().substring(0, 200)}...`,
      status: "warning",
    });

    return { total: "", operations: [], reward_distributions: [] };
  }
};
