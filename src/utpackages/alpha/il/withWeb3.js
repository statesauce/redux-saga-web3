import { fromJS } from 'immutable'

import web3InitialState from '../initialState'
import { reducers as web3Reducers } from '../reducers'

export const withWeb3InitialState = (myAppState = null) => {
  return myAppState ? {
    ...web3InitialState,
    myAppState
  } : web3InitialState
}

export const withWeb3Reducer = (myAppReducers = null) => {
  return myAppReducers ? {
    ...web3Reducers,
    myAppReducers
  } : web3Reducers
}

// IMMUTABLE
export const withWeb3InitialStateImmutable = myAppState => fromJS(withWeb3InitialState(myAppState))

export const stateTransformer = state => state.toJS()
