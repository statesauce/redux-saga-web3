import { call, takeEvery, put, take, select } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";
import { selectors as web3Selectors } from "redux-saga-web3";
import { formatName } from "redux-saga-web3-utils";

import {
  createType,
  createTypesForMethodCall,
  createTypesForMethodSend,
  createTypesForEventSubscribe,
  createTypesForEventGet,
} from "./types";

function create(namespace, contract) {
  function getContract(options) {
    const { at, provider } = options;
    let _contract = contract.clone();

    if (at) {
      _contract.options.address = at;
    }

    if (provider) {
      _contract.setProvider(provider);
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
        const CALL_TYPES = createTypesForMethodCall(namespace, method);
        const SEND_TYPES = createTypesForMethodSend(namespace, method);
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
          takeEvery(SEND_TYPES.SEND, function* watchTransactionChannel({
            payload,
            meta,
          }) {
            const { args, options } = payload;
            if (!options.from) {
              const account = yield select(
                web3Selectors.accounts.selectAccounts
              );
              options.from = account.get(0);
            }

            function createTransactionEventChannel(args, options, meta) {
              const emitter = getContract(options)
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
                  // debugger
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

            const transactionEventChannel = createTransactionEventChannel(
              args,
              options,
              meta
            );

            try {
              while (true) {
                var event = yield take(transactionEventChannel);
                yield put(event);
              }
            } finally {
              transactionEventChannel.close();
            }
          }),
        ];
      },
      []
    );

    const events = Object.keys(contract.events).reduce((reduction, event) => {
      const SUBSCRIBE_TYPES = createTypesForEventSubscribe(namespace, event);
      const GET_TYPES = createTypesForEventGet(namespace, event);
      function createSubscriptionEventChannel(payload, meta) {
        const { at, options } = payload;
        let subscription;

        const _contract = getContract(options);
        subscription = _contract.events[event](options);

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

          return () => {}; //subscription.unsubscribe;
        });
      }

      function* watchSubscriptionChannel({ payload, meta }) {
        const subscriptionEventChannel = createSubscriptionEventChannel(
          payload,
          meta
        );
        try {
          while (true) {
            var event = yield take(subscriptionEventChannel);
            yield put(event);
          }
        } finally {
          subscriptionEventChannel.close();
        }
      }

      return [
        ...reduction,
        takeEvery(SUBSCRIBE_TYPES.SUBSCRIBE, ({ type, ...payload }) => [
          call(watchSubscriptionChannel, payload),
        ]),
        takeEvery(GET_TYPES.GET, function* getPastEvents({
          type,
          payload: { event, options },
          meta,
        }) {
          try {
            const _contract = getContract(options);
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
    }, []);

    return [...methods, ...events];
  };
}

export { create };
