// src/components/auth/Logout.js
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom"; // useNavigateをインポート

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // ログアウト後にログイン画面に遷移
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  );
};

export default Logout;
