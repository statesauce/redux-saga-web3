import initialState from '../initialState'
import { types } from '../constants'

const web3Reducer = (state = initialState.web3, { type, payload }) => {
  switch (type) {
    case types.WEB3.INIT_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case types.WEB3.INIT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        instance: payload,
        error: null
      }
    case types.WEB3.INIT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload
      }
    default:
      return state
  }
}

export default web3Reducer
