import { useState } from "react";
import Popup from "./Popup";
import TextInput from "./TextInput";

type JoinPrivateGamePopupProps = {
  close: () => void;
};

export default function JoinPrivateGamePopup(props: JoinPrivateGamePopupProps) {
  const [inviteCode, setInviteCode] = useState("");

  async function submit() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/join-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          invite_code: inviteCode
        }),
      });

      if (!res.ok) {
        console.error("Join game failed:", await res.text());
        return;
      }

      console.log("Joined game:", await res.json());
      props.close();
    } 
    catch (err) {
      console.error("Error joining game:", err);
    }
  }

  return (
    <Popup
      id="join-private-game-popup"
      title="JOIN GAME"
      submitText="Join"
      submit={submit}
      close={props.close}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <TextInput
          label="Invite Code"
          id="invite-code"
          value={inviteCode}
          setValue={(v: string) => {
            if (v.length <= 10) setInviteCode(v);
        }}
          onEnterPress={submit}
        />

        <small style= {{ color: "var(--text-light)" }}>
            Enter the invite code given to you (max 10 characters)
        </small>
      </div>
    </Popup>
  );
}
