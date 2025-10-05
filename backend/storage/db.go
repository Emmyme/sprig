package storage

import (
	"database/sql"

	_ "modernc.org/sqlite" 
)

func InitDB(dbPath string) (*sql.DB, error) {
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, err
	}

	if err = db.Ping(); err != nil {
		return nil, err
	}

	// Create items table
	createTableQuery := `
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        language TEXT,
        tags TEXT,
        content TEXT NOT NULL,
        created_at DATETIME NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_type ON items(type);
    CREATE INDEX IF NOT EXISTS idx_language ON items(language);
    CREATE INDEX IF NOT EXISTS idx_created_at ON items(created_at);
    `

	_, err = db.Exec(createTableQuery)
	if err != nil {
		return nil, err
	}

	return db, nil
}
