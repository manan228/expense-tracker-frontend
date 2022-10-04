import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ExpenseList from "./ExpenseList";

const ExpenseForm = () => {
  const [expenses, setExpenses] = useState([]);

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

        setExpenses(response.data);
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

  return (
    <>
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
      <ExpenseList expenses={expenses} />
    </>
  );
};

export default ExpenseForm;
