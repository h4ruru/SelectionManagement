import React from 'react';

const SelectionDetailModal = ({ selection, closeModal }) => {
  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>Selection Detail</h2>
        <p><strong>社名:</strong> {selection.title}</p>
        <p><strong>状態:</strong> {selection.status}</p>
        <p><strong>所在地:</strong> {selection.location}</p>
        <p><strong>詳細:</strong> {selection.description}</p>

        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '100%',
  }
};

export default SelectionDetailModal;
