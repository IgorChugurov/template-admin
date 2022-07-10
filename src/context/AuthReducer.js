const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "FORCE_LOGIN_START":
      return {
        user: null,
        force: true,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "FORCE_LOGIN_SUCCESS":
      return {
        user: { ...action.payload, fromAdmin: true },
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: true,
      };
    case "LOGOUT": {
      return {
        user: null,
        isFetching: false,
        error: false,
      };
    }

    default:
      return state;
  }
};

export default AuthReducer;
