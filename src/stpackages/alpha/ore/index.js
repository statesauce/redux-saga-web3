import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleWare from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { fromJS } from 'immutable'
import { combineReducers } from 'redux-immutable'
import { withWeb3InitialState, withWeb3Reducer, web3RootSaga, stateTransformer } from '../statesauce'

const immutableInitialState = fromJS(withWeb3InitialState())
const reducer = combineReducers(withWeb3Reducer())
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

export default store
