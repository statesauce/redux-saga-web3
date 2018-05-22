const WEB3 = 'web3'
const ETH = 'eth'
const CURRENT_PROVIDER = 'currentProvider'
const PUBLIC_CONFIG_STORE = 'publicConfigStore'
const STATE = '_state'

// WEB3 / saga selectors
export const web3 = state => state.get(WEB3)
export const web3Eth = state => state.get(WEB3)[ETH]
export const defaultAccount = state => state.get(WEB3)[ETH].defaultAccount
export const getAccounts = state => state.get(WEB3)[ETH].getAccounts
export const getState = state => state.get(WEB3)[CURRENT_PROVIDER][PUBLIC_CONFIG_STORE].getState
export const selectedAddress = state => state.get(WEB3)[CURRENT_PROVIDER][PUBLIC_CONFIG_STORE][STATE].selectedAddress
