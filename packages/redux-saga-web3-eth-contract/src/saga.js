import { call, takeEvery, put, take } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";

import { createTypesForMethodCall, createTypesForMethodSend } from "./types";
import { formatName } from "redux-saga-web3-utils";

function create(contractName, contract) {
  function getContract(options) {
    const { at } = options;
    let _contract = contract;
    if (at) {
      _contract = contract.clone();
      _contract.options.address = at;
    }

    return _contract;
  }

  return () => {
    const methods = Object.keys(contract.methods).reduce(
      (reduction, method) => {
        // web3 has duplicate instances of all methods
        if (method.slice(-2) === "()" || method.substring(0, 2) === "0x") {
          return reduction;
        }
        const CALL_TYPES = createTypesForMethodCall(contractName, method);
        const SEND_TYPES = createTypesForMethodSend(contractName, method);
        return [
          ...reduction,
          takeEvery(CALL_TYPES.CALL, function* send({
            payload: { args, options },
            meta,
          }) {
            const response = yield call(
              getContract(options).methods[method](...args).call,
              options
            );
            yield put({
              type: CALL_TYPES.SUCCESS,
              payload: response,
              meta: {
                ...meta,
                args,
                options,
              },
            });
          }),
          takeEvery(SEND_TYPES.SEND, function* send({
            payload: { args, options },
            meta,
          }) {
            const response = yield call(
              getContract(options).methods[method](...args).send,
              options
            );
            yield put({
              type: SEND_TYPES.SUCCESS,
              payload: response,
              meta: {
                ...meta,
                args,
                options,
              },
            });
          }),
        ];
      },
      []
    );

    const events = Object.keys(contract.events).reduce((reduction, event) => {
      const patternPrefix = `${formatName(contractName)}/EVENTS/${formatName(
        event
      )}`;

      function createEventChannel({ payload }) {
        const { options } = payload;
        const { provider } = options;
        let subscription;
        if (provider) {
          const newProviderContract = contract.clone();
          newProviderContract.setProvider(provider);
          subscription = newProviderContract.events[event](options);
        } else {
          subscription = contract.events[event](options);
        }

        return eventChannel(emit => {
          subscription.on("data", data => {
            emit({
              type: `${patternPrefix}/SUBSCRIBE/DATA`,
              payload: data,
              meta: {
                event,
                options,
              },
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
              meta: {
                event,
                options,
              },
            });
            emit(END);
          });

          return subscription.unsubscribe;
        });
      }

      function* watchChannel(payload) {
        const eventChannel = createEventChannel(payload);
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
        takeEvery(`${patternPrefix}/SUBSCRIBE`, ({ type, at, ...payload }) => [
          call(watchChannel, payload),
        ]),
      ];
    }, []);

    const patternPrefix = `${formatName(contractName)}/GET_PAST_EVENTS`;
    const getPastEvents = takeEvery(patternPrefix, function* getPastEvents({
      type,
      payload: { event, options },
      meta,
    }) {
      const events = yield call(
        contract.getPastEvents.bind(contract),
        event,
        options
      );

      yield put({
        type: `${patternPrefix}/SUCCESS`,
        payload: events,
        meta: {
          ...meta,
          event,
          options,
        },
      });
    });

    return [...methods, ...events, getPastEvents];
  };
}

export { create };
