import { useState, useEffect } from 'react';
import { UpdateItem, DeleteItem } from '../../wailsjs/go/main/App';

function EditItemForm({ item, onItemUpdated, onClose }) {
    const [formData, setFormData] = useState({
        title: '',
        type: 'snippet',
        language: '',
        tags: '',
        content: '',
    });
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (item) {
            setFormData({
                title: item.title || '',
                type: item.type || 'snippet',
                language: item.language || '',
                tags: item.tags || '',
                content: item.content || '',
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            // Update item with existing ID and created_at
            const updatedItem = {
                id: item.id,
                title: formData.title,
                type: formData.type,
                language: formData.language,
                tags: formData.tags,
                content: formData.content,
                created_at: item.created_at,
            };

            await UpdateItem(updatedItem);
            console.log('Item updated:', item.id);
            
            // Notify parent component
            if (onItemUpdated) {
                onItemUpdated();
            }
            
            // Close modal
            if (onClose) {
                onClose();
            }
        } catch (err) {
            console.error('Failed to update item:', err);
            setError(err.message || 'Failed to update item');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            return;
        }

        setError(null);
        setDeleting(true);

        try {
            await DeleteItem(item.id);
            console.log('Item deleted:', item.id);
            
            // Notify parent component
            if (onItemUpdated) {
                onItemUpdated();
            }
            
            // Close modal
            if (onClose) {
                onClose();
            }
        } catch (err) {
            console.error('Failed to delete item:', err);
            setError(err.message || 'Failed to delete item');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-secondary rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-primary">Edit Item</h2>
                        <button
                            onClick={onClose}
                            className="text-secondary hover:text-primary transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-3 p-2 border rounded text-sm" style={{ backgroundColor: 'var(--red-light)', borderColor: 'var(--red-primary)', color: 'var(--red-primary)' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Title */}
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-secondary mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-1.5 border border-main rounded-lg text-primary placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                placeholder="e.g., React useState Hook"
                            />
                        </div>

                        {/* Type and Language in one row */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">
                                    Type *
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-1.5 border border-main rounded-lg text-primary focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                >
                                    <option value="snippet">Snippet</option>
                                    <option value="function">Function</option>
                                    <option value="component">Component</option>
                                    <option value="template">Template</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">
                                    Language
                                </label>
                                <input
                                    type="text"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 border border-main rounded-lg text-primary placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                    placeholder="JavaScript, Python"
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-secondary mb-1">
                                Tags
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 border border-main rounded-lg text-primary placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                placeholder="react, hooks, state-management"
                            />
                        </div>

                        {/* Content */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-secondary mb-1">
                                Code *
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows={8}
                                className="w-full px-3 py-2 border border-main rounded-lg text-primary placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-mono text-xs"
                                style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                placeholder="Paste your code here..."
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2 justify-between">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="btn btn-danger text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={saving || deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="btn btn-secondary text-sm"
                                    disabled={saving || deleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={saving || deleting}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditItemForm;
