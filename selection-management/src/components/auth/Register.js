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
      setError("Email contains invalid characters.");
      return;
    }

    if (forbiddenChars.test(password)) {
      setError("password contains invalid characters.");
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
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false); // ローディング終了
    }
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
        <button type="submit" disabled={isLoading}>Register</button>
      </form>
      {error && <p>{error}</p>}
      {isLoading && <p>Loading...</p>} {/* ローディング中メッセージ */}
      <div>
        <p>&lt; &gt; / \\ | {`{`} {`}`} * are not available</p>
        <p>Already have an account?</p>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );
};

export default Register;
