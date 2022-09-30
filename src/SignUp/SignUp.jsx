import axios from "axios";
import React, { useRef, useState } from "react";

const SignUp = () => {
  const [error, setError] = useState(false);

  const usernameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const onSignUpFormClickHandler = async (e) => {
    e.preventDefault();

    const userName = usernameInputRef.current.value;
    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    const userObj = {
      userName,
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/add-user",
        userObj
      );

      console.log(response);
    } catch (err) {
      if (err.response.status === 422) {
        console.log(`error`);
        setError(true);
      }
    }
  };

  return (
    <>
    <form onSubmit={onSignUpFormClickHandler}>
      <div>
        <label>Username: </label>
        <input type="text" ref={usernameInputRef} required />
      </div>
      <div>
        <label>Email: </label>
        <input type="email" ref={emailInputRef} required />
      </div>
      <div>
        <label>Password: </label>
        <input type="password" ref={passwordInputRef} required />
      </div>
      <button type="submit">Sign up</button>
    </form> 
    {error ? <div>User Already exist</div> : null}
    </>
  );
};

export default SignUp;
