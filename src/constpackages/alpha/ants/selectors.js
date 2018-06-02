const WEB3 = 'web3'
const ETH = 'eth'
const CURRENT_PROVIDER = 'currentProvider'
const PUBLIC_CONFIG_STORE = 'publicConfigStore'
const STATE = '_state'

const DEFAULT_ACCOUNT = 'defaultAccount'
const GET_ACCOUNTS = 'getAccounts'
const GET_STATE = 'getState'
const SELECTED_ADDRESS = 'selectedAddress'
const ACCOUNTS = 'accounts'
const CONTRACT = 'contract'

// WEB3 / saga selectors
export const web3 = state => state.get(WEB3)
export const web3Eth = state => state.get(WEB3)[ETH]
export const defaultAccount = state => state.get(WEB3)[ETH][DEFAULT_ACCOUNT]
export const getAccounts = state => state.get(WEB3)[ETH][GET_ACCOUNTS]
export const getState = state => state.get(WEB3)[CURRENT_PROVIDER][PUBLIC_CONFIG_STORE][GET_STATE]
export const selectedAddress = state => state.get(WEB3)[CURRENT_PROVIDER][PUBLIC_CONFIG_STORE][STATE][SELECTED_ADDRESS]

// storeSelectors
export const getAccountsFromStore = state => state.get(ACCOUNTS)
export const getContract = state => state.get(CONTRACT)
export const fromStore = {
  getAccountsFromStore,
  getContract
}
