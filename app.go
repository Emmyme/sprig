package main

import (
	"codelib/backend/api"
	"codelib/backend/models"
	"codelib/backend/storage"
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
)

// App struct
type App struct {
	ctx        context.Context
	libraryAPI *api.LibraryAPI
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. 
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// Initialize database
	// Store database in user's home directory
	homeDir, err := os.UserHomeDir()
	if err != nil {
		log.Fatal("Failed to get home directory:", err)
	}

	// Create  directory if it doesn't exist
	dataDir := filepath.Join(homeDir, ".sprig")
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		log.Fatal("Failed to create data directory:", err)
	}

	dbPath := filepath.Join(dataDir, "sprig.db")
	db, err := storage.InitDB(dbPath)
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	// Initialize the library store and API
	store := storage.NewLibraryStore(db)
	a.libraryAPI = api.NewLibraryAPI(store)

	fmt.Println("Database initialized at:", dbPath)
}

// Library API Methods 

func (a *App) SaveItem(item models.Item) (int, error) {
	return a.libraryAPI.SaveItem(&item)
}

func (a *App) GetAllItems() ([]models.Item, error) {
	return a.libraryAPI.GetAllItems()
}

func (a *App) GetItemByID(id int) (*models.Item, error) {
	return a.libraryAPI.GetItemByID(id)
}

func (a *App) UpdateItem(item models.Item) error {
	return a.libraryAPI.UpdateItem(&item)
}

func (a *App) DeleteItem(id int) error {
	return a.libraryAPI.DeleteItem(id)
}

func (a *App) SearchItems(query string, itemType string) ([]models.Item, error) {
	return a.libraryAPI.SearchItems(query, itemType)
}

func (a *App) GetItemsByType(itemType string) ([]models.Item, error) {
	return a.libraryAPI.GetItemsByType(itemType)
}

func (a *App) GetItemsByLanguage(language string) ([]models.Item, error) {
	return a.libraryAPI.GetItemsByLanguage(language)
}

func (a *App) GetUniqueLanguages() ([]string, error) {
	return a.libraryAPI.GetUniqueLanguages()
}

func (a *App) GetItemStats() (map[string]int, error) {
	return a.libraryAPI.GetItemStats()
}


