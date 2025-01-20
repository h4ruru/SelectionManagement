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
      <h1>Add Company</h1>
      <form onSubmit={handleAddCompany}>
        <input
          type="text"
          placeholder="Company Name"
          value={title}
          onChange={handleTitleChange}
          required
        />
        <select onChange={(e) => setStatus(e.target.value)} value={status}>
          <option value="Selection">Selection</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
        <textarea
          placeholder="Description"
          value={description}
          onChange={handleDescriptionChange}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={handleLocationChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Company"}
        </button>
      </form>
      <p>&lt; &gt; / \\ | {`{`} {`}`} * are not available</p>

      {/* 戻るボタン */}
      <button onClick={handleBackToSelectionList}>Back to Selection List</button>
    </div>
  );
};

export default CompanyAdd;
