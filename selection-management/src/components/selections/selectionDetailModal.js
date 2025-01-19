import React from 'react';

const SelectionDetailModal = ({ selection, closeModal }) => {
  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>Selection Detail</h2>
        <p><strong>ID:</strong> {selection.id}</p>
        <p><strong>Title:</strong> {selection.title}</p>
        <p><strong>Status:</strong> {selection.status}</p>
        <p><strong>Description:</strong> {selection.description}</p>

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
