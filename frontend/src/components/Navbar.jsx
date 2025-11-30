import React from "react";

export default function Navbar({onClickButton, clickButtonText, onClickButton2, clickButton2Text, onLogoutClick}) {
    const buttonStyle = {
        background: "none",
        color: "#ffffffff",
        border: "2px solid #5f0808ff",
        borderRadius: "1px",
        padding: "10px 40px",
        marginLeft: "30px",
        fontWeight: "bold",
        cursor: "pointer",
    };

    return (
        <header style={{
            position: "fixed",
            top: 0,
            left: 0,
            //Makes it go across whole screen
            width: "100%",

            backgroundColor: "hsl(6, 55%, 15%)",
            borderBottom: "2px solid #5f0808ff",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            padding: "10px",
            gap: "90px",
      }}
      >
        <button style={buttonStyle} onClick={onClickButton}>
            {clickButtonText}
        </button>
        <button style={buttonStyle} onClick={onClickButton2}>
            {clickButton2Text}
        </button>
        <button style={buttonStyle} onClick={onLogoutClick}>
            Logout
        </button>
    </header>
    )
}