import React from 'react';

const WarningComponent = (warningMessage) => {
  return (
    <div style={{ border: '1px solid #f0ad4e', backgroundColor: '#fcf8e3', padding: '10px', margin: '10px 0' }}>
      <strong>Warning:</strong> {warningMessage.warningMessage.message}
    </div>
  );
};

export default WarningComponent;
