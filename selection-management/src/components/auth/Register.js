import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ローディング状態の追加
  const navigate = useNavigate();

  const forbiddenChars = /[<>/\\|{}*]/;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (forbiddenChars.test(email)) {
      setError("Emailに使用不可な文字が使われています。");
      return;
    }

    if (forbiddenChars.test(password)) {
      setError("Passwordに使用不可な文字が使われています。");
      return;
    }

    setIsLoading(true); // ローディング開始
    setError(""); // エラーメッセージをクリア

    if (!email || !password) {
      setError("Please fill in both fields.");
      setIsLoading(false); // ローディング終了
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/login");
    } catch (err) {
      setError("登録に失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false); // ローディング終了
    }
  };

  return (
    <div>
      <h1>新規登録</h1>
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
        <button type="submit" disabled={isLoading}>新規登録</button>
      </form>
      {error && <p>{error}</p>}
      {isLoading && <p>Loading...</p>} {/* ローディング中メッセージ */}
      <div>
        <p>&lt; &gt; / \\ | {`{`} {`}`} * は使用することができません。</p>
        <p>すでにアカウントを登録していますか？</p>
        <button onClick={() => navigate("/login")}>ログイン画面へ</button>
      </div>
    </div>
  );
};

export default Register;
