import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Link, Route, Routes } from "react-router-dom";
import SelectionDragAndDrop from "./selectionDragAndDrop";

const SelectionList = () => {
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firestoreからデータを取得
  useEffect(() => {
    const fetchSelections = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "selections"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched selections:", data);
        setSelections(data);
      } catch (error) {
        console.error("Error fetching selections: ", error);
      } finally {
        setLoading(false); // データ取得後にloadingをfalseに設定
      }
    };
  
    fetchSelections();
  }, []);
  

  // ローディング中の表示
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="*"
        element={
          <div>
            <h1>Selection List</h1>
            <Link to="/add">
              <button>Create New Company</button>
            </Link>
            <SelectionDragAndDrop selections={selections} />
          </div>
        }
      />
    </Routes>
  );
};

export default SelectionList;
