package storage

import (
	"codelib/backend/models"
	"database/sql"
	"time"
)

type LibraryStore struct {
	db *sql.DB
}

func NewLibraryStore(db *sql.DB) *LibraryStore {
	return &LibraryStore{db: db}
}

func (s *LibraryStore) CreateItem(item *models.Item) (int, error) {
	query := `
		INSERT INTO items (title, type, language, tags, content, created_at)
		VALUES (?, ?, ?, ?, ?, ?)
	`
	item.CreatedAt = time.Now()
	result, err := s.db.Exec(query, item.Title, item.Type, item.Language, item.Tags, item.Content, item.CreatedAt)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	return int(id), err
}

func (s *LibraryStore) GetAllItems() ([]models.Item, error) {
	query := `SELECT id, title, type, language, tags, content, created_at FROM items ORDER BY created_at DESC`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var items []models.Item

	for rows.Next() {
		var item models.Item
		err := rows.Scan(&item.ID, &item.Title, &item.Type, &item.Language, &item.Tags, &item.Content, &item.CreatedAt)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	return items, nil

}

func (s *LibraryStore) GetItemByID(id int) (*models.Item, error) {
	query := `SELECT id, title, type, language, tags, content, created_at FROM items WHERE id = ?`

	var item models.Item
	err := s.db.QueryRow(query, id).Scan(&item.ID, &item.Title, &item.Type, &item.Language, &item.Tags, &item.Content, &item.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &item, nil
}

func (s *LibraryStore) UpdateItem(item *models.Item) error {
	query := `
		UPDATE items SET title = ?, type = ?, language = ?, tags = ?, content = ?, created_at = ? WHERE id = ?
	`
	_, err := s.db.Exec(query, item.Title, item.Type, item.Language, item.Tags, item.Content, item.CreatedAt, item.ID)
	return err
}

func (s *LibraryStore) DeleteItem(id int) error {
	query := `DELETE FROM items WHERE id = ?`
	_, err := s.db.Exec(query, id)
	return err
}

func (s *LibraryStore) SearchItems(query string, itemType models.ItemType) ([]models.Item, error) {
	sqlQuery := `
		SELECT id, title, type, language, tags, content, created_at
		FROM items
		WHERE (title LIKE ? OR tags LIKE ? OR content LIKE ?)
	`
	searchPattern := "%" + query + "%"

	args := []interface{}{searchPattern, searchPattern, searchPattern}

	if itemType != "" {
		sqlQuery += " AND type = ?"
		args = append(args, itemType)
	}

	sqlQuery += " ORDER BY created_at DESC"

	rows, err := s.db.Query(sqlQuery, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.Item

	for rows.Next() {
		var item models.Item
		err := rows.Scan(&item.ID, &item.Title, &item.Type, &item.Language, &item.Tags, &item.Content, &item.CreatedAt)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	return items, nil
}

func (s *LibraryStore) GetItemsByType(itemType models.ItemType) ([]models.Item, error) {
	query := `SELECT id, title, type, language, tags, content, created_at FROM items WHERE type = ? ORDER BY created_at DESC`

	rows, err := s.db.Query(query, itemType)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.Item
	for rows.Next() {
		var item models.Item
		err := rows.Scan(&item.ID, &item.Title, &item.Type, &item.Language, &item.Tags, &item.Content, &item.CreatedAt)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	return items, nil
}

func (s *LibraryStore) GetItemsByLanguage(language string) ([]models.Item, error) {
	query := `SELECT id, title, type, language, tags, content, created_at FROM items WHERE language = ? ORDER BY created_at DESC`

	rows, err := s.db.Query(query, language)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.Item
	for rows.Next() {
		var item models.Item
		err := rows.Scan(&item.ID, &item.Title, &item.Type, &item.Language, &item.Tags, &item.Content, &item.CreatedAt)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	return items, nil
}

func (s *LibraryStore) GetUniqueLanguages() ([]string, error) {
	query := `SELECT DISTINCT language FROM items WHERE language IS NOT NULL AND language != '' ORDER BY language ASC`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var languages []string
	for rows.Next() {
		var language string
		err := rows.Scan(&language)
		if err != nil {
			return nil, err
		}
		languages = append(languages, language)
	}

	return languages, nil
}
