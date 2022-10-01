import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import SignUp from "./SignUp/SignUp";
import Login from "./Login/Login";
import ExpenseForm from "./Expense/ExpenseForm";
import PrivateRoute from "./PrivateRoute";

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/expense-form"
            element={
              <PrivateRoute>
                <ExpenseForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
