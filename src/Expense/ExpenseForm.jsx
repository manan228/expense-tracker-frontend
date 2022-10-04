import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import SuccessPayment from "../SuccessPayment";
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
  const [premium, setPremium] = useState(false);

  console.log(premium)
  console.log(expenses);
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
        setExpenses(response.data.response);
        setPremium(response.data.isPremium)
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
      amount: expenseAmount,
      description: expenseDescription,
      category: expenseCategory,
    };

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
          setPremium(true);
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
    <div style={{ backgroundColor: premium ? "grey" : null }}>
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
    </div>
  );
};

export default ExpenseForm;
