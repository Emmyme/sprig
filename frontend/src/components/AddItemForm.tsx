import { useState } from "react";
import { SaveItem } from "../../wailsjs/go/main/App";

interface AddItemFormProps {
  onItemAdded?: () => void;
  onClose?: () => void;
}

function AddItemForm({ onItemAdded, onClose }: AddItemFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "snippet",
    language: "",
    tags: "",
    content: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const item = {
        id: 0,
        title: formData.title,
        type: formData.type,
        language: formData.language,
        tags: formData.tags,
        content: formData.content,
        created_at: new Date().toISOString(),
        convertValues: () => {},
      };

      const id = await SaveItem(item);
      console.log("Item saved with ID:", id);

      setFormData({
        title: "",
        type: "snippet",
        language: "",
        tags: "",
        content: "",
      });

      if (onItemAdded) {
        onItemAdded();
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Failed to save item:", err);
      setError(err instanceof Error ? err.message : "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-secondary rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary">Add New Item</h2>
            <button
              onClick={onClose}
              className="text-secondary hover:text-primary transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {error && (
            <div
              className="mb-3 p-2 border rounded text-sm"
              style={{
                backgroundColor: "var(--red-light)",
                borderColor: "var(--red-primary)",
                color: "var(--red-primary)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                style={{ backgroundColor: "var(--bg-tertiary)" }}
                placeholder="e.g., React useState Hook"
              />
            </div>

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
                  style={{ backgroundColor: "var(--bg-tertiary)" }}
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
                  style={{ backgroundColor: "var(--bg-tertiary)" }}
                  placeholder="JavaScript, Python"
                />
              </div>
            </div>

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
                style={{ backgroundColor: "var(--bg-tertiary)" }}
                placeholder="react, hooks, state-management"
              />
            </div>

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
                style={{ backgroundColor: "var(--bg-tertiary)" }}
                placeholder="Paste your code here..."
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary text-sm"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddItemForm;
