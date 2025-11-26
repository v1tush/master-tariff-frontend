import React from "react";
import "./tCard.css";

export default function DeliveryCard({
  price = 0,
  currency = "₽",
  deliveryTime = "",
  tariffName = "",
  isAiGenerated = false,
  onClick,
  className = "",
}) {
  const numericPrice = Number(price); // преобразуем в число
  return (
    <div className={`delivery-card ${className}`} onClick={onClick}>
      <div className="card-content">
        <div className="price-section">
          <span className="price">
            {!isNaN(numericPrice) ? numericPrice.toFixed(2) : "0.00"} {currency}
          </span>
          {isAiGenerated && <span className="ai-badge">AI Generated</span>}
        </div>

        <div className="tariff-section">
          <p className="tariff-label">Tariff</p>
          <h3 className="tariff-name">{tariffName}</h3>
        </div>

        <div className="delivery-time">
          <span>{deliveryTime}</span>
        </div>

        {!isAiGenerated && (
          <div className="manual-pricing">
            <span>Manual Pricing</span>
          </div>
        )}
      </div>

      <div className="accent-line" />
    </div>
  );
}