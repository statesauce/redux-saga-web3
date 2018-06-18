import { types } from 'redux-web3-constants'

const initialState = {
  isLoading: false,
  items: [],
  default: null,
  error: null
}

const accountsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.ACCOUNTS.GET_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case types.ACCOUNTS.GET_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: payload,
        default: payload[0],
        error: null
      }
    case types.ACCOUNTS.GET_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload
      }
    default:
      return state
  }
}

export default accountsReducer
