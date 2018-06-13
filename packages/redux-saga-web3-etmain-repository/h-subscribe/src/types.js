import { formatName } from "redux-saga-web3-utils";

export function createTypes(name, event) {
  const baseType = `${formatName(name)}/EVENTS/${formatName(event)}/SUBSCRIBE`;

  return {
    SUBSCRIBE: baseType,
    DATA: baseType + "/DATA",
    CHANGED: baseType + "/CHANGED",
    ERROR: baseType + "/ERROR",
  };
}
