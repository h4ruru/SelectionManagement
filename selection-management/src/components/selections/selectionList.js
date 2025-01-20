// src/components/selections/selectionList.js
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom"; // Linkをインポート
import SelectionDragAndDrop from "./selectionDragAndDrop";
import Logout from "../auth/Logout"; // Logoutコンポーネントをインポート

const SelectionList = () => {
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (!currentUser) {
        console.log("Error: No user is logged in.");
        setError("No user is logged in.");
        setLoading(false);
        return;
      }

      const clientUserId = localStorage.getItem("userId");
      console.log(`User is logged in\nUser UID: ${currentUser.uid}\nProvided userId: ${clientUserId}`);

      if (clientUserId !== currentUser.uid) {
        console.log(`Mismatch detected:\nUser UID: ${currentUser.uid}\nProvided userId: ${clientUserId}`);
        setError("Provided userId does not match logged in user UID.");
        setLoading(false);
        return;
      }

      const querySnapshot = await getDocs(collection(db, "users", currentUser.uid, "selections"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSelections(data);
      setUser(currentUser); // 認証されたユーザー情報を設定
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Selection List</h1>
      
      {/* ログアウトボタン */}
      <Logout />
      
      {/* 認証されたユーザーの場合のみ「Create New Company」ボタンを表示 */}
      {user && (
        <Link to="/add">
          <button>Create New Company</button>
        </Link>
      )}
      
      <SelectionDragAndDrop selections={selections} />
    </div>
  );
};

export default SelectionList;
