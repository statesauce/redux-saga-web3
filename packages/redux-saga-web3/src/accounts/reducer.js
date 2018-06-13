import ACCOUNTS from './types'

const initialState = {
  isLoading: false,
  items: null,
  error: null
}

export default (state = initialState, { type, payload, error }) => {
  switch (type) {
    case ACCOUNTS.GET_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case ACCOUNTS.GET_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: payload
      }
    case ACCOUNTS.GET_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload
      }
    default:
      return state
  }
}
