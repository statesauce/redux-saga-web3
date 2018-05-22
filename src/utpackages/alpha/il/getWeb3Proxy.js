import Web3 from 'web3'

export const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      err ? reject(err) : resolve(res)
    })
  )

export const proxiedWeb3Handler = {
  get (target, name) {
    const inner = target[name]
    if (inner instanceof Function) {
      return (...args) => promisify(cb => inner(...args, cb))
    } else if (typeof inner === 'object') {
      return new Proxy(inner, proxiedWeb3Handler)
    } else {
      return inner
    }
  }
}

const getWeb3Proxy = (rpcAddr = 'http://localhost:8545') => {
  let web3 = window.web3
  web3 = (typeof web3 !== 'undefined')
    ? new Web3(web3.currentProvider)
    : new Web3(new Web3.providers.HttpProvider(rpcAddr))

  const proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler)
  return proxiedWeb3
}

export default getWeb3Proxy
