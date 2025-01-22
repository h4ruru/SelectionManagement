import React, { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";  // useNavigateをインポート
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";

const CompanyDelete = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // useNavigate を使って遷移を管理

  useEffect(() => {
    const fetchCompany = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("You must be logged in to delete this company.");
        return;
      }

      const docRef = doc(db, "users", currentUser.uid, "selections", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCompany(docSnap.data());
      } else {
        setError("No such document!");
      }
    };

    fetchCompany();
  }, [id]);

  const handleDelete = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setError("You must be logged in to delete this company.");
      return;
    }

    const docRef = doc(db, "users", currentUser.uid, "selections", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
      alert("削除が完了しました！");
      setRedirect(true);
    } else {
      setError("No such document!");
    }
  };

  const handleBackToSelectionList = () => {
    navigate("/");  // 戻るボタンを押したら SelectionList 画面に遷移
  };

  if (redirect) {
    return <Navigate to="/" />;  // 削除後、SelectionListにリダイレクト
  }

  if (!company) return <div>Loading...</div>;

  return (
    <div>
      <h1>登録企業の削除</h1>
      {error && <div>Error: {error}</div>}
      <p>本当に削除してもよろしいでしょうか？</p>
      <button onClick={handleDelete}>削除</button>

      {/* 戻るボタン */}
      <button onClick={handleBackToSelectionList}>Selection Listに戻る</button>
    </div>
  );
};

export default CompanyDelete;
