export interface HighlightedText {
  beforeMatch: string;
  match: string;
  afterMatch: string;
}

export const highlightMatch = (text: string, searchTerm: string): HighlightedText => {
  const matchIndex = text.toLowerCase().indexOf(searchTerm.toLowerCase());
  
  if (matchIndex === -1) {
    return {
      beforeMatch: text,
      match: '',
      afterMatch: '',
    };
  }

  return {
    beforeMatch: text.slice(0, matchIndex),
    match: text.slice(matchIndex, matchIndex + searchTerm.length),
    afterMatch: text.slice(matchIndex + searchTerm.length),
  };
};