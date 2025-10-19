import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import List from "./components/List";
import AddItemForm from "./components/AddItemForm";
import TitleBar from "./components/TitleBar";
import "./App.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("");
  const [activeLanguage, setActiveLanguage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLightTheme, setIsLightTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const theme = savedTheme || "dark";
    const isLight = theme === "light";
    setIsLightTheme(isLight);
    if (isLight) {
      document.documentElement.classList.add("light-theme");
    }
  }, []);

  const toggleTheme = () => {
    const isLight = document.documentElement.classList.contains("light-theme");
    if (isLight) {
      document.documentElement.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
      setIsLightTheme(false);
    } else {
      document.documentElement.classList.add("light-theme");
      localStorage.setItem("theme", "light");
      setIsLightTheme(true);
    }
  };

  interface SearchHandler {
    (query: string): void;
  }

  const handleSearch: SearchHandler = (query) => {
    setSearchQuery(query);
  };

  interface TypeChangeHandler {
    (type: string): void;
  }

  const handleTypeChange: TypeChangeHandler = (type) => {
    setActiveType(type);
  };

  interface LanguageChangeHandler {
    (language: string): void;
  }

  const handleLanguageChange: LanguageChangeHandler = (language) => {
    setActiveLanguage(language);
  };

  const handleItemAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-primary">
      <TitleBar />
      <header
        className="border-b py-3 px-4"
        style={{
          background:
            "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)",
          borderColor: "var(--blue-primary)",
          borderBottomWidth: "2px",
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex-1 ml-16">
            <h1
              className="text-center text-2xl font-bold"
              style={
                isLightTheme
                  ? {
                      color: "#7c5fd8",
                    }
                  : {
                      color: "var(--blue-primary)",
                    }
              }
            >
              Sprig
            </h1>
            <p className="text-center text-secondary text-xs">
              Your personal code library
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors text-secondary hover:text-primary"
              style={{ backgroundColor: "var(--bg-hover)" }}
              title="Toggle theme"
            >
              {isLightTheme ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary flex items-center gap-1.5 text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Item
            </button>
          </div>
        </div>
      </header>

      <SearchBar onSearch={handleSearch} />
      <FilterBar
        refreshTrigger={refreshTrigger}
        activeType={activeType}
        onTypeChange={handleTypeChange}
        activeLanguage={activeLanguage}
        onLanguageChange={handleLanguageChange}
      />
      <List
        key={refreshTrigger}
        searchQuery={searchQuery}
        activeType={activeType}
        activeLanguage={activeLanguage}
      />

      {showAddForm && (
        <AddItemForm
          onItemAdded={handleItemAdded}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}

export default App;
