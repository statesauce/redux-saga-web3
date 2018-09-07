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

import { createSelectorForMethod } from "./selectors";

function create(namespace, contract) {
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

            const action = {
              type: CALL_TYPES.SUCCESS,
              payload: response,
              meta: {
                ...meta,
                args,
                options,
              },
            };

            yield put(action);
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
                  emit({
                    type: SEND_TYPES.ERROR,
                    payload: data,
                    meta: {
                      ...meta,
                      event,
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
      function createSubscriptionEventChannel({ payload }) {
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
          subscription.on("data", data =>
            emit({
              type: SUBSCRIBE_TYPES.DATA,
              payload: data,
              meta: {
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

      function* watchSubscriptionChannel(payload) {
        const subscriptionEventChannel = createSubscriptionEventChannel(
          payload
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
        takeEvery(SUBSCRIBE_TYPES.SUBSCRIBE, ({ type, at, ...payload }) => [
          call(watchSubscriptionChannel, payload),
        ]),
        takeEvery(GET_TYPES.GET, function* getPastEvents({
          type,
          payload: { event, options },
          meta,
        }) {
          try {
            const events = yield call(
              contract.getPastEvents.bind(contract),
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
