import { formatName } from "redux-saga-web3-utils";

import { createType } from "./types";

function createActionForEventSubscribe(
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

function createActionForEventGet(namespace, event, options = {}, meta = {}) {
  return {
    type: createType(namespace, "EVENTS", event, "GET"),
    payload: {
      options,
      event,
    },
    meta,
  };
}

function createActionsForEvent(namespace, event) {
  return {
    subscribe: (options, meta) =>
      createActionForEventSubscribe(namespace, event, options, meta),
    get: (options, meta) =>
      createActionForEventGet(namespace, event, options, meta),
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

function createActionsForMethod(namespace, methodName, options, meta) {
  return {
    call: createActionForMethodCall(namespace, methodName, options, meta),
    send: createActionForMethodSend(namespace, methodName, options, meta),
    reduce: (fn, initialValue) => ({
      call: createActionForMethodCall(
        namespace,
        methodName,
        { ...options, reducer: [fn, initialValue] },
        meta
      ),
      send: createActionForMethodSend(
        namespace,
        methodName,
        { ...options, reducer: [fn, initialValue] },
        meta
      ),
    }),
  };
}

function createActionsForInterface(namespace, abi) {
  return abi.reduce(
    (reduction, member) => {
      if (member.type === "function") {
        reduction.methods[member.name] = (options, meta) =>
          createActionsForMethod(namespace, member.name, options, meta);
      } else if (member.type === "event") {
        reduction.events[member.name] = createActionsForEvent(
          namespace,
          member.name
        );
      }
      return reduction;
    },
    { methods: {}, events: {} }
  );
}

export {
  createActionsForInterface,
  createActionsForEvent,
  createActionForEventSubscribe,
  createActionForEventGet,
  createActionsForMethod,
  createActionForMethodCall,
  createActionForMethodSend,
};
