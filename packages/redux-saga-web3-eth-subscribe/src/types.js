import { formatName } from "redux-saga-web3-utils";

export function createTypes(name, type) {
  const baseType = `${formatName(name)}/EVENTS/${formatName(type)}/SUBSCRIBE`;

  return {
    SUBSCRIBE: baseType,
    DATA: baseType + "/DATA",
    CHANGED: baseType + "/CHANGED",
    ERROR: baseType + "/ERROR",
  };
}
