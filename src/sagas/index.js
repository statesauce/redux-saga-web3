import { web3Saga, initWeb3 } from './initWeb3'
import { accountsSaga, getAccounts } from './accounts'
import { contractSaga, initContract } from './contract'

export const sagas = {
  initWeb3,
  getAccounts,
  initContract
}

export {
  web3Saga,
  accountsSaga,
  contractSaga
}
