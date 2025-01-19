// src/components/selections/companyDelete.js
import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";  // Navigateをインポート
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

const CompanyDelete = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [redirect, setRedirect] = useState(false);  // リダイレクトのための状態

  useEffect(() => {
    const fetchCompany = async () => {
      const docRef = doc(db, "selections", id);  // "selections" コレクションを使用
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCompany(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchCompany();
  }, [id]);

  const handleDelete = async () => {
    const docRef = doc(db, "selections", id); // "selections" コレクションを使用
    await deleteDoc(docRef);
    alert("Company deleted!");
    setRedirect(true);  // 削除完了後にリダイレクト状態を設定
  };

  if (redirect) {
    return <Navigate to="/" />;  // SelectionListにリダイレクト
  }

  if (!company) return <div>Loading...</div>;

  return (
    <div>
      <h1>Delete Company</h1>
      <p>Are you sure you want to delete this company?</p>
      <button onClick={handleDelete}>Yes, Delete</button>
    </div>
  );
};

export default CompanyDelete;
