/* eslint-disable no-param-reassign */
import { isSendable } from "./util";
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

function createActionsForMapping(namespace, event, options = {}, meta = {}) {
  return {
    type: createType(namespace, "MAPPING", event, "INIT"),
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

function createActionsForMethod(namespace, method, options, meta) {
  if (!isSendable(method)) {
    return {
      call: createActionForMethodCall(namespace, method.name, options, meta),
    };
  }
  return {
    call: createActionForMethodCall(namespace, method.name, options, meta),
    send: createActionForMethodSend(namespace, method.name, options, meta),
  };
}

function createActionsForAttachedMethod(namespace, method, options, meta) {
  return {
    call: createActionForMethodCall(namespace, method, options, meta),
    send: createActionForMethodSend(namespace, method, options, meta),
  };
}

function createActionsForInterface(namespace, abi) {
  return abi.reduce(
    (reduction, member) => {
      if (member.type === "function") {
        reduction.methods[member.name] = (options, meta) =>
          createActionsForMethod(namespace, member, options, meta);
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
  createActionsForMapping,
  createActionsForMethod,
  createActionsForAttachedMethod,
  createActionForMethodCall,
  createActionForMethodSend,
};
