import axios from "axios";

// LOGIN API CALL
export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", userCredential);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};

// REGISTER API CALL (Optional if you use it in Register page)
export const registerCall = async (user, navigate) => {
  try {
    await axios.post("http://localhost:5000/api/auth/register", user);
    navigate("/login");
  } catch (err) {
    console.log(err);
  }
};