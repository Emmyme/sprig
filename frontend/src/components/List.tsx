import { useState, useEffect } from 'react';
import { GetAllItems, GetItemsByType, GetItemsByLanguage, SearchItems } from '../../wailsjs/go/main/App';
import EditItemForm from './EditItemForm';
import ViewItemModal from './ViewItemModal';

// Helper function to assign badge colors based on type
const getBadgeColor = (type) => {
    const colors = {
        'snippet': 'badge-blue',
        'function': 'badge-emerald',
        'component': 'badge-peach',
        'template': 'badge-purple',
    };
    return colors[type.toLowerCase()] || 'badge-blue';
};

// Helper function to assign badge colors based on language
const getLanguageBadgeColor = (language) => {
    const languageColors = {
        'JavaScript': 'badge-peach',
        'TypeScript': 'badge-cyan',
        'Python': 'badge-cyan',
        'Go': 'badge-emerald',
        'Rust': 'badge-pink',
        'Java': 'badge-purple',
        'C++': 'badge-blue',
        'C#': 'badge-purple',
        'Ruby': 'badge-pink',
        'PHP': 'badge-purple',
        'Swift': 'badge-peach',
        'Kotlin': 'badge-purple',
    };
    return languageColors[language] || 'badge-purple';
};

// Helper function to get language icon
const getLanguageIcon = (language) => {
    const icons = {
        'JavaScript': 'devicon-javascript-plain',
        'TypeScript': 'devicon-typescript-plain',
        'Python': 'devicon-python-plain',
        'Go': 'devicon-go-plain',
        'Rust': 'devicon-rust-plain',
        'Java': 'devicon-java-plain',
        'C++': 'devicon-cplusplus-plain',
        'C': 'devicon-c-plain',
        'C#': 'devicon-csharp-plain',
        'Ruby': 'devicon-ruby-plain',
        'PHP': 'devicon-php-plain',
        'Swift': 'devicon-swift-plain',
        'Kotlin': 'devicon-kotlin-plain',
        'HTML': 'devicon-html5-plain',
        'CSS': 'devicon-css3-plain',
        'React': 'devicon-react-original',
        'Vue': 'devicon-vuejs-plain',
        'Angular': 'devicon-angularjs-plain',
        'Flutter': 'devicon-flutter-plain',
        'Node.js': 'devicon-nodejs-plain',
        'SQL': 'devicon-mysql-plain',
        'Dart': 'devicon-dart-plain',
        'R': 'devicon-r-plain',
        'Lua': 'devicon-lua-plain',
        'Perl': 'devicon-perl-plain',
        'Scala': 'devicon-scala-plain',
        'Elixir': 'devicon-elixir-plain',
        'Haskell': 'devicon-haskell-plain',
    };
    return icons[language] || 'devicon-code-plain';
};

function List({ searchQuery = '', activeType = '', activeLanguage = '' }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    const fetchItems = async () => {
        setLoading(true);
        setError(null);
        
        try {
            let data;
            
            // Priority: Search query > Language filter > Type filter > All items
            if (searchQuery) {
                // Search with optional type filter
                data = await SearchItems(searchQuery, activeType);
                // If language filter is active, filter results client-side
                if (activeLanguage && data) {
                    data = data.filter(item => item.language === activeLanguage);
                }
            } else if (activeLanguage) {
                // Filter by language only
                data = await GetItemsByLanguage(activeLanguage);
                // If type filter is also active, filter results client-side
                if (activeType && data) {
                    data = data.filter(item => item.type === activeType);
                }
            } else if (activeType) {
                // Filter by type only
                data = await GetItemsByType(activeType);
            } else {
                // Get all items
                data = await GetAllItems();
            }
            
            setItems(data || []);
        } catch (err) {
            console.error('Failed to load items:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [searchQuery, activeType, activeLanguage]); // Re-fetch when search, type, or language changes

    const handleCardClick = (item) => {
        setViewingItem(item);
    };

    const handleEditClick = (item, e) => {
        e.stopPropagation(); // Prevent card click
        setEditingItem(item);
    };

    const handleCopyClick = async (item, e) => {
        e.stopPropagation(); // Prevent card click
        try {
            await navigator.clipboard.writeText(item.content);
            setCopiedId(item.id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleEditFromView = () => {
        setEditingItem(viewingItem);
        setViewingItem(null);
    };

    const handleItemUpdated = () => {
        fetchItems(); // Refresh the list
        setEditingItem(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-secondary">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div style={{ color: 'var(--red-primary)' }}>Error: {error}</div>
            </div>
        );
    }

    return (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {items.length === 0 ? (
                <div className="col-span-full text-center py-12">
                    <div className="text-secondary">
                        {searchQuery || activeType || activeLanguage ? 'No items found matching your criteria.' : 'No snippets yet. Create your first one!'}
                    </div>
                </div>
            ) : (
                items.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleCardClick(item)}
                        className="card group relative cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-primary truncate pr-2">
                                {item.title}
                            </h3>
                            <div className="flex items-center gap-1">
                                <span className={`badge ${getBadgeColor(item.type)} shrink-0`}>
                                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                </span>
                                <button
                                    onClick={(e) => handleCopyClick(item, e)}
                                    className="opacity-50 group-hover:opacity-100 transition-opacity p-1 rounded text-secondary hover:text-primary shrink-0"
                                    style={{ backgroundColor: 'var(--bg-hover)' }}
                                    title="Copy code"
                                >
                                    {copiedId === item.id ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    onClick={(e) => handleEditClick(item, e)}
                                    className="opacity-50 group-hover:opacity-100 transition-opacity p-1 rounded text-secondary hover:text-primary shrink-0"
                                    style={{ backgroundColor: 'var(--bg-hover)' }}
                                    title="Edit item"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {item.language && (
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`badge ${getLanguageBadgeColor(item.language)} text-xs`}>
                                    {item.language}
                                </span>
                            </div>
                        )}
                        <pre className="text-xs text-primary p-2 rounded overflow-hidden border border-main" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <code className="line-clamp-4">{item.content}</code>
                        </pre>
                    </div>
                ))
            )}
        </div>
        {viewingItem && (
            <ViewItemModal
                item={viewingItem}
                onClose={() => setViewingItem(null)}
                onEdit={handleEditFromView}
            />
        )}
        {editingItem && (
            <EditItemForm
                item={editingItem}
                onItemUpdated={handleItemUpdated}
                onClose={() => setEditingItem(null)}
            />
        )}
        </>
    );
}

export default List;
