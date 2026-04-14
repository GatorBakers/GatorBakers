import { useState, useEffect } from "react";
import type { ListingSummary } from "@shared/types";
import SearchIcon from "../assets/Search.svg";
import "./SearchBar.css";

const categories = [
  "All Items",
  "Pastries",
  "Cookies",
  "Cakes",
  "Bread",
  "Gluten-Free",
];

interface SearchBarProps {
  onSearch?: (results: ListingSummary[] | null) => void;
  onCategoryChange?: (category: string) => void;
}

const SearchBar = ({ onSearch, onCategoryChange }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Items");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const searchText = [
        query.trim(),
        activeCategory !== "All Items" ? activeCategory : "",
      ]
        .filter(Boolean)
        .join(" ");

      if (!searchText) {
        onSearch?.(null);
        return;
      }

      console.log("[SearchBar] Fetching for:", searchText);

      fetch(
        `http://localhost:4000/search/listings?q=${encodeURIComponent(searchText)}`,
      )
        .then(res => res.json())
        .then(data => {
          console.log("API Results:", data);
          const validResults: ListingSummary[] = Array.isArray(data)
            ? data.filter((item): item is ListingSummary => item !== null)
            : [];
          onSearch?.(validResults);
        })
        .catch(err => console.error("API Error:", err));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query, activeCategory, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setActiveCategory("All Items");
    onCategoryChange?.("All Items");
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    console.log("[SearchBar] Category selected:", category);
    onCategoryChange?.(category);
  };

  return (
    <div className="search-bar-wrapper">
      <div className="search-input-container">
        <img src={SearchIcon} alt="Search" className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search for breads, pastries, bakers..."
          value={query}
          onChange={handleInputChange}
        />
      </div>

      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? "active" : ""}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
