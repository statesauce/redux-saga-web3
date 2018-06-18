import { types } from 'redux-web3-constants'

const initialState = {
  isLoading: false,
  instance: null,
  error: null
}

const ContractReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.CONTRACT.INIT_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case types.CONTRACT.INIT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        instance: payload,
        error: null
      }
    case types.CONTRACT.INIT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload
      }
    default:
      return state
  }
}

export default ContractReducer