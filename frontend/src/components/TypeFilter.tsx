function TypeFilter({ activeType, onTypeChange, darkMode = true }) {
    const types = [
        { value: '', label: 'All' },
        { value: 'snippet', label: 'Snippets' },
        { value: 'function', label: 'Functions' },
        { value: 'component', label: 'Components' },
        { value: 'template', label: 'Templates' },
    ];

    return (
        <div className={darkMode ? 'flex gap-2 p-4 bg-slate-800 border-b border-slate-700' : 'flex gap-2 p-4 bg-white border-b border-gray-200'}>
            <div className="flex gap-2 mx-auto">
                {types.map((type) => (
                    <button
                        key={type.value}
                        onClick={() => onTypeChange(type.value)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            activeType === type.value
                                ? 'bg-blue-600 text-white'
                                : darkMode
                                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {type.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default TypeFilter;
