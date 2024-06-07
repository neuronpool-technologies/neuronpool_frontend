import { startNeuronPoolClient } from "../client/Client";

export const InitOperationHistory = async () => {
  const neuronpool = await startNeuronPoolClient();

  // return the last x entries
  const amountToFetch = 20;

  // get the total amount by fetching once
  const res = await neuronpool.get_operation_history({ start: 0, length: 1 });

  const totalOperations = res.ok.total;

  if (res.ok.total > amountToFetch) {
    const {
      ok: { total, operations },
    } = await neuronpool.get_operation_history({
      start: Number(total - BigInt(amountToFetch)),
      length: totalOperations,
    });

    return { total: total.toString(), operations: operations };
  } else {
    const {
      ok: { total, operations },
    } = await neuronpool.get_operation_history({
      start: 0,
      length: totalOperations,
    });

    return { total: total.toString(), operations: operations };
  }
};
