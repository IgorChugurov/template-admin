const actionResultMessageReducer = (state, action) => {
  switch (action.type) {
    case "CN_SUCCESS":
      return {
        className: "success",
      };
    case "CN_ERROR":
      return {
        className: "error",
      };
    case "CN_CLEAR": {
      return {
        className: "",
      };
    }

    default:
      return state;
  }
};

export default actionResultMessageReducer;
