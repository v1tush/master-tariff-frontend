import { useState, useEffect } from "react";
import Autocomplete from "./autocomplete/autocomplete.jsx";
import "./form.css";

export default function TariffsForm({ onSubmitApi, loading }) {
  // -------- State --------
  const [city, setCity] = useState("");
  const [weight, setWeight] = useState("");
  const [errors, setErrors] = useState({});
  const [cityOptions, setCityOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // -------- API Logic --------
  const fetchCities = async (query) => {
    if (!query || query.length < 2) {
      setCityOptions([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&addressdetails=1&limit=5&countrycodes=ru`,
        {
          method: "GET",
          headers: { "User-Agent": "MyTariffApp/1.0" },
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();

      // Чистые названия городов без скобок
      const formattedCities = result
        .map((item) => {
          const addr = item.address;
          return addr.city || addr.town || addr.village || addr.hamlet || addr.state || "";
        })
        .filter(Boolean);

      const uniqueCities = [...new Set(formattedCities)];
      setCityOptions(uniqueCities);
    } catch (error) {
      console.error("OSM Fetch Error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // -------- Effects --------
  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchCities(city);
    }, 500);
    return () => clearTimeout(timerId);
  }, [city]);

  // -------- Handlers --------
  const handleCitySelect = (value) => {
    setCity(value);
    setErrors((prev) => ({ ...prev, city: null }));
  };

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
    setErrors((prev) => ({ ...prev, weight: null }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!city) newErrors.city = "Поле обязательно для заполнения";
    else if (!cityOptions.includes(city)) {
      if (cityOptions.length === 0 && !isSearching)
        newErrors.city = "Такого города не существует";
      else newErrors.city = "Выберите город из выпадающего списка";
    }

    if (!weight) newErrors.weight = "Введите вес груза";
    else if (weight < 1) newErrors.weight = "Минимальный вес — 1 кг";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Отправляем только чистое название города
    onSubmitApi({ city, weight });
  };

  // -------- Render --------
  return (
    <form onSubmit={submitHandler} className="tariffs-form">
      <h3>Найдите тарифы</h3>

      <label>
        Город доставки
        <Autocomplete
          options={cityOptions}
          onSelect={handleCitySelect}
          invalid={!!errors.city}
        />
        {errors.city && <span className="error-text">{errors.city}</span>}
      </label>

      <label>
        Вес груза
        <input
          type="number"
          value={weight}
          onChange={handleWeightChange}
          placeholder="Введите вес груза (кг)"
          className={`weight-input ${errors.weight ? "error" : ""}`}
          min={0}
        />
        {errors.weight && <span className="error-text">{errors.weight}</span>}
      </label>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? "Загрузка..." : "Отправить запрос"}
      </button>
    </form>
  );
}
