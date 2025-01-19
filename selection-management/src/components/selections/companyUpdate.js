// src/components/selections/companyUpdate.js
import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";  // Navigateをインポート
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const CompanyUpdate = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");  // 新しいフィールド
  const [location, setLocation] = useState("");  // 新しいフィールド
  const [redirect, setRedirect] = useState(false);  // リダイレクトのための状態

  useEffect(() => {
    const fetchCompany = async () => {
      const docRef = doc(db, "selections", id);  // "selections" コレクションを使用
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const companyData = docSnap.data();
        setCompany(companyData);
        setTitle(companyData.title);  // titleを表示
        setStatus(companyData.status);
        setDescription(companyData.description || "");  // descriptionを表示（存在しない場合は空文字）
        setLocation(companyData.location || "");  // locationを表示（存在しない場合は空文字）
      } else {
        console.log("No such document!");
      }
    };

    fetchCompany();
  }, [id]);

  const handleUpdate = async () => {
    const docRef = doc(db, "selections", id); // "selections" コレクションを使用
    await updateDoc(docRef, {
      title,
      status,
      description,
      location
    });
    alert("Company updated!");
    setRedirect(true);  // 更新完了後にリダイレクト状態を設定
  };

  if (redirect) {
    return <Navigate to="/" />;  // SelectionListにリダイレクト
  }

  if (!company) return <div>Loading...</div>;

  return (
    <div>
      <h1>Update Company</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
        {/* 会社名入力フィールド */}
        <input
          type="text"
          placeholder="Company Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        {/* 状態選択フィールド */}
        <select onChange={(e) => setStatus(e.target.value)} value={status}>
          <option value="Selection">Selection</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
        
        {/* 会社の説明入力フィールド */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        {/* 会社の所在地入力フィールド */}
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        
        {/* 更新ボタン */}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default CompanyUpdate;

