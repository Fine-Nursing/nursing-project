import { useState, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { useSpecialtyList } from 'src/api/useSpecialties';

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [autocompleteSearchTerm, setAutocompleteSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Auto-complete debounce (300ms)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedAutocomplete = useCallback(
    debounce((value: string) => {
      setAutocompleteSearchTerm(value);
    }, 300),
    []
  );

  // Search debounce (500ms)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 500),
    []
  );

  // API call for suggestions
  const { data: suggestions, isLoading: isLoadingSuggestions } =
    useSpecialtyList(autocompleteSearchTerm);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
    setSelectedSuggestionIndex(-1);

    if (value.length >= 1) {
      debouncedAutocomplete(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setAutocompleteSearchTerm('');
    }

    debouncedSearch(value);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    setDebouncedSearchTerm(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    searchInputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || !suggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleFocus = () => {
    if (searchTerm.length >= 1) {
      if (suggestions && suggestions.length > 0) {
        setShowSuggestions(true);
      }
    } else if (!searchTerm) {
      // Request full list when search is empty
      setAutocompleteSearchTerm(' ');
      setShowSuggestions(true);
    }
  };

  return {
    searchTerm,
    debouncedSearchTerm,
    autocompleteSearchTerm,
    showSuggestions,
    selectedSuggestionIndex,
    suggestions,
    isLoadingSuggestions,
    searchInputRef,
    suggestionsRef,
    setShowSuggestions,
    setSelectedSuggestionIndex,
    handleSearchChange,
    handleSelectSuggestion,
    handleKeyDown,
    handleFocus,
  };
}