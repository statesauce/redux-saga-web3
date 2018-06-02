import { fromJS } from 'immutable'
import { initialState } from '../initialState'
import { types } from '../constants'

const defaultState = fromJS(initialState.contract)

const ContractReducer = (state = defaultState, { type, payload }) => {
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
