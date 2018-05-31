const initialState = {
  isLoading: false,
  items: null,
  error: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "GET":
      return {
        ...state,
        isLoading: true,
      };
      return state;
  }
};
