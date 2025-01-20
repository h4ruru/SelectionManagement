import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { CompanyItemTypes } from "./displayItems"; // アイテムタイプをインポート
import { getAuth } from "firebase/auth"; // Firebase Authenticationをインポート
import { db } from "../../firebase"; // Firebase設定のインポート
import { doc, updateDoc, getDocs, collection } from "firebase/firestore"; // FirestoreからdocとupdateDocをインポート
import { Link } from "react-router-dom"; // Linkをインポートして遷移処理を行う
import SelectionDetailModal from "./selectionDetailModal"; // ポップアップ用のモーダルをインポート

const statusOptions = ["Selection", "In Progress", "Done", "1", "2"];

const SelectionDragAndDrop = () => {
  const [selections, setSelections] = useState([]);
  const [selectedSelection, setSelectedSelection] = useState(null); // モーダル用に選択したアイテムを保存
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの状態管理

  // 初期データをFirestoreから取得する処理
  useEffect(() => {
    const fetchSelections = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) {
          throw new Error("User not authenticated");
        }

        // ユーザーのサブコレクションからデータを取得
        const querySnapshot = await getDocs(collection(db, "users", user.uid, "selections"));
        const selectionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSelections(selectionsData);
      } catch (error) {
        console.error("Error fetching selections:", error);
      }
    };

    fetchSelections();
  }, []);

  const openModal = (selection) => {
    setSelectedSelection(selection);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSelection(null);
  };

  // アイテムを移動させる処理
  const moveItem = async (item, newStatus) => {
    try {
      const itemRef = doc(db, "users", getAuth().currentUser.uid, "selections", item.id);
      await updateDoc(itemRef, { status: newStatus });

      setSelections((prevSelections) =>
        prevSelections.map((selection) =>
          selection.id === item.id ? { ...selection, status: newStatus } : selection
        )
      );
      console.log(`Item ${item.id} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating item status:", error);
    }
  };

  return (
    <div style={{ display: "block", width: "100%" }}>
      {statusOptions.map((status) => (
        <StatusColumn
          key={status}
          status={status}
          selections={selections.filter((item) => item.status === status)} // 各ステータスにフィルタリング
          moveItem={moveItem} // moveItemを渡す
          openModal={openModal} // openModalを渡す
        />
      ))}

      {isModalOpen && selectedSelection && (
        <SelectionDetailModal selection={selectedSelection} closeModal={closeModal} />
      )}
    </div>
  );
};

const StatusColumn = ({ status, selections, moveItem, openModal }) => {
  const [{ isOver }, drop] = useDrop({
    accept: CompanyItemTypes.SELECTION,
    drop: (item) => moveItem(item, status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        padding: "10px",
        border: "2px solid gray",
        minHeight: "200px",
        marginBottom: "20px",
        backgroundColor: isOver ? "lightblue" : "white",
      }}
    >
      <h3>{status}</h3>
      {selections.map((selection) => (
        <SelectionItemWithDrag
          key={selection.id}
          selection={selection}
          moveItem={moveItem}
          openModal={openModal}
        />
      ))}
    </div>
  );
};

const SelectionItemWithDrag = ({ selection, moveItem, openModal }) => {
  const [{ isDragging }, drag] = useDrag({
    type: CompanyItemTypes.SELECTION,
    item: { ...selection },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        padding: "8px",
        marginBottom: "8px",
        backgroundColor: isDragging ? "lightgreen" : "#f0f0f0",
        cursor: "move",
        opacity: isDragging ? 0.5 : 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ flex: 1 }}>{selection.title}</div>
      <button onClick={() => openModal(selection)} style={{ marginLeft: "10px" }}>
        Details
      </button>
      <Link to={`/update/${selection.id}`}>
        <button style={{ marginLeft: "10px" }}>Edit</button>
      </Link>
      <Link to={`/delete/${selection.id}`}>
        <button style={{ marginLeft: "10px", color: "red" }}>Delete</button>
      </Link>
    </div>
  );
};

export default SelectionDragAndDrop;
