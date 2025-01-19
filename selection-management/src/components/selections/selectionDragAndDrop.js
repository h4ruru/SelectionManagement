import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { CompanyItemTypes } from "./displayItems"; // アイテムタイプをインポート
import { Link } from "react-router-dom";
import { doc, updateDoc, getDocs, collection } from "firebase/firestore"; // FirestoreからdocとupdateDocをインポート
import { db } from "../../firebase"; // Firebase設定のインポート

// ドロップ可能なステータス
const statusOptions = ["Selection", "In Progress", "Done", "1", "2"];

const SelectionDragAndDrop = () => {
  const [selections, setSelections] = useState([]);

  // 初期データをFirestoreから取得する処理
  useEffect(() => {
    const fetchSelections = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "selections"));
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

  // アイテムを移動させる処理
  const moveItem = async (item, newStatus) => {
    try {
      // Firestoreのアイテムのステータスを更新
      const itemRef = doc(db, "selections", item.id);
      await updateDoc(itemRef, { status: newStatus });

      // 状態更新
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
        />
      ))}
    </div>
  );
};

// ドラッグアンドドロップ用のステータスカラム
const StatusColumn = ({ status, selections, moveItem }) => {
  const [{ isOver }, drop] = useDrop({
    accept: CompanyItemTypes.SELECTION, // ドロップできるアイテムタイプを指定
    drop: (item) => moveItem(item, status), // ドロップ時の処理
    collect: (monitor) => ({
      isOver: monitor.isOver(), // ドロップエリアにアイテムが乗っているか
    }),
  });

  return (
    <div
      ref={drop} // ドロップ領域を設定
      style={{
        padding: "10px",
        border: "2px solid gray",
        minHeight: "200px",
        marginBottom: "20px", // 各カラムの間隔
        backgroundColor: isOver ? "lightblue" : "white",
      }}
    >
      <h3>{status}</h3>
      {selections.map((selection) => (
        <SelectionItemWithDrag key={selection.id} selection={selection} moveItem={moveItem} />
      ))}
    </div>
  );
};

// ドラッグ可能な選択アイテム
const SelectionItemWithDrag = ({ selection, moveItem }) => {
  const [{ isDragging }, drag] = useDrag({
    type: CompanyItemTypes.SELECTION, // ドラッグするアイテムのタイプを指定
    item: { ...selection }, // ドラッグするアイテムのデータを指定（必ず新しいオブジェクトを渡す）
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // アイテムがドラッグ中かどうか
    }),
  });

  return (
    <div
      ref={drag} // ドラッグ対象のアイテムに ref をセット
      style={{
        padding: "8px",
        marginBottom: "8px",
        backgroundColor: isDragging ? "lightgreen" : "#f0f0f0", // ドラッグ中のスタイル変更
        cursor: "move", // アイテムをドラッグ中にカーソルを変更
        opacity: isDragging ? 0.5 : 1, // ドラッグ中にアイテムを少し透過
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ flex: 1 }}>{selection.title}</div>

      {/* 編集ボタン */}
      <Link to={`/update/${selection.id}`}>
        <button style={{ marginLeft: "10px" }}>Edit</button>
      </Link>

      {/* 削除ボタン */}
      <Link to={`/delete/${selection.id}`}>
        <button style={{ marginLeft: "10px" }}>Delete</button>
      </Link>
    </div>
  );
};

export default SelectionDragAndDrop;
