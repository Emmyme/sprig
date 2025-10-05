import { useState } from 'react';

function ViewItemModal({ item, onClose, onEdit }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(item.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (!item) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)'
        }}>
            <div className="bg-secondary rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" style={{
                boxShadow: '0 0 60px rgba(196, 181, 253, 0.3), 0 0 30px rgba(168, 230, 226, 0.2)',
                border: '1px solid var(--blue-primary)'
            }}>
                
                {/* Header */}
                <div className="p-6 border-b border-main">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-primary">
                                    {item.title}
                                </h2>
                                <span className="badge badge-blue">
                                    {item.type}
                                </span>
                            </div>
                            {item.language && (
                                <p className="text-sm text-secondary">
                                    Language: <span className="font-medium">{item.language}</span>
                                </p>
                            )}
                            {item.tags && (
                                <p className="text-sm text-secondary mt-1">
                                    Tags: <span className="font-medium">{item.tags}</span>
                                </p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="text-secondary hover:text-primary transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="relative">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-semibold text-secondary">
                                Code
                            </h3>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-3 py-1.5 text-secondary hover:text-primary rounded text-sm transition-colors"
                                style={{ backgroundColor: 'var(--bg-hover)' }}
                            >
                                {copied ? (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                        <pre className="text-sm text-primary p-4 rounded-lg overflow-x-auto border border-main" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <code>{item.content}</code>
                        </pre>
                    </div>

                    {/* Metadata */}
                    <div className="mt-6 pt-6 border-t border-main">
                        <p className="text-xs text-muted">
                            Created: {new Date(item.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Footer with action buttons */}
                <div className="p-4 border-t border-main flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="btn btn-secondary"
                    >
                        Close
                    </button>
                    <button
                        onClick={onEdit}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ViewItemModal;
