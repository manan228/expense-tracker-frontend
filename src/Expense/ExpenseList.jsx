import axios from "axios";
import { useEffect, useState } from "react";
// import React, { useState } from "react";

const ExpenseList = ({ expenses: propExpenses }) => {
  console.log(propExpenses);

  const [expenses, setExpenses] = useState(propExpenses);

  useEffect(() => {
    setExpenses(propExpenses)
  }, [propExpenses])

  const onExpenseDeleteClickHandler = async ({ id: expenseId }) => {
    console.log(expenseId);

    try {
      const response = await axios.delete(
        `http://34.227.32.148:3000/delete-expense/${expenseId}`
      );

      console.log(response);

      if (response.status === 200) {
        const newExpenses = expenses.filter(
          (expense) => expense.id !== expenseId
        );

        console.log(newExpenses);
        setExpenses(newExpenses)
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {console.log("hiii")}
      {expenses.map((expense) => {
        return (
          <div key={expense.id}>
            {expense.amount} - {expense.description} - {expense.category}
            <button onClick={() => onExpenseDeleteClickHandler(expense)}>
              Delete
            </button>
          </div>
        );
      })}
    </>
  );
};

export default ExpenseList;
