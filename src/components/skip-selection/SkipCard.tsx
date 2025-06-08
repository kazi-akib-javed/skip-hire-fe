import React from "react";
import "./SkipCard.css";

// Types
interface Skip {
  id: number;
  size: number;
  allowed_on_road: boolean;
  hirePeriod: string;
  totalPrice: string;
}

interface SkipCardViewProps {
  skip: Skip;
  isSelected: boolean;
  onCardClick: () => void;
  imageUrl: string;
}

// View component - handles only UI rendering
const SkipCardView: React.FC<SkipCardViewProps> = ({
  skip,
  isSelected,
  onCardClick,
  imageUrl
}) => {
  return (
    <div
      className={`skip-card ${isSelected ? "selected" : ""}`}
      data-testid="skip-card"
      onClick={onCardClick}
    >
      {!isSelected && (
        <div className="image-container">
          <img
            src={imageUrl}
            alt={`${skip.size} yard skip`}
            className="skip-image"
          />
          {skip.size && (
            <span className="yardage-label">{skip.totalPrice}</span>
          )}
          {!skip.allowed_on_road && (
            <span className="warning-message">Not Allowed On The Road</span>
          )}
        </div>
      )}
      <div className="skip-details">
        {!isSelected && (
          <>
            <h3>{skip.size} Yard Skip</h3>
            <p>{skip.hirePeriod}</p>
          </>
        )}
        {isSelected && (
          <div>
            <p className="selected-item-details">
              {skip.size} Yard skip for {skip.totalPrice}
            </p>
            <p>Click continue to check permit</p>
            <button className="continue-button">Continue</button>
          </div>
        )}
      </div>
    </div>
  );
};

// Container component - handles business logic
interface SkipCardProps {
  skip: Skip;
  isSelected: boolean;
  onSelect: (skipId: number) => void;
}

const SkipCard: React.FC<SkipCardProps> = ({ skip, isSelected, onSelect }) => {
  const handleCardClick = () => {
    if (!isSelected) {
      onSelect(skip.id);
    }
  };

  const imageUrl = "/skip-cart.webp";

  return (
    <SkipCardView
      skip={skip}
      isSelected={isSelected}
      onCardClick={handleCardClick}
      imageUrl={imageUrl}
    />
  );
};

export default SkipCard;
