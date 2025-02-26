import React, { useState, useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { CompanyItemTypes } from "./displayItems";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { doc, updateDoc, getDocs, collection } from "firebase/firestore";
import { Link } from "react-router-dom";
import SelectionDetailModal from "./selectionDetailModal";

const statusOptions = ["説明会", "一次面接", "一次面接結果待ち", "二次面接", "二次面接結果待ち", "三次面接", "三次面接結果待ち", "最終面接", "最終面接結果待ち", "内定",];

const SelectionDragAndDrop = () => {
  const [selections, setSelections] = useState([]);
  const [selectedSelection, setSelectedSelection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 各ステータス枠への参照
  const sectionRefs = useRef({});

  const scrollInterval = useRef(null);

  // 初期データをFirestoreから取得する処理
  useEffect(() => {
    const fetchSelections = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) {
          throw new Error("User not authenticated");
        }

        const querySnapshot = await getDocs(
          collection(db, "users", user.uid, "selections")
        );
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
      const itemRef = doc(
        db,
        "users",
        getAuth().currentUser.uid,
        "selections",
        item.id
      );
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

  // 各ステータス枠にスクロールする関数
  const scrollToSection = (status) => {
    sectionRefs.current[status]?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {

    const handleDragOver = (event) => {
      event.preventDefault();
      const { clientY } = event;
      
      let scrollSpeed = 0;
      let scrollIntervalTime = 0;
      const Specifiedwidth = document.documentElement.clientHeight * 0.1;

      if (clientY < Specifiedwidth) {
        scrollSpeed = -1;
        scrollIntervalTime = 4;
      } else if (clientY > document.documentElement.clientHeight - Specifiedwidth) {
        scrollSpeed = 1;
        scrollIntervalTime = 4;
      } else {
        // スクロール不要なら停止
        if (scrollInterval.current) {
          clearInterval(scrollInterval.current);
          scrollInterval.current = null;
        }
        return;
      }
  
      // 既存のスクロール処理をクリア
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
  
      // スクロール処理を新たにセット
      scrollInterval.current = setInterval(() => {
        window.scrollBy(0, scrollSpeed);
      }, scrollIntervalTime);
    };
  
    const handleDragEnd = () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
        scrollInterval.current = null;
      }
    };
  
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragend", handleDragEnd);
  
    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragend", handleDragEnd);
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, []);

  return (
    <div>
      {/* 上部のボタン */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => scrollToSection(status)}
            style={{
              padding: "10px  15px",
              fontSize: "12px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* 各ステータスの列 */}
      <div style={{ display: "block", width: "100%" }}>
        {statusOptions.map((status) => (
          <div
            key={status}
            ref={(el) => (sectionRefs.current[status] = el)} // 各枠を参照に登録
          >
            <StatusColumn
              status={status}
              selections={selections.filter((item) => item.status === status)}
              moveItem={moveItem}
              openModal={openModal}
            />
          </div>
        ))}
      </div>

      {/* モーダル */}
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

const SelectionItemWithDrag = ({ selection, openModal }) => {
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
      <button onClick={() => openModal(selection)} style={{ marginLeft: "10px" }}>詳細</button>
      <Link to={`/update/${selection.id}`}>
        <button style={{ marginLeft: "10px" }}>編集</button>
      </Link>
      <Link to={`/delete/${selection.id}`}>
        <button style={{ marginLeft: "10px", color: "red" }}>削除</button>
      </Link>
    </div>
  );
};

export default SelectionDragAndDrop;
