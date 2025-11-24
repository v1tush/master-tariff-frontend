import { useState, useRef, useEffect } from "react";
import "./autocomplete.css";

export default function Autocomplete({
  options = [],
  onSelect,
  inputValue,
  invalid,
}) {
  const [query, setQuery] = useState(inputValue || "");
  const [filtered, setFiltered] = useState(options);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    setFiltered(
      query === ""
        ? options
        : options.filter((opt) =>
            opt.toLowerCase().includes(query.toLowerCase())
          )
    );
  }, [query, options]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    setQuery(value);
    setIsOpen(false);
    onSelect?.(value);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
    onSelect?.(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown")
      setHighlightIndex((i) => (i + 1) % filtered.length);
    if (e.key === "ArrowUp")
      setHighlightIndex((i) => (i - 1 + filtered.length) % filtered.length);
    if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(filtered[highlightIndex]);
    }
  };

  return (
    <div className="autocomplete" ref={ref}>
      <input
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Введите город"
        className={`autocomplete-input ${invalid ? "error" : ""}`}
      />
      {isOpen && filtered.length > 0 && (
        <ul className="autocomplete-list">
          {filtered.map((opt, idx) => (
            <li
              key={opt}
              className={`autocomplete-item ${
                idx === highlightIndex ? "highlight" : ""
              }`}
              onMouseEnter={() => setHighlightIndex(idx)}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
