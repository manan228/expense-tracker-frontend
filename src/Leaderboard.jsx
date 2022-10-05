import axios from "axios";
import React, { useEffect, useState } from "react";

const Leaderboard = ({ data: { token, expenses } }) => {
  const [users, setUsers] = useState([]);
  const [userExpenses, setUserExpenses] = useState([]);

  useEffect(() => {
    try {
      const getAllUsers = async () => {
        const response = await axios.get("http://localhost:3000/all-users", {
          headers: { Authorization: token },
        });

        const users = response.data;
        users.sort((a, b) => b.totalExpense - a.totalExpense);

        setUsers(users);
      };

      getAllUsers();
    } catch (err) {
      console.log(err);
    }
  }, [token, expenses]);

  const onUserClick = async (userEmail) => {
    console.log(`on user clicked`);

    try {
      const { data } = await axios.get(
        `http://localhost:3000/get-expenses/${userEmail}`
      );

      console.log(data);
      setUserExpenses(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {users.map((user) => {
        return (
          <ul key={user.email}>
            <li onClick={() => onUserClick(user.email)}>{user.username}</li>
          </ul>
        );
      })}
      {userExpenses.length > 0 && (
        <div>
          {userExpenses.map((expenses) => {
            return (
              <div key={expenses.id}>
                {expenses.amount} - {expenses.description} - {expenses.category}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
