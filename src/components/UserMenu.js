import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserMenu.css";

export default function UserMenu({ username }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch("http://localhost:3001/api/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/");
  }

  if (!username) return null;

  return (
    <div className="user-menu">
      <button className="user-menu-trigger" onClick={() => setOpen(o => !o)}>
        {username} ▾
      </button>
      {open && (
        <div className="user-menu-dropdown">
          <button onClick={handleLogout}>Log out</button>
        </div>
      )}
    </div>
  );
}
