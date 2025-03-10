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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(`User UID: ${user.uid}`); // UIDのログ出力
      navigate("/"); // ログイン成功後、SelectionListにリダイレクト
    } catch (err) {
      setError("入力値が正しくありません。");
    } finally {
      setIsLoading(false); // ローディング終了
    }
  };

  return (
    <div>
      <h1>ログイン</h1>
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
        <button type="submit" disabled={isLoading}>ログイン</button>
      </form>
      {error && <p>{error}</p>}
      {isLoading && <p>Loading...</p>} {/* ローディング中メッセージ */}
      <div>
        <p>&lt; &gt; / \\ | {`{`} {`}`} * は使用することができません。</p>
        <p>アカウントをお持ちですか？</p>
        <button onClick={() => navigate("/register")}>新規登録画面へ</button>
      </div>
    </div>
  );
};

export default Login;
