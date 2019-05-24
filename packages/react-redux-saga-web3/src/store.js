import Web3 from "web3";
import {
  createStore as createReduxStore,
  applyMiddleware,
  compose,
} from "redux";
import { combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { all, fork } from "redux-saga/effects";

import { reducers, sagas } from "redux-saga-web3";

const reducer = combineReducers(reducers);
const sagaMiddleware = createSagaMiddleware({
  context: {
    web3: new Web3(),
  },
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = composeEnhancers(applyMiddleware(sagaMiddleware));

function* root() {
  yield all([...Object.values(sagas).map(saga => fork(saga))]);
}

export default function createStore(initialState = {}) {
  const store = createReduxStore(reducer, initialState, middleware);
  store.sagaTask = sagaMiddleware.run(root);
  return store;
}
