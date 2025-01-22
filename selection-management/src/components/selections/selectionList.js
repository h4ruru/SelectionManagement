import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import SelectionDragAndDrop from "./selectionDragAndDrop";
import Logout from "../auth/Logout";

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

      try {
        const userId = currentUser.uid; // Firebase AuthenticationのUIDを取得
        console.log(`Logged in as: ${userId}`);

        const querySnapshot = await getDocs(
          collection(db, "users", userId, "selections")
        );
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSelections(data);
        setUser(currentUser); // 認証されたユーザー情報を設定
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Selection List</h1>
      <Logout />
      {user && (
        <Link to="/add">
          <button>新規企業の登録</button>
        </Link>
      )}
      <SelectionDragAndDrop selections={selections} />
    </div>
  );
};

export default SelectionList;
