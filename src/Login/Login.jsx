import axios from "axios";
import { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ForgotPassword from "../ForgotPassword";

const Login = () => {
  const [error, setError] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const navigate = useNavigate();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const onLoginClickHandler = async (e) => {
    e.preventDefault();

    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    const loginObj = {
      email,
      password,
    };

    console.log(loginObj)
    try {
      const response = await axios.post(
        "https://cors-everywhere.herokuapp.com/http://34.227.32.148:3000/login",
        loginObj
      );

      console.log(response.data.response);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/expense-form/?page=1");
      }
    } catch (err) {
      console.log(err);
      if (err.response.status === 404) {
        setError("User does not exist");
      }

      if (err.response.status === 401) {
        setError("Incorrect Password");
      }
    }
  };

  const onForgotPasswordClickHandler = () => {
    console.log(`forgotpassword clicked`);
    setForgotPassword(true);
    // return <ForgotPassword />
  };

  return (
    <>
      {forgotPassword ? (
        <ForgotPassword />
      ) : (
        <div>
          <form onSubmit={onLoginClickHandler}>
            <div>
              <label>Email</label>
              <input type="email" ref={emailInputRef} required />
            </div>
            <div>
              <label>Password</label>
              <input type="password" ref={passwordInputRef} required />
            </div>
            <button type="submit">Login</button>
          </form>
          <NavLink to="/signup">New User? SignUp</NavLink>
          <button onClick={onForgotPasswordClickHandler}>
            Forgot Password
          </button>
          {error ? <div>{error}</div> : null}
        </div>
      )}
    </>
  );
};

export default Login;
