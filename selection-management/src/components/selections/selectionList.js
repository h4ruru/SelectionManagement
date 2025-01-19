import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Link, Route, Routes } from "react-router-dom";
import SelectionDragAndDrop from "./selectionDragAndDrop";
import SelectionDetail from "./selectionDetail";

const SelectionList = () => {
  const [selections, setSelections] = useState([]);

  // Firestoreからデータを取得
  useEffect(() => {
    const fetchSelections = async () => {
      const querySnapshot = await getDocs(collection(db, "selections"));
      setSelections(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchSelections();
  }, []);

  return (
    <Routes>
      {/* メインリスト画面 */}
      <Route
        path="/"
        element={
          <div>
            <h1>Selection List</h1>
            {/* Create New Company ボタン */}
            <Link to="/add">
              <button>Create New Company</button>
            </Link>

            {/* Drag and Drop Component */}
            <SelectionDragAndDrop selections={selections} />
          </div>
        }
      />

      {/* 詳細画面 */}
      <Route path="/detail/:id" element={<SelectionDetail selections={selections} />} />
    </Routes>
  );
};

export default SelectionList;
