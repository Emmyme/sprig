import { useState, useEffect } from 'react';
import { GetUniqueLanguages } from '../../wailsjs/go/main/App';

function LanguageFilter({ activeLanguage, onLanguageChange, darkMode = true }) {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch unique languages from the database
        GetUniqueLanguages()
            .then((data) => {
                setLanguages(data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load languages:', err);
                setLoading(false);
            });
    }, []);

    if (loading || languages.length === 0) {
        return null; // Don't show if no languages yet
    }

    return (
        <div className={darkMode ? 'flex gap-2 p-4 bg-slate-800 border-b border-slate-700' : 'flex gap-2 p-4 bg-white border-b border-gray-200'}>
            <div className="flex items-center gap-2 mx-auto flex-wrap">
                <span className={darkMode ? 'text-sm text-gray-400 mr-2' : 'text-sm text-gray-600 mr-2'}>
                    Language:
                </span>
                <button
                    onClick={() => onLanguageChange('')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeLanguage === ''
                            ? 'bg-emerald-600 text-white'
                            : darkMode
                                ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    All
                </button>
                {languages.map((language) => (
                    <button
                        key={language}
                        onClick={() => onLanguageChange(language)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            activeLanguage === language
                                ? 'bg-emerald-600 text-white'
                                : darkMode
                                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {language}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default LanguageFilter;
