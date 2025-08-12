package main

import (
	"github.com/andnandna/todo-app-go-react/api"
	"github.com/andnandna/todo-app-go-react/database"
)

func main() {
	database.InitDB()
	api.InitServer()
}
