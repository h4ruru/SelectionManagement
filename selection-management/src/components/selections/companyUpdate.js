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
        location
      });
      alert("Company updated!");
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
      <h1>Update Company</h1>
      {error && <div>Error: {error}</div>}
      <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
        <input
          type="text"
          placeholder="Company Name"
          value={title}
          onChange={handleTitleChange}
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
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={handleLocationChange}
        />
        <button type="submit">Update</button>
      </form>

      <button onClick={handleBack}>Back to Selection List</button>
      <p>&lt; &gt; / \\ | {`{`} {`}`} * are not available</p>
    </div>
  );
};

export default CompanyUpdate;
