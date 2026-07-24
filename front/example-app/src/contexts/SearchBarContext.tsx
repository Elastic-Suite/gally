import { createContext, useContext, useRef, MutableRefObject } from 'react';

export interface SearchBarHandle {
  /** Programmatically set the search input value and trigger autocomplete */
  setQuery: (q: string) => void;
  /** Submit the current query (navigate to search page) */
  submit: () => void;
  /** Clear autocomplete */
  clear: () => void;
  /** Get input element for focus */
  inputRef: MutableRefObject<HTMLInputElement | null>;
}

const SearchBarContext = createContext<MutableRefObject<SearchBarHandle | null> | null>(null);

export function useSearchBarRef() {
  const ref = useContext(SearchBarContext);
  if (!ref) throw new Error('useSearchBarRef must be used inside SearchBarProvider');
  return ref;
}

export function SearchBarProvider({ children }: { children: React.ReactNode }) {
  const handleRef = useRef<SearchBarHandle | null>(null);
  return (
    <SearchBarContext.Provider value={handleRef}>
      {children}
    </SearchBarContext.Provider>
  );
}
