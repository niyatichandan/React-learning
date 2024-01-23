import React, { useState } from 'react';

const DeleteButton = ({ onDelete, deleteIndex }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    onDelete(deleteIndex); // Call the delete function
    setIsConfirmOpen(false); // Close the confirmation pop-up
  };

  const handleCancel = () => {
    setIsConfirmOpen(false); // Close the confirmation pop-up
  };

  return (
    <>
      <button onClick={handleDeleteClick} className="no-select">Delete</button>

      {isConfirmOpen && (
        <div className="no-select">
          <p>Are you sure you want to delete?</p>
          <button onClick={handleConfirm}>Yes</button>
          <button onClick={handleCancel}>No</button>
        </div>
      )}
    </>
  );
};

export default DeleteButton;