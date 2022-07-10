import axios from "axios";

export const loginCall = async (userCredential, dispatchUser) => {
  dispatchUser({ type: "LOGIN_START" });
  try {
    const res = await axios.post("/api/auth/signin", userCredential);
    dispatchUser({ type: "LOGIN_SUCCESS", payload: res.data });
    //navigate("/");
  } catch (err) {
    console.log(err);
    dispatchUser({ type: "LOGIN_FAILURE", payload: err });
  }
};
