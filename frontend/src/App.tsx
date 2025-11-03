import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import Hub from "./pages/Hub.jsx";
import Account from "./pages/AccountInfoPage.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";

export default function App()
{
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/hub" />} />
                    <Route path = "/login" element = {<LoginPage />} />
                    <Route path = "/createAccount" element = {<CreateAccount />} />
                    <Route path = "/hub" element = {<Hub />} />
                    <Route path = "/account" element = {<Account />} />
                    <Route path = "/leaderboard" element = {<Leaderboard />} />
                </Routes>
            </Router>
        </div>
  );
}
