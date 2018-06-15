import * as actions from "./erc721/actions";
import * as selectors from "./erc721/selectors";
import ERC721reducer from "./erc721/reducer";
import saga from "./erc721/saga";

const reducer = {
  ERC721Tokens: ERC721reducer,
};

export { actions, reducer, saga, selectors };
