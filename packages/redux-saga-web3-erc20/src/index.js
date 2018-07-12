import * as actions from "./erc20/actions";
import * as selectors from "./erc20/selectors";
import ERC20reducer from "./erc20/reducer";
import saga from "./erc20/saga";

const reducer = {
  ERC20Tokens: ERC20reducer,
};

export { actions, reducer, saga, selectors };
