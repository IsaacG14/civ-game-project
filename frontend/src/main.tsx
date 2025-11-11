import React from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import CreateAccountPage from "./pages/CreateAccountPage.jsx";
import Hub from "./pages/Hub.jsx";
import Account from "./pages/AccountInfoPage.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);

function App()
{
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/hub" />} />
                    <Route path = "/login" element = {<LoginPage />} />
                    <Route path = "/createAccount" element = {<CreateAccountPage />} />
                    <Route path = "/hub" element = {<Hub />} />
                    <Route path = "/account" element = {<Account />} />
                    <Route path = "/leaderboard" element = {<Leaderboard />} />
                </Routes>
            </Router>
        </div>
    );
}
