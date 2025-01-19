import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const SelectionDetail = ({ selections }) => {
  const { id } = useParams(); // URLからIDを取得
  const navigate = useNavigate();

  // 該当するアイテムを検索
  const selection = selections.find((item) => item.id === id);

  if (!selection) {
    return <div>Item not found.</div>;
  }

  return (
    <div>
      <h1>Selection Detail</h1>
      <p><strong>ID:</strong> {selection.id}</p>
      <p><strong>Title:</strong> {selection.title}</p>
      <p><strong>Status:</strong> {selection.status}</p>
      <p><strong>Other Info:</strong> {selection.otherInfo}</p>

      {/* リスト画面に戻るボタン */}
      <button onClick={() => navigate("/")}>Back to List</button>
    </div>
  );
};

export default SelectionDetail;
