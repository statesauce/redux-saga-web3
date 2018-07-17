import { formatName } from "redux-saga-web3-utils";

import { createType } from "./types";

function createActionForEventSubscription(
  namespace,
  event,
  options = {},
  meta = {}
) {
  return {
    type: createType(namespace, "EVENTS", event, "SUBSCRIBE"),
    payload: {
      options,
    },
    meta,
  };
}

function createActionForGetPastEvents(
  namespace,
  event,
  options = {},
  meta = {}
) {
  return {
    type: createType(namespace, "GET_PAST_EVENTS"),
    payload: {
      options,
      event,
    },
    meta,
  };
}

function createActionForMethodCall(namespace, method, options = {}, meta = {}) {
  return (...args) => ({
    type: createType(namespace, "METHODS", method, "CALL"),
    payload: {
      args,
      options,
    },
    meta,
  });
}

function createActionForMethodSend(
  namespace,
  methodName,
  options = {},
  meta = {}
) {
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
        reduction.methods[member.name] = (options, meta) => ({
          call: createActionForMethodCall(
            namespace,
            member.name,
            options,
            meta
          ),
          send: createActionForMethodSend(
            namespace,
            member.name,
            options,
            meta
          ),
        });
      } else if (member.type === "event") {
        reduction.events[member.name] = {
          subscribe: (options, meta) =>
            createActionForEventSubscription(
              namespace,
              member.name,
              options,
              meta
            ),
          get: (options, meta) =>
            createActionForGetPastEvents(namespace, member.name, options, meta),
        };
      }
      return reduction;
    },
    { methods: {}, events: {} }
  );
}

export {
  createActionsForInterface,
  createActionForEventSubscription,
  createActionForGetPastEvents,
  createActionForMethodCall,
  createActionForMethodSend,
};
