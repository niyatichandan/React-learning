import React from 'react';

const ErrorComponent = (errorMessage) => {
  return (
    <div style={{ border: '1px solid #FF0000', backgroundColor: '#fd8eaa', padding: '10px', margin: '10px 0' }} className="no-select">
      {errorMessage.errorMessage.message} 
    </div>
  );
};

export default ErrorComponent;
