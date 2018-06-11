export const promisify = inner =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      err ? reject(err) : resolve(res);
    })
  );

export const proxiedWeb3Handler = {
  get(target, name) {
    const inner = target[name];
    if (inner instanceof Function) {
      return (...args) => promisify(cb => inner(...args, cb));
    } else if (typeof inner === "object") {
      return new Proxy(inner, proxiedWeb3Handler);
    } else {
      return inner;
    }
  }
};
