import { fromJS } from 'immutable'
import { initialState } from '../initialState'
import { types } from '../constants'

const defaultState = fromJS(initialState.contract)

const ContractReducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case types.INIT_CONTRACT_REQUEST:
      return state
    case types.INIT_CONTRACT_SUCCESS:
      return payload
    case types.INIT_CONTRACT_FAILURE:
      return payload
    default:
      return state
  }
}

export default ContractReducer
