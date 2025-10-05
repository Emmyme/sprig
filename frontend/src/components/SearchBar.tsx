import { useState } from 'react';

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <div className="bg-secondary border-b border-main px-4 py-2">
            <form onSubmit={handleSearch} className="max-w-7xl mx-auto">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by title, tags, or code..."
                        className="flex-1 px-3 py-1.5 bg-tertiary border border-main text-primary placeholder-gray-500 focus:outline-none transition-colors text-sm"
                        style={{ 
                            backgroundColor: 'var(--bg-tertiary)',
                            borderColor: query ? 'var(--blue-primary)' : 'var(--border-color)',
                            boxShadow: query ? '0 0 15px rgba(196, 181, 253, 0.1)' : 'none',
                            borderRadius: '1rem'
                        }}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary text-sm"
                    >
                        Search
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SearchBar;
