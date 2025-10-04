package models

import "time"

type ItemType string

const (
	Snippet ItemType = "snippet"
	Function ItemType = "function"
	Component ItemType = "component"
	Template ItemType = "template"
)

type Item struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Type       ItemType  `json:"type"`
	Language   string    `json:"language"`
	Tags       string    `json:"tags"`
	Content    string    `json:"content"`
	CreatedAt  time.Time `json:"created_at"`
}
