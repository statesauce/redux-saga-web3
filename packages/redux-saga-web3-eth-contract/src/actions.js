import { formatName } from "redux-saga-web3-utils";

function createEventSubscription(contractName, eventName, options = {}) {
  return {
    type: `${formatName(contractName)}/EVENTS/${formatName(
      eventName
    )}/SUBSCRIBE`,
    payload: {
      options,
    },
  };
}

function getPastEvents(contractName, event, options = {}) {
  return {
    type: `${formatName(contractName)}/GET_PAST_EVENTS`,
    payload: {
      event,
      ...options
    }
  };
}

function createMethodCall(contractName, methodName, options = {}) {
  return (...args) => ({
    type: `${formatName(contractName)}/METHODS/${formatName(methodName)}/CALL`,
    payload: {
      args,
      options,
    },
  });
}

function createMethodSend(contractName, methodName, options = {}) {
  return (...args) => ({
    type: `${formatName(contractName)}/METHODS/${formatName(methodName)}/SEND`,
    payload: {
      args,
      options,
    },
  });
}

export {
  createEventSubscription,
  getPastEvents,
  createMethodCall,
  createMethodSend,
};
