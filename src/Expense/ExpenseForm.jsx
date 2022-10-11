import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import DownloadedFiles from "../DownloadedFiles";
import ExpenseAnalysis from "../ExpenseAnalysis";
import Leaderboard from "../Leaderboard";
import Pagination from "../Pagination";
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

let paginationData = {};

const ExpenseForm = () => {
  console.log(`inside expense Form`);
  const [expenses, setExpenses] = useState([]);
  const [premiumAccount, setPremiumAccount] = useState(false);
  const [url, setUrl] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page");

  console.log(page);

  const expenseAmountInputRef = useRef();
  const expenseDescriptionInputRef = useRef();
  const expenseCategoryInputRef = useRef();
  // const rowsPerPageRef = useRef();
  // console.log(rowsPerPageRef.current.value)

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getExpenses = async () => {
      console.log(`use effect rows per page`);
      try {
        const response = await axios.get(
          `https://cors-everywhere.herokuapp.com/http://52.54.29.221:3000/get-expenses/?page=${page}`,
          {
            headers: { Authorization: token, itemsPerPage: rowsPerPage },
          }
        );

        console.log(response);
        localStorage.setItem("premium", response.data.isPremium);

        paginationData = response.data.paginationData;
        setExpenses(response.data.response);
        setPremiumAccount(response.data.isPremium);
      } catch (err) {
        console.log(err);
      }
    };

    getExpenses();
  }, [token, page, rowsPerPage]);

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

    try {
      const response = await axios.post(
        "https://cors-everywhere.herokuapp.com/http://52.54.29.221:3000/add-expense",
        expenseObj,
        { headers: { Authorization: token } }
      );

      console.log(response)
      // const { id, amount, description, category } = response.data;

      const response1 = await axios.get(
        `https://cors-everywhere.herokuapp.com/http://52.54.29.221:3000/get-expenses/?page=${page}`,
        {
          headers: { Authorization: token, itemsPerPage: rowsPerPage },
        }
      );

      setExpenses(response1.data.response);
    } catch (err) {
      console.log(err);
    }
  };

  // const finalExpenses = (id, amount, description, category) => {
  //   setExpenses([...expenses, { id, amount, description, category }]);
  // };

  const onBuyPreminumClickHandler = async () => {
    try {
      const response = await axios.post("https://cors-everywhere.herokuapp.com/http://52.54.29.221:3000/buy-premium");

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
            `https://cors-everywhere.herokuapp.com/http://52.54.29.221:3000/set-premium/${orderId}`,
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

  const onDownloadExpenseClickHandler = async () => {
    console.log(`download expense clicked`);
    console.log(token);
    try {
      const response = await axios.get("https://cors-everywhere.herokuapp.com/http://52.54.29.221:3000/download", {
        headers: { Authorization: token },
      });

      console.log(response.data);
      setUrl(response.data);
      window.open(response.data, "_blank");
    } catch (err) {
      console.log(err);
    }
  };

  const onRowPerPageChange = (e) => {
    console.log(`called rows ${e.target.value}`);
    // console.log(rowsPerPageRef.current.value);
    setRowsPerPage(e.target.value);
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
      <button
        onClick={onDownloadExpenseClickHandler}
        disabled={!premiumAccount}
      >
        Download Expenses
      </button>
      <label>Rows per page</label>
      <select onChange={onRowPerPageChange}>
        <option>5</option>
        <option>10</option>
        <option>15</option>
      </select>
      {premiumAccount ? (
        <ExpenseAnalysis expenses={expenses} />
      ) : (
        expenses.length > 0 && <ExpenseList expenses={expenses} />
      )}
      <Pagination paginationData={paginationData} />
      {premiumAccount && <Leaderboard data={{ token, expenses }} />}
      {premiumAccount && <DownloadedFiles data={{ token, url }} />}
    </div>
  );
};

export default ExpenseForm;
