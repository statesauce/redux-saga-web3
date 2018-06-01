import { createStore as createReduxStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleWare from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { combineReducers } from 'redux-immutable'
import { fromJS } from 'immutable'

import web3InitialState from './initialState'
import reducers from './reducers'
import web3RootSaga from './sagas'
import { stateTransformer } from '../util'

const immutableInitialState = fromJS(web3InitialState)
const reducer = combineReducers(reducers)
const sagaMiddleware = createSagaMiddleware()
const logger = createLogger({ stateTransformer })

const middleWare = compose(applyMiddleware(
  thunkMiddleWare,
  sagaMiddleware,
  logger
))

export const createStore = (initialState = immutableInitialState) => {
  const store = createReduxStore(reducer, initialState, middleWare)

  store.sagaTask = sagaMiddleware.run(web3RootSaga)
  return store
}

const store = createStore(immutableInitialState)

export {
  reducers,
  web3InitialState,
  immutableInitialState
}

export default store
