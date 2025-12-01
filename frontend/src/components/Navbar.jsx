import React from "react";

export default function Navbar({onClickButton, clickButtonText, onClickButton2, clickButton2Text, onLogoutClick}) {

    return (
        <header className="navbar">
            <button className="navbar-button dark-button" onClick={onClickButton}>
                {clickButtonText}
            </button>
            <button className="navbar-button dark-button" onClick={onClickButton2}>
                {clickButton2Text}
            </button>
            <button className="navbar-button dark-button" onClick={onLogoutClick}>
                Logout
            </button>
        </header>
    )
}