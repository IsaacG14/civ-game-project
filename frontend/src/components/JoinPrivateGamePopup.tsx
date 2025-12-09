import { useState } from "react";
import Popup from "./Popup";
import TextInput from "./TextInput";
import ErrorBox from "./ErrorBox";

type JoinPrivateGamePopupProps = {
  close: () => void;
};

export default function JoinPrivateGamePopup(props: JoinPrivateGamePopupProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string|null>(null);

  async function submit() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://3.143.222.205/join-game", {
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
        setError("Join game failed: " + (await res.json())?.message);
        return;
      }

      console.log("Joined game:", await res.json());
      props.close();
    } 
    catch (err) {
      setError("Error joining game: " + err);
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

        <ErrorBox message={error} setMessage={setError}/>
      </div>
    </Popup>
  );
}
