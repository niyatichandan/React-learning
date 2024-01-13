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
    <div>
      <button onClick={handleDeleteClick}>Delete</button>

      {isConfirmOpen && (
        <div>
          <p>Are you sure you want to delete?</p>
          <button onClick={handleConfirm}>Yes</button>
          <button onClick={handleCancel}>No</button>
        </div>
      )}
    </div>
  );
};

export default DeleteButton;