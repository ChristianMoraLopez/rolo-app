
// src/components/features/SearchBar.tsx
"use client";
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Busca por lugar o sensación..."
          className="flex-1 px-4 py-2 rounded-l-md border border-azulreducido focus:outline-none focus:border-azulprimary"
        />
        <button 
          onClick={handleSearch}
          className="bg-moradoprimary text-background px-6 py-2 rounded-r-md hover:bg-moradohover"
        >
          Buscar
        </button>
      </div>
    </div>
  );
}