import { fromJS } from 'immutable'

import web3InitialState from '../store/initialState'
import { reducers as web3Reducers } from '../store/reducers'

export const withWeb3InitialState = (myAppState = null) => {
  return myAppState ? Object.assign({}, web3InitialState, myAppState) : web3InitialState
}

export const withWeb3Reducer = (myAppReducers = null) => {
  Object.assign({}, web3Reducers, myAppReducers)
}

// IMMUTABLE
export const withWeb3InitialStateImmutable = myAppState => fromJS(withWeb3InitialState(myAppState))

export const stateTransformer = state => state.toJS()
