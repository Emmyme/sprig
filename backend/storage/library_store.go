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