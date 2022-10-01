import axios from "axios";
import { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState(false);

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

    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        loginObj
      );

      if (response.data.success) {
        localStorage.setItem("success", response.data.success);
        navigate("/expense-form");
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

  return (
    <>
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
      {error ? <div>{error}</div> : null}
    </>
  );
};

export default Login;
