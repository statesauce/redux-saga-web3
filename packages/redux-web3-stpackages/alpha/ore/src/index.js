import reducers from 'redux-web3-reducers'
import { rootSaga } from 'redux-web3-sagas'

import { createStore as createReduxStore, applyMiddleware, compose, combineReducers } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import thunkMiddleWare from 'redux-thunk'
import Web3 from 'web3'

const reducer = combineReducers(reducers)
const sagaMiddleware = createSagaMiddleware({
  context: {
    web3: new Web3()
  }
})
const logger = createLogger()

const middleWare = compose(applyMiddleware(
  thunkMiddleWare,
  sagaMiddleware,
  logger
))

const createStore = (initialState = {}) => {
  const store = createReduxStore(reducer, initialState, middleWare)

  store.sagaTask = sagaMiddleware.run(rootSaga)
  return store
}

const initialState = {
  web3: {
    isLoading: false,
    instance: null,
    error: null
  },
  accounts: {
    isLoading: false,
    items: [],
    default: null,
    error: null
  },
  contract: {
    isLoading: false,
    instance: null,
    error: null
  }
}

const store = createStore(initialState)

export {
  reducers,
  createStore
}

export default store
