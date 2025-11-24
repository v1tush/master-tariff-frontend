import React, { useState } from "react";
import TariffsForm from "./components/form/form.jsx";
import DeliveryCard from "./components/tCard/tCard.jsx";
import Header from "./components/header/header.jsx";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [tariffs, setTariffs] = useState([]);

  // ⬇⬇⬇ ВСТАВЛЯЕШЬ СЮДА ДЕМО-КАРТОЧКИ ⬇⬇⬇
  const mockTariffs = [
    { price: 349, delivery_time: "Сегодня — 2 часа", tariff: "Экспресс" },
    { price: 199, delivery_time: "1–2 дня", tariff: "Стандарт" },
    { price: 499, delivery_time: "Сегодня — 1 час", tariff: "Курьер Премиум" },
    { price: 129, delivery_time: "3–5 дней", tariff: "Эконом" },
    { price: 279, delivery_time: "Завтра", tariff: "Ускоренный" },
    { price: 399, delivery_time: "Завтра утром", tariff: "Срочная доставка" }
  ];
  // ⬆⬆⬆ ДО СЮДА ⬆⬆⬆

  const handleFormSubmit = async ({ city, weight }) => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://team-33-alpha-km06h64d.hack.prodcontest.ru:8000/api/delivery/tariffs/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city, weight }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTariffs(data);
      } else {
        console.log("Что-то пошло не так");
      }
    } catch (err) {
      console.log("Ошибка сети", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header name="Tariff Master" />
      <TariffsForm onSubmitApi={handleFormSubmit} loading={loading} />

      <div
        className="cards"
        style={{ marginTop: "20px", display: "grid", gap: "16px" }}
      >
        {(tariffs.length > 0 ? tariffs : mockTariffs).map((t, index) => (
          <DeliveryCard
            key={index}
            price={t.price || 0}
            deliveryTime={t.delivery_time}
            tariffName={t.tariff}
          />
        ))}
      </div>
    </div>
  );
}
