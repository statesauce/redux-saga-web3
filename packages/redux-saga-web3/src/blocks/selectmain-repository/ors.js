const getLatestBlockHeader = state => state.blocks && state.blocks.items ? state.blocks.items : null;

export default {
  getLatestBlockHeader,
};
