import { deepConvertToString } from "../../tools/conversions";
import { showToast } from "../../tools/toast";
import { startNeuronPoolClient } from "../Client";

export const InitOperationHistory = async () => {
  try {
    const neuronpool = await startNeuronPoolClient();

    // return the last x entries
    const amountToFetch = 20;

    // get the total amount by fetching once
    const res = await neuronpool.get_operation_history({ start: 0, length: 1 });

    const totalOperations = res.ok.total;

    if ("err" in res) {
      console.error(res.err);

      showToast({
        title: "Error fetching operation history",
        description: res.err.toString(),
        status: "warning",
      });

      return { total: "", operations: [] };
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
        };
      }
    }
  } catch (error) {
    console.error(error);
    showToast({
      title: "Error fetching operation history",
      description: error.toString(),
      status: "warning",
    });

    return { total: "", operations: [] };
  }
};
