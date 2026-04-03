import { useState } from 'react';
import SearchIcon from '../assets/Search.svg';
import './SearchBar.css';

const categories = ['All Items', 'Pastries', 'Cookies', 'Cakes', 'Bread', 'Gluten-Free'];

interface SearchBarProps {
    onSearch?: (query: string) => void;
    onCategoryChange?: (category: string) => void;
}

const SearchBar = ({ onSearch, onCategoryChange }: SearchBarProps) => {
    const [query, setQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All Items');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        console.log('[SearchBar] Query:', value);
        onSearch?.(value);
    };

    const handleCategoryClick = (category: string) => {
        setActiveCategory(category);
        console.log('[SearchBar] Category selected:', category);
        onCategoryChange?.(category);
    };

    // TODO: Debounce search API call — trigger the search API request 2 seconds after the user stops typing

    return (
        <div className="search-bar-wrapper">
            <div className="search-input-container">
                <img src={SearchIcon} alt="Search" className="search-icon" />
                <label htmlFor="search-listings" className="sr-only">
                    Search listings
                </label>
                <input
                    id="search-listings"
                    type="text"
                    className="search-input"
                    placeholder="Search for breads, pastries, bakers..."
                    value={query}
                    onChange={handleInputChange}
                    aria-label="Search listings"
                />
            </div>

            <div className="category-filters" role="group" aria-label="Filter by category">
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                        aria-pressed={activeCategory === category}
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
