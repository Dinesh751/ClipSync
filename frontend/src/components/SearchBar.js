import React, { useState, useEffect } from 'react';
import '../styles/components/SearchBar.css';

const SearchBar = ({ searchTerm, onSearch, placeholder = "Search videos..." }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch suggestions from server
  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      // Replace this URL with your actual API endpoint
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } else {
        // Fallback to dummy suggestions if server is not available
        const fallbackSuggestions = [
          "Getting Started",
          "Tutorial",
          "Collaboration",
          "Mobile App",
          "Advanced Features",
          "Team",
          "Upload",
          "Video Management"
        ].filter(suggestion =>
          suggestion.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
        
        setSuggestions(fallbackSuggestions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      // Fallback suggestions on error
      const fallbackSuggestions = [
        "Getting Started",
        "Tutorial", 
        "Collaboration",
        "Mobile App",
        "Advanced Features"
      ].filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      
      setSuggestions(fallbackSuggestions);
    } finally {
      setLoading(false);
    }
  };

  // Debounce suggestions API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(searchTerm);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    onSearch(value);
    setShowSuggestions(value.length > 0);
  };

  const clearSearch = () => {
    onSearch('');
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (searchTerm.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 150);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        
        {searchTerm && (
          <button
            className="search-clear"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            ❌
          </button>
        )}
      </div>
      
      <button className="search-button" aria-label="Search">
        <div className="search-icon">🔍</div>
      </button>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {loading && (
            <div className="search-suggestion-item">
              <div className="suggestion-icon">⏳</div>
              <span>Loading suggestions...</span>
            </div>
          )}
          {!loading && suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="search-suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="suggestion-icon">🔍</div>
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
