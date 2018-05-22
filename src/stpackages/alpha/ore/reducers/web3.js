import { fromJS } from 'immutable'
import { initialState } from '../initialState'
import { types } from '../constants'

const defaultState = fromJS(initialState.web3)

const web3Reducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case types.INIT_WEB3_REQUEST:
      return state
    case types.INIT_WEB3_SUCCESS:
      return payload
    default:
      return state
  }
}

export default web3Reducer
