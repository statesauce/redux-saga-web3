import { formatName } from "redux-saga-web3-utils";

function createEventSubscription(
  contractName,
  eventName,
  options = {},
  meta = {}
) {
  return {
    type: `${formatName(contractName)}/EVENTS/${formatName(
      eventName
    )}/SUBSCRIBE`,
    payload: {
      options,
    },
    meta,
  };
}

function getPastEvents(contractName, event, options = {}, meta = {}) {
  return {
    type: `${formatName(contractName)}/GET_PAST_EVENTS`,
    payload: {
      options,
      event,
    },
    meta,
  };
}

function createMethodCall(contractName, methodName, options = {}, meta = {}) {
  return (...args) => ({
    type: `${formatName(contractName)}/METHODS/${formatName(methodName)}/CALL`,
    payload: {
      args,
      options,
    },
    meta,
  });
}

function createMethodSend(contractName, methodName, options = {}, meta = {}) {
  return (...args) => ({
    type: `${formatName(contractName)}/METHODS/${formatName(methodName)}/SEND`,
    payload: {
      args,
      options,
    },
    meta,
  });
}

export {
  createEventSubscription,
  getPastEvents,
  createMethodCall,
  createMethodSend,
};
