import axios from "axios";
import React from "react";

const ForgotPassword = () => {
  console.log(`inside forgot password`);

  const onSubmitClickHandler = async (e) => {
    e.preventDefault();

    try {

        const response = await axios.post("https://cors-everywhere.herokuapp.com/http://52.54.29.221:3000/password/forgotpassword")

        console.log(response)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={onSubmitClickHandler}>
      <label>Email</label>
      <input type="email" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ForgotPassword;
