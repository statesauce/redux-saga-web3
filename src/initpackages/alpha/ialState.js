const initialState = {
  web3: {
    isLoading: false,
    instance: null,
    error: null
  },
  accounts: {
    isLoading: false,
    items: [],
    default: null,
    error: null
  },
  contract: {
    isLoading: false,
    instance: null,
    error: null
  }
}

export default initialState
