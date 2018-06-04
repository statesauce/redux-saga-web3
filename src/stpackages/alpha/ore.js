import { createStore as createReduxStore, applyMiddleware, compose, combineReducers } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleWare from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import Web3 from 'web3'

import initialState from './initialState'
import reducers from './reducers'
import { rootSaga } from './sagas'

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

export const createStore = (initialState = {}) => {
  const store = createReduxStore(reducer, initialState, middleWare)

  store.sagaTask = sagaMiddleware.run(rootSaga)
  return store
}

const store = createStore(initialState)

export {
  reducers,
  initialState
}

export default store
