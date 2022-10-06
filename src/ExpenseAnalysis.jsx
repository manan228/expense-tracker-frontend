import React, { useState } from "react";
import ExpenseList from "./Expense/ExpenseList";

const ExpenseAnalysis = ({ expenses: propsExpenses }) => {
  const [sortExpenses, setSortExpenses] = useState(propsExpenses);

  // console.log(propsExpenses)
  // const [expenses, setExpenses] = useState(propsExpenses)
  console.log(sortExpenses)

  const systemDate = new Date();

  const onDailyClickHandler = () => {
    console.log(`daily click handler`);

    const DailyExpenses = propsExpenses.filter(
      (expense) =>
        new Date(expense.createdAt).getDate() === systemDate.getDate()
    );
    console.log(DailyExpenses);
    setSortExpenses(DailyExpenses);
  };

  const onWeeklyClickHandler = () => {
    console.log(`weekly click handler`);

    setSortExpenses(propsExpenses);
  };

  const onMonthlyClickHandler = () => {
    console.log(`monthly click handler`);

    const MonthlyExpenses = propsExpenses.filter(
      (expense) =>
        new Date(expense.createdAt).getMonth() === systemDate.getMonth()
    );
    console.log(MonthlyExpenses);
    setSortExpenses(MonthlyExpenses);
  };
  return (
    <div>
      <button onClick={onDailyClickHandler}>Daily</button>
      <button onClick={onWeeklyClickHandler}>Weekly</button>
      <button onClick={onMonthlyClickHandler}>Monthly</button>
      {sortExpenses.length > 0 && <ExpenseList expenses={sortExpenses} />}
    </div>
  );
};

export default ExpenseAnalysis;
