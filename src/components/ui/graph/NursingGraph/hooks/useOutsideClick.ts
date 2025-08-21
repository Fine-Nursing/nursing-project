import { useEffect } from 'react';

export function useOutsideClick(
  searchInputRef: React.RefObject<HTMLInputElement>,
  suggestionsRef: React.RefObject<HTMLDivElement>,
  onOutsideClick: () => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        onOutsideClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchInputRef, suggestionsRef, onOutsideClick]);
}