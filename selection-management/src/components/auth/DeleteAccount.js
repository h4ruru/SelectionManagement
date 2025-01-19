// src/components/auth/DeleteAccount.js
import React, { useState } from "react";
import { getAuth, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const DeleteAccount = () => {
  const history = useNavigate();
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser; // 現在ログインしているユーザーを取得

    if (!user) {
      setError("No user is logged in.");
      return;
    }

    try {
      await deleteUser(user); // ユーザーアカウントを削除
      history("/");; // 削除後、ホームページにリダイレクト
    } catch (err) {
      setError(err.message); // エラーメッセージを表示
    }
  };

  return (
    <div>
      <h1>Delete Account</h1>
      <button onClick={handleDeleteAccount}>Delete My Account</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default DeleteAccount;
