import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleWare from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { fromJS } from 'immutable'
import web3InitialState from './initialState'
import web3CombinedReducers, { reducers } from './reducers'
import web3RootSaga from './sagas'
import { stateTransformer } from '../util'

const immutableInitialState = fromJS(web3InitialState)
const reducer = web3CombinedReducers
const sagaMiddleware = createSagaMiddleware()
const logger = createLogger({ stateTransformer })

const middleWare = compose(applyMiddleware(
  thunkMiddleWare,
  sagaMiddleware,
  logger
))

export const configureStore = (initialState = immutableInitialState) => {
  const store = createStore(
    reducer,
    initialState,
    middleWare
  )

  store.sagaTask = sagaMiddleware.run(web3RootSaga)
  return store
}

const store = configureStore(immutableInitialState)

export {
  reducers,
  web3CombinedReducers
}

export {
  web3InitialState,
  immutableInitialState
}

export default store
