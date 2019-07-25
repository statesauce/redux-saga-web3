import { call, takeEvery, put, take, select } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";
import { selectors as web3Selectors } from "@statesauce/web3";

import {
  createTypesForMethodCall,
  createTypesForMethodSend,
  createTypesForEventSubscribe,
  createTypesForEventGet,
} from "./types";

export function getContract(contract, options) {
  const { at, provider } = options;
  const _contract = contract.clone();

  if (at) _contract.options.address = at;
  if (provider) _contract.setProvider(provider);

  return _contract;
}

export function createSubscriptionEventChannel(
  SUBSCRIBE_TYPES,
  contract,
  event,
  payload,
  meta
) {
  const { options } = payload;

  const _contract = getContract(contract, options);
  if (!options.at) options.at = _contract.options.address;
  const subscription = _contract.events[event](options);

  return eventChannel(emit => {
    subscription.on("data", data =>
      emit({
        type: SUBSCRIBE_TYPES.DATA,
        payload: data,
        meta: {
          ...meta,
          event,
          options,
        },
      })
    );
    subscription.on("changed", data =>
      emit({
        type: SUBSCRIBE_TYPES.CHANGED,
        payload: data,
      })
    );
    subscription.on("error", data => {
      emit({
        type: SUBSCRIBE_TYPES.ERROR,
        payload: data,
        meta: {
          event,
          options,
        },
      });
      emit(END);
    });

    return () => {}; // subscription.unsubscribe;
  });
}

export function* watchSubscriptionChannel(
  SUBSCRIBE_TYPES,
  contract,
  event,
  { payload, meta }
) {
  const subscriptionEventChannel = createSubscriptionEventChannel(
    SUBSCRIBE_TYPES,
    contract,
    event,
    payload,
    meta
  );
  try {
    while (true) {
      const eventAction = yield take(subscriptionEventChannel);
      yield put(eventAction);
    }
  } finally {
    subscriptionEventChannel.close();
  }
}

export function createSagaForEventSubscribe(SUBSCRIBE_TYPES, contract, event) {
  return [
    takeEvery(SUBSCRIBE_TYPES.SUBSCRIBE, ({ type, ...payload }) => [
      call(watchSubscriptionChannel, SUBSCRIBE_TYPES, contract, event, payload),
    ]),
  ];
}

export function createSagaForGetPastEvents(GET_TYPES, contract) {
  return [
    takeEvery(GET_TYPES.GET, function* getPastEvents({
      payload: { event, options },
      meta,
    }) {
      try {
        const _contract = getContract(contract, options);
        const events = yield call(
          _contract.getPastEvents.bind(_contract),
          event,
          options
        );
        yield put({
          type: GET_TYPES.SUCCESS,
          payload: events,
          meta: {
            ...meta,
            event,
            options,
          },
        });
      } catch (err) {
        yield put({
          type: GET_TYPES.ERROR,
          payload: err,
          meta: {
            ...meta,
            event,
            options,
          },
          error: true,
        });
      }
    }),
  ];
}

export function createSagasForEvents(namespace, contract, EVENT_TYPES) {
  EVENT_TYPES.reduce((reduction, event) => {
    const SUBSCRIBE_TYPES = createTypesForEventSubscribe(namespace, event);
    const GET_TYPES = createTypesForEventGet(namespace, event);

    return [
      ...reduction,
      ...createSagaForEventSubscribe(SUBSCRIBE_TYPES, contract, event),
      ...createSagaForGetPastEvents(GET_TYPES, contract),
    ];
  }, []);
}

export function createSagaForMethodCall(CALL_TYPES, contract, method) {
  takeEvery(CALL_TYPES.CALL, function* send({
    payload: { args, options },
    meta,
  }) {
    const response = yield call(
      getContract(contract, options).methods[method](...args).call,
      options
    );
    try {
      yield put({
        type: CALL_TYPES.SUCCESS,
        payload: response,
        meta: {
          ...meta,
          args,
          options,
        },
      });
    } catch (error) {
      yield put({
        type: CALL_TYPES.ERROR,
        payload: error,
        error: true,
      });
    }
  });
}

export function createTransactionEventChannel(
  SEND_TYPES,
  contract,
  method,
  args,
  options,
  meta
) {
  const emitter = getContract(contract, options)
    .methods[method](...args)
    .send(options);

  return eventChannel(emit => {
    emitter.on("transactionHash", data => {
      emit({
        type: SEND_TYPES.TRANSACTION_HASH,
        payload: data,
        meta: {
          ...meta,
          args,
          options,
        },
      });
    });
    emitter.on("receipt", data =>
      emit({
        type: SEND_TYPES.RECEIPT,
        payload: data,
        meta: {
          ...meta,
          args,
          options,
        },
      })
    );
    emitter.on("confirmation", data =>
      emit({
        type: SEND_TYPES.CONFIRMATION,
        payload: data,
        meta: {
          ...meta,
          args,
          options,
        },
      })
    );
    emitter.on("error", data => {
      emit({
        type: SEND_TYPES.ERROR,
        payload: {
          name: data.name,
          message: data.message,
        },
        meta: {
          ...meta,
          args,
          options,
        },
      });
      emit(END);
    });

    return () => {};
  });
}

export function createSagaForMethodSend(
  SEND_TYPES,
  contract,
  method,
  accountPath = ""
) {
  takeEvery(SEND_TYPES.SEND, function* watchTransactionChannel({
    payload,
    meta,
  }) {
    const { args, options } = payload;

    if (!options.from) {
      const account = yield select(
        web3Selectors.accounts.selectAccounts,
        accountPath
      )[0];
      options.from = account;
    }

    const transactionEventChannel = createTransactionEventChannel(
      SEND_TYPES,
      contract,
      method,
      args,
      options,
      meta
    );

    try {
      while (true) {
        const event = yield take(transactionEventChannel);
        yield put(event);
      }
    } finally {
      transactionEventChannel.close();
    }
  });
}

export function createSagasForMethods(
  METHOD_TYPES,
  contract,
  namespace,
  accountPath = ""
) {
  const methods = METHOD_TYPES.reduce((reduction, method) => {
    // web3 has duplicate instances of all methods
    if (method.slice(-2) === "()" || method.substring(0, 2) === "0x") {
      return reduction;
    }
    const CALL_TYPES = createTypesForMethodCall(namespace, method);
    const SEND_TYPES = createTypesForMethodSend(namespace, method, accountPath);
    return [
      ...reduction,
      createSagaForMethodCall(CALL_TYPES, contract, method),
      createSagaForMethodSend(SEND_TYPES, contract, method),
    ];
  }, []);
  return methods;
}

export function createSagasForInterface(
  namespace,
  contract,
  METHOD_TYPES,
  EVENT_TYPES,
  accountPath = ""
) {
  return () => {
    const methods = createSagasForMethods(
      namespace,
      contract,
      METHOD_TYPES,
      accountPath
    );
    const events = createSagasForEvents(namespace, contract, EVENT_TYPES);

    return [...methods, ...events];
  };
}
