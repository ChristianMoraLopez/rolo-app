// src/components/features/SearchBarContainer.tsx
"use client";
import { SearchBar } from '@components/features/Searchbar';

export function SearchBarContainer() {
  const handleSearch = (query: string) => {
    console.log("Buscando:", query);
    // Add your search logic here
  };

  return <SearchBar onSearch={handleSearch} />;
}