// src/components/auth/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigateをインポート

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // アカウント作成処理（仮）
    // Firebase auth の登録処理を追加してください

    // 登録成功後にリダイレクト
    navigate("/login"); // 登録後にログインページへ遷移
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Register</button>
      </form>
      <div>
        <p>Already have an account?</p>
        {/* Loginページへのリンク */}
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );
};

export default Register;
