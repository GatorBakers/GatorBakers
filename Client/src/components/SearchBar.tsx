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
  onSearch?: (results: ListingSummary[]) => void;
  onCategoryChange?: (category: string) => void;
}

const SearchBar = ({ onSearch, onCategoryChange }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Items");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!query) {
        onSearch?.([]);
        return;
      }

      console.log("[SearchBar] Fetching for:", query);

      fetch(
        `http://localhost:4000/search/listings?q=${encodeURIComponent(query)}`,
      )
        .then(res => res.json())
        .then(data => {
          console.log("API Results:", data);
          onSearch?.(data);
        })
        .catch(err => console.error("API Error:", err));
    }, 2000);

    return () => clearTimeout(delayDebounce);
  }, [query, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    console.log("[SearchBar] Query:", value);
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
