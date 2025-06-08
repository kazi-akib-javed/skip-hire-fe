import React from 'react';
import './FixedBackButton.css';

interface FixedBackButtonProps {
  onClick: () => void;
}

const FixedBackButton: React.FC<FixedBackButtonProps> = ({ onClick }) => {
  return (
    <button className="fixed-back-button" onClick={onClick}>
      <div className="arrow-left"></div>
    </button>
  );
};

export default FixedBackButton; 