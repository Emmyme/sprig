package api

import (
	"codelib/backend/models"
	"codelib/backend/storage"
	"context"
	"fmt"
)

type LibraryAPI struct {
	ctx   context.Context
	store *storage.LibraryStore
}

func NewLibraryAPI(store *storage.LibraryStore) *LibraryAPI {
	return &LibraryAPI{
		store: store,
	}
}

func (a *LibraryAPI) SetContext(ctx context.Context) {
	a.ctx = ctx
}

func (a *LibraryAPI) SaveItem(item *models.Item) (int, error) {
	if err := validateItem(item); err != nil {
		return 0, err
	}

	id, err := a.store.CreateItem(item)
	if err != nil {
		return 0, fmt.Errorf("failed to save item: %w", err)
	}

	return id, nil
}

func (a *LibraryAPI) GetAllItems() ([]models.Item, error) {
	items, err := a.store.GetAllItems()
	if err != nil {
		return nil, fmt.Errorf("failed to get all items: %w", err)
	}

	if items == nil {
		return []models.Item{}, nil
	}
	return items, nil
}

func (a *LibraryAPI) GetItemByID(id int) (*models.Item, error) {
	if id <= 0 {
		return nil, fmt.Errorf("invalid item ID")
	}

	item, err := a.store.GetItemByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get item by ID: %w", err)
	}

	return item, nil
}

func (a *LibraryAPI) UpdateItem(item *models.Item) error {
	if item.ID <= 0 {
		return fmt.Errorf("invalid item ID")
	}

	if err := validateItem(item); err != nil {
		return err
	}

	if err := a.store.UpdateItem(item); err != nil {
		return fmt.Errorf("failed to update item: %w", err)
	}

	return nil
}

func (a *LibraryAPI) DeleteItem(id int) error {
	if id <= 0 {
		return fmt.Errorf("invalid item ID")
	}

	if err := a.store.DeleteItem(id); err != nil {
		return fmt.Errorf("failed to delete item: %w", err)
	}

	return nil
}

func (a *LibraryAPI) SearchItems(query string, itemType string) ([]models.Item, error) {
	var typeFilter models.ItemType
	if itemType != "" {
		typeFilter = models.ItemType(itemType)
	}

	items, err := a.store.SearchItems(query, typeFilter)
	if err != nil {
		return nil, fmt.Errorf("failed to search items: %w", err)
	}

	if items == nil {
		return []models.Item{}, nil
	}

	return items, nil
}

func (a *LibraryAPI) GetItemsByType(itemType string) ([]models.Item, error) {
	typeValue := models.ItemType(itemType)
	if !isValidItemType(typeValue) {
		return nil, fmt.Errorf("invalid item type")
	}

	items, err := a.store.GetItemsByType(typeValue)
	if err != nil {
		return nil, fmt.Errorf("failed to get items by type: %w", err)
	}

	if items == nil {
		return []models.Item{}, nil
	}

	return items, nil
}

func (a *LibraryAPI) GetItemsByLanguage(language string) ([]models.Item, error) {
	if language == "" {
		return nil, fmt.Errorf("language cannot be empty")
	}

	items, err := a.store.GetItemsByLanguage(language)
	if err != nil {
		return nil, fmt.Errorf("failed to get items by language: %w", err)
	}

	if items == nil {
		return []models.Item{}, nil
	}

	return items, nil
}

func (a *LibraryAPI) GetUniqueLanguages() ([]string, error) {
	languages, err := a.store.GetUniqueLanguages()
	if err != nil {
		return nil, fmt.Errorf("failed to get unique languages: %w", err)
	}

	if languages == nil {
		return []string{}, nil
	}

	return languages, nil
}

func (a *LibraryAPI) GetItemStats() (map[string]int, error) {
	allItems, err := a.store.GetAllItems()
	if err != nil {
		return nil, fmt.Errorf("failed to get stats: %w", err)
	}

	stats := map[string]int{
		"total":     len(allItems),
		"snippet":   0,
		"function":  0,
		"component": 0,
		"template":  0,
	}

	for _, item := range allItems {
		stats[string(item.Type)]++
	}

	return stats, nil
}

func validateItem(item *models.Item) error {
	if item.Title == "" {
		return fmt.Errorf("title is required")
	}
	if item.Content == "" {
		return fmt.Errorf("content is required")
	}
	if !isValidItemType(item.Type) {
		return fmt.Errorf("invalid item type")
	}
	return nil
}

func isValidItemType(itemType models.ItemType) bool {
	switch itemType {
	case models.Snippet, models.Function, models.Component, models.Template:
		return true
	}
	return false
}
