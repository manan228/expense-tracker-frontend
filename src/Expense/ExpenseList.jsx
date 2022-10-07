import axios from "axios";
// import React, { useState } from "react";

const ExpenseList = ({ expenses }) => {
  console.log(expenses);

  const onExpenseDeleteClickHandler = async ({ id: expenseId }) => {
    console.log(expenseId);

    try {
      // const response = await axios.delete(
      //   "http://localhost:3000/delete-expense",
      //   {"id": 17}
      // );

      const response = await axios.delete(
        `http://localhost:3000/delete-expense/${expenseId}`
      );

      if (response.status === 200) {
        const newExpenses = expenses.filter(
          (expense) => expense.id !== expenseId
        );

        console.log(newExpenses);
        // setExpenses(newExpenses)
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
