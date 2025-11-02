import React from "react";

export default function Navbar({onAccountClick, onLeaderboardClick, onLogoutClick}) {
    return (
        <header style = {{
            position: "fixed",
            top: 0,
            left: 0,
            //Makes it go across whole screen
            width: "100%",
            backgroundColor: "#aa0e0eff",
            borderBottom: "2px solid #5f0808ff",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            padding: "10px",
            gap: "90px",
      }}
      >
        <button style = {{
            background: "none",
            color: "#ffffffff",
            border: "2px solid #5f0808ff",
            borderRadius: "1px",
            padding: "10px 40px",
            marginLeft: "30px",
            fontWeight: "bold",
            cursor: "pointer",
        }}
        onClick = {onAccountClick}
        >
            Account
        </button>
        <button style = {{
            background: "none",
            color: "#ffffffff",
            border: "2px solid #5f0808ff",
            borderRadius: "1px",
            padding: "10px 40px",
            marginLeft: "30px",
            fontWeight: "bold",
            cursor: "pointer",
        }}
        onClick = {onLeaderboardClick}
        >
            Leaderboard
        </button>
        <button style = {{
            background: "none",
            color: "#ffffffff",
            border: "2px solid #5f0808ff",
            borderRadius: "1px",
            padding: "10px 40px",
            marginLeft: "30px",
            fontWeight: "bold",
            cursor: "pointer",
        }}
        onClick = {onLogoutClick}
        >
            Logout
        </button>
    </header>
    )
}