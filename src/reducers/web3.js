import { fromJS } from 'immutable'
import { initialState } from '../initialState'
import { types } from '../constants'

const defaultState = fromJS(initialState.web3)

const web3Reducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case types.WEB3.INIT_REQUEST:
      return state
    case types.WEB3.INIT_SUCCESS:
      return payload
    default:
      return state
  }
}

export default web3Reducer
