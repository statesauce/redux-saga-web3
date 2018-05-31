import { call, takeEvery, put, take } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";

import { formatName } from "./utils";

function create(contractName, contract) {
  return () => {
    const methods = Object.keys(contract.methods).reduce(
      (reduction, method) => {
        // web3 has duplicate instances of all methods
        if (method.slice(-2) === "()" || method.substring(0, 2) === "0x") {
          return reduction;
        }
        const patternPrefix = `${formatName(contractName)}/METHODS/${formatName(
          method
        )}`;
        return [
          ...reduction,
          takeEvery(`${patternPrefix}_CALL`, ({}) => [
            call(contract.methods[method].call),
            put({ type: `${patternPrefix}_CALL/SUCCESS` }),
          ]),
        ];
      },
      []
    );

    const events = Object.keys(contract.events).reduce((reduction, event) => {
      const patternPrefix = `${formatName(contractName)}/EVENTS/${formatName(
        event
      )}`;

      function createEventChannel(options = {}) {
        const subscription = contract.events[event](options);
        return eventChannel(emit => {
          subscription.on("data", data => {
            emit({
              type: `${patternPrefix}/SUBSCRIBE/DATA`,
              payload: data,
            });
          });
          subscription.on("changed", data =>
            emit({
              type: `${patternPrefix}/SUBSCRIBE/CHANGED`,
              payload: data,
            })
          );
          subscription.on("error", data => {
            emit({
              type: `${patternPrefix}/SUBSCRIBE/ERROR`,
              payload: data,
            });
            emit(END);
          });

          return subscription.unsubscribe;
        });
      }

      function* watchChannel(options) {
        const eventChannel = createEventChannel(options);
        try {
          while (true) {
            var event = yield take(eventChannel);
            yield put(event);
          }
        } finally {
          eventChannel.close();
        }
      }

      return [
        ...reduction,
        takeEvery(`${patternPrefix}/SUBSCRIBE`, ({ type, at, ...options }) => [
          call(watchChannel, options),
        ]),
      ];
    }, []);

    const patternPrefix = `${formatName(contractName)}/GET_PAST_EVENTS`;
    const getPastEvents = takeEvery(patternPrefix, function* getPastEvents({
      type,
      event,
      ...options
    }) {
      const events = yield call(
        contract.getPastEvents.bind(contract),
        event,
        options
      );

      yield put({ type: `${patternPrefix}/SUCCESS`, events });
    });

    return [...methods, ...events, getPastEvents];
  };
}

export { create };
