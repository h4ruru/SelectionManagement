import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import DeleteAccount from "./components/auth/DeleteAccount";
import SelectionList from "./components/selections/selectionList";
import CompanyAdd from "./components/selections/companyAdd";
import CompanyUpdate from "./components/selections/companyUpdate";
import CompanyDelete from "./components/selections/companyDelete";
import SelectionDetail from "./components/selections/selectionDetail"; // SelectionDetailをインポート

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    // 認証状態の変更を監視
    onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // ユーザーが存在すれば認証済み
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
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/delete-account" element={<DeleteAccount />} />

          {/* 認証が必要なページ */}
          <Route
            path="/add"
            element={isAuthenticated ? <CompanyAdd /> : <Navigate to="/login" />}
          />
          <Route
            path="/update/:id"
            element={isAuthenticated ? <CompanyUpdate /> : <Navigate to="/login" />}
          />
          <Route
            path="/delete/:id"
            element={isAuthenticated ? <CompanyDelete /> : <Navigate to="/login" />}
          />
          <Route
            exact
            path="/"
            element={isAuthenticated ? <SelectionList /> : <Navigate to="/login" />}
          />
          <Route
            path="/detail/:id"
            element={isAuthenticated ? <SelectionDetail /> : <Navigate to="/login" />}
          />

          {/* 存在しないルートに対するフォールバック */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
