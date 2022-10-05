import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Leaderboard from "../Leaderboard";
import ExpenseList from "./ExpenseList";

const loadRazorpay = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    document.body.appendChild(script);
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const ExpenseForm = () => {
  const [expenses, setExpenses] = useState([]);
  const [premiumAccount, setPremiumAccount] = useState(false);

  const expenseAmountInputRef = useRef();
  const expenseDescriptionInputRef = useRef();
  const expenseCategoryInputRef = useRef();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const response = await axios.get("http://localhost:3000/get-expenses", {
          headers: { Authorization: token },
        });

        console.log(response);
        localStorage.setItem("premium", response.data.isPremium);
        setExpenses(response.data.response);
        setPremiumAccount(response.data.isPremium);
      } catch (err) {
        console.log(err);
      }
    };

    getExpenses();
  }, [token]);

  const onExpenseFormSubmitHandler = async (e) => {
    e.preventDefault();

    const expenseAmount = expenseAmountInputRef.current.value;
    const expenseDescription = expenseDescriptionInputRef.current.value;
    const expenseCategory = expenseCategoryInputRef.current.value;

    const expenseObj = {
      amount: Number(expenseAmount),
      description: expenseDescription,
      category: expenseCategory,
    };

    // console.log(typeof expenseObj.amount);

    try {
      const response = await axios.post(
        "http://localhost:3000/add-expense",
        expenseObj,
        { headers: { Authorization: token } }
      );

      const { id, amount, description, category } = response.data;

      setExpenses([...expenses, { id, amount, description, category }]);
    } catch (err) {
      console.log(err);
    }
  };

  const onBuyPreminumClickHandler = async () => {
    try {
      const response = await axios.post("http://localhost:3000/buy-premium");

      console.log(response);

      const res = await loadRazorpay(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      console.log(res);

      const options = {
        key: "rzp_test_DXYSkf3DFazDzA",
        amount: "50000",
        currency: "INR",
        name: "Manan",
        description: "Test Transaction",
        order_id: response.data.id,
        handler: async (successResponse) => {
          console.log(successResponse);

          const orderId = successResponse.razorpay_order_id;
          const response = await axios.get(
            `http://localhost:3000/set-premium/${orderId}`,
            { headers: { Authorization: token } }
          );

          console.log(response);
          setPremiumAccount(true);
          // <SuccessPayment />;
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.open();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ backgroundColor: premiumAccount ? "grey" : null }}>
      <form onSubmit={onExpenseFormSubmitHandler}>
        <div>
          <label>Expense Amount: </label>
          <input type="number" ref={expenseAmountInputRef} required />
        </div>
        <div>
          <label>Expense Description: </label>
          <input type="text" ref={expenseDescriptionInputRef} required />
        </div>
        <div>
          <label>Expense Category: </label>
          <input
            list="expenseCategory"
            ref={expenseCategoryInputRef}
            required
          />
          <datalist id="expenseCategory">
            <option value="Petrol" />
            <option value="Movie" />
            <option value="Food" />
          </datalist>
        </div>
        <button type="submit">Add Expense</button>
      </form>
      <button onClick={onBuyPreminumClickHandler}>Buy Preminum</button>
      {expenses.length > 0 && <ExpenseList expenses={expenses} />}
      {premiumAccount && <Leaderboard data={{token, expenses}} />}
    </div>
  );
};

export default ExpenseForm;
