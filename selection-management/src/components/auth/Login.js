// src/components/auth/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigateをインポート

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // ログイン処理（仮）
    // Firebaseのログイン処理を追加してください

    // ログイン成功後の処理
    navigate("/"); // ログイン後に遷移するページ（例: ダッシュボードなど）
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <div>
        <p>Don't have an account?</p>
        {/* Registerページへのリンク */}
        <button onClick={() => navigate("/register")}>Create Account</button>
      </div>
    </div>
  );
};

export default Login;
