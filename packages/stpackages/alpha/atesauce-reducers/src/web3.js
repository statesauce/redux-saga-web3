import { types } from 'statesauce-constants'

const initialState = {
  isLoading: false,
  instance: null,
  error: null
}

const web3Reducer = (state = initialState, { type, payload }) => {
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
