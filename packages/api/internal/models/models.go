package models

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	Name string `json:"name"`
	Slug string `json:"slug" gorm:"->;<-:create"`
}

type Flashcard struct {
	gorm.Model
	Question   string `json:"question"`
	Answer     string `json:"answer"`
	Slug       string `json:"slug" gorm:"->;<-:create"`
	CategoryID uint   `json:"categoryId"`
}
