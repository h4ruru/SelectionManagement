import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // useNavigate をインポート
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

const CompanyAdd = () => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Selection");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // useNavigate を使って遷移を管理
  const user = getAuth().currentUser;

  // 禁止文字を含むかどうかをチェック
  const forbiddenChars = /[<>/\\|{}*]/;

  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to add a company.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "users", user.uid, "selections"), {
        title,
        status,
        description,
        location,
        createdAt: new Date(),
      });

      setLoading(false);
      navigate("/");  // 作成後、SelectionList画面に遷移
    } catch (err) {
      console.error("Error adding company:", err);
      setLoading(false);
      alert("Error adding company.");
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    if (newTitle.length <= 45 && !forbiddenChars.test(newTitle)) {
      setTitle(newTitle);
    }
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    if (!forbiddenChars.test(newDescription)) {
      setDescription(newDescription);
    }
  };

  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    if (!forbiddenChars.test(newLocation)) {
      setLocation(newLocation);
    }
  };

  const handleBackToSelectionList = () => {
    navigate("/");  // 戻るボタンを押したら SelectionList 画面に遷移
  };

  return (
    <div>
      <h1>新規企業の登録</h1>
      <form onSubmit={handleAddCompany}>
        <input
          type="text"
          placeholder="社名"
          value={title}
          onChange={handleTitleChange}
          required
        />
        <select onChange={(e) => setStatus(e.target.value)} value={status}>
          <option value="説明会">説明会</option>
          <option value="一次面接">一次面接</option>
          <option value="二次面接">二次面接</option>
          <option value="三次面接">三次面接</option>
          <option value="最終面接">最終面接</option>
        </select>
        <input
          type="text"
          placeholder="所在地"
          value={location}
          onChange={handleLocationChange}
          required
        />
        <textarea
          placeholder="詳細"
          value={description}
          onChange={handleDescriptionChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "登録中..." : "企業登録"}
        </button>
      </form>
      <p>&lt; &gt; / \\ | {`{`} {`}`} * は使用することができません。</p>

      {/* 戻るボタン */}
      <button onClick={handleBackToSelectionList}>Selection Listに戻る</button>
    </div>
  );
};

export default CompanyAdd;
