import { useState, useEffect } from 'react';
import { GetUniqueLanguages } from '../../wailsjs/go/main/App';

function FilterBar({ activeType, onTypeChange, activeLanguage, onLanguageChange, refreshTrigger }) {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    const types = [
        { value: '', label: 'All' },
        { value: 'snippet', label: 'Snippets' },
        { value: 'function', label: 'Functions' },
        { value: 'component', label: 'Components' },
        { value: 'template', label: 'Templates' },
    ];

    useEffect(() => {
        GetUniqueLanguages()
            .then((data) => {
                setLanguages(data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load languages:', err);
                setLoading(false);
            });
    }, [refreshTrigger]);

    return (
        <div className="bg-secondary border-b border-main">
            {/* Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-2 flex items-center justify-between hover:bg-tertiary transition-colors"
            >
                <div className="flex items-center gap-2">
                    <svg 
                        className="w-4 h-4 text-secondary" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="text-sm font-medium text-primary">Filters</span>
                    {(activeType || activeLanguage) && (
                        <span className="badge badge-blue text-xs px-2 py-0.5">
                            Active
                        </span>
                    )}
                    <svg 
                        className={`w-3 h-3 text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <span className="text-xs text-muted">
                    {isExpanded ? 'Hide' : 'Show'}
                </span>
            </button>

            {/* Filter Content */}
            {isExpanded && (
                <div className="px-4 pb-2">
                    <div className="max-w-7xl mx-auto">
                        {/* Type Filter */}
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-medium text-secondary min-w-[50px]">
                                Type:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {types.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => onTypeChange(type.value)}
                                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                            activeType === type.value
                                                ? 'btn-primary'
                                                : 'btn-secondary'
                                        }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Language Filter */}
                        {!loading && languages.length > 0 && (
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-secondary min-w-[50px]">
                                    Language:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    <button
                                        onClick={() => onLanguageChange('')}
                                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                            activeLanguage === ''
                                                ? 'btn-emerald'
                                                : 'btn-secondary'
                                        }`}
                                    >
                                        All
                                    </button>
                                    {languages.map((language) => (
                                        <button
                                            key={language}
                                            onClick={() => onLanguageChange(language)}
                                            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                                activeLanguage === language
                                                    ? 'btn-emerald'
                                                    : 'btn-secondary'
                                            }`}
                                        >
                                            {language}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FilterBar;
