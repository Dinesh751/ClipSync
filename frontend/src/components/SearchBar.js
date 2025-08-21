import React, { useState, useEffect } from 'react';

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
    <div className="relative w-full max-w-2xl">
      <div className="relative flex items-center">
        <div className="relative flex-1">
          <input
            type="text"
            className="form-input pl-12 pr-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-primary-400 focus:ring-primary-400"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Clear Button */}
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
          {loading && (
            <div className="flex items-center px-4 py-3 text-gray-500">
              <div className="spinner mr-3"></div>
              <span>Loading suggestions...</span>
            </div>
          )}
          {!loading && suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-gray-700">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
