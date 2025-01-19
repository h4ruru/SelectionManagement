// src/components/selections/companyAdd.js
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom"; // useNavigateをインポート

const CompanyAdd = () => {
  // 各入力フィールドに対応する状態を追加
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Selection");
  const [description, setDescription] = useState("");  // 新しいフィールド
  const [location, setLocation] = useState("");  // 新しいフィールド
  const [loading, setLoading] = useState(false); // ローディング状態を管理
  const navigate = useNavigate(); // useNavigateフックを使って遷移

  const handleAddCompany = async (e) => {
    e.preventDefault(); // フォーム送信をキャンセル
    setLoading(true); // ローディングを開始

    try {
      // 新しいフィールドを含めてFirestoreにデータを追加
      await addDoc(collection(db, "selections"), {
        title,
        status,
        description,  // 新しいフィールドを追加
        location,  // 新しいフィールドを追加
      });
      setLoading(false); // ローディングを終了

      // 会社作成後にSelection Listへリダイレクト
      navigate("/"); // Selection Listページに移動
    } catch (err) {
      console.error("Error adding company: ", err);
      setLoading(false); // エラー時にもローディングを終了
    }
  };

  return (
    <div>
      <h1>Add Company</h1>
      <form onSubmit={handleAddCompany}>
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
        
        {/* 作成ボタン */}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Company"}
        </button>
      </form>
    </div>
  );
};

export default CompanyAdd;
