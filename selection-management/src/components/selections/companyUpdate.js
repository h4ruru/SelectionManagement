import React, { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";

const CompanyUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);

  const forbiddenChars = /[<>/\\|{}*]/;

  useEffect(() => {
    const fetchCompany = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("You must be logged in to view this page.");
        return;
      }

      const docRef = doc(db, "users", currentUser.uid, "selections", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const companyData = docSnap.data();
        setCompany(companyData);
        setTitle(companyData.title);
        setStatus(companyData.status);
        setDescription(companyData.description || "");
        setLocation(companyData.location || "");
      } else {
        setError("No such document!");
      }
    };

    fetchCompany();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("You must be logged in to update this company.");
        return;
      }

      const docRef = doc(db, "users", currentUser.uid, "selections", id);
      await updateDoc(docRef, {
        title,
        status,
        description,
        location,
      });
      alert("企業情報が更新されました！");
      setRedirect(true);
    } catch (error) {
      console.error("Error updating document:", error);
      setError("Error updating document: " + error.message);
    }
  };

  const handleBack = () => {
    navigate("/");
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

  if (redirect) {
    return <Navigate to="/" />;
  }

  if (!company) return <div>Loading...</div>;

  return (
    <div>
      {/* 上部ボタン */}
      <div>
        <button
          onClick={handleBack}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Selection Listに戻る
        </button>
      </div>

      <h1>企業情報の更新</h1>
      {error && <div>Error: {error}</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
      >
        <div>
          <input
            type="text"
            placeholder="社名"
            value={title}
            onChange={handleTitleChange}
            style={{ display: "block", marginBottom: "10px", padding: "10px", width: "100%" }}
          />
          <select
            onChange={(e) => setStatus(e.target.value)}
            value={status}
            style={{ display: "block", marginBottom: "10px", padding: "10px", width: "100%" }}
          >
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
            style={{ display: "block", marginBottom: "10px", padding: "10px", width: "100%" }}
          />
        </div>
        <div>
          <textarea
            placeholder="詳細"
            value={description}
            onChange={handleDescriptionChange}
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "10px",
              width: "100%",
              minHeight: "100px",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          更新
        </button>
      </form>

      <p>&lt; &gt; / \\ | {`{`} {`}`} * は使用することができません。</p>
    </div>
  );
};

export default CompanyUpdate;
