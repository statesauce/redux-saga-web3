import { formatName } from "redux-saga-web3-utils";

import { createType } from "./types";

function createActionEventSubscription(namespace, event, options = {}, meta = {}) {
  return {
    type: createType(namespace, "EVENTS", event, "SUBSCRIBE"),
    payload: {
      options,
    },
    meta,
  };
}

function createActionGetPastEvents(namespace, event, options = {}, meta = {}) {
  return {
    type: createType(namespace, "GET_PAST_EVENTS"),
    payload: {
      options,
      event,
    },
    meta,
  };
}

function createActionMethodCall(namespace, method, options = {}, meta = {}) {
  return (...args) => ({
    type: createType(namespace, "METHODS", method, "CALL"),
    payload: {
      args,
      options,
    },
    meta,
  });
}

function createActionMethodSend(namespace, methodName, options = {}, meta = {}) {
  return (...args) => ({
    type: createType(namespace, "METHODS", methodName, "SEND"),
    payload: {
      args,
      options,
    },
    meta,
  });
}

function createActionsForInterface(namespace, abi) {
  return abi.reduce(
    (reduction, member) => {
      if (member.type === "function") {
        reduction.methods[member.name] = {
          call: (options, meta) =>
            createActionMethodCall(namespace, member.name, options, meta),
          send: (options, meta) =>
            createActionMethodSend(namespace, member.name, options, meta),
        };
      } else if (member.type === "event") {
        reduction.events[member.name] = (options, meta) =>
          createActionEventSubscription(namespace, member.name, options, meta);
      }
      return reduction;
    },
    { methods: {}, events: {} }
  );
}

export {
  createActionsForInterface,
  createActionEventSubscription,
  createActionGetPastEvents,
  createActionMethodCall,
  createActionMethodSend,
};
