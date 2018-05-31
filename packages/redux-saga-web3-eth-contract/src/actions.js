import { formatName } from "./utils";

function createEventSubscription(contractName, eventName, options = {}) {
  return {
    type: `${formatName(contractName)}/EVENTS/${formatName(
      eventName
    )}/SUBSCRIBE`,
    ...options,
  };
}

function getPastEvents(contractName, event, options = {}) {
  return {
    type: `${formatName(contractName)}/GET_PAST_EVENTS`,
    event,
    ...options,
  };
}

export { createEventSubscription, getPastEvents };
