import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ローディング状態の追加
  const navigate = useNavigate();

  const forbiddenChars = /[<>/\\|{}*]/;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (forbiddenChars.test(email)) {
      setError("Email contains invalid characters.");
      return;
    }

    if (forbiddenChars.test(password)) {
      setError("Password contains invalid characters.");
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(`User UID: ${user.uid}`); // UIDのログ出力
      navigate("/"); // ログイン成功後、SelectionListにリダイレクト
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setIsLoading(false); // ローディング終了
    }
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
        <button type="submit" disabled={isLoading}>Login</button>
      </form>
      {error && <p>{error}</p>}
      {isLoading && <p>Loading...</p>} {/* ローディング中メッセージ */}
      <div>
        <p>&lt; &gt; / \\ | {`{`} {`}`} * are not available</p>
        <p>Don't have an account?</p>
        <button onClick={() => navigate("/register")}>Create Account</button>
      </div>
    </div>
  );
};

export default Login;
