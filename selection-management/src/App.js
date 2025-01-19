// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"; // Navigateをインポート
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import DeleteAccount from "./components/auth/DeleteAccount";
import SelectionList from "./components/selections/selectionList";
import CompanyAdd from "./components/selections/companyAdd";
import CompanyUpdate from "./components/selections/companyUpdate";
import CompanyDelete from "./components/selections/companyDelete";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // アプリケーションが最初に読み込まれたときに匿名サインインを実行
  useEffect(() => {
    const auth = getAuth();

    // 認証状態の変更を監視
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    // 匿名サインイン（認証していない場合のみ）
    if (!isAuthenticated) {
      signInAnonymously(auth)
        .then(() => {
          console.log("Successfully signed in anonymously!");
        })
        .catch((error) => {
          console.error("Error signing in anonymously:", error);
        });
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <div>
        <Routes> {/* Switch → Routes に変更 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          
          {/* 認証が必要なページにはリダイレクト */}
          <Route
            path="/add"
            element={isAuthenticated ? <CompanyAdd /> : <Navigate to="/login" />} // Navigate に変更
          />
          <Route
            path="/update/:id"
            element={isAuthenticated ? <CompanyUpdate /> : <Navigate to="/login" />} // Navigate に変更
          />
          <Route
            path="/delete/:id"
            element={isAuthenticated ? <CompanyDelete /> : <Navigate to="/login" />} // Navigate に変更
          />
          <Route
            exact
            path="/"
            element={isAuthenticated ? <SelectionList /> : <Navigate to="/login" />} // Navigate に変更
          />
        </Routes> {/* Switch → Routes に変更 */}
      </div>
    </Router>
  );
};

export default App;
