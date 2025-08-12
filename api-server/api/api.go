package api

import (
	"net/http"

	"github.com/andnandna/todo-app-go-react/database"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Task struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	IsCompleted bool   `json:"isCompleted"`
}

// memo: mainで接続したやつをそのまま使えない
var dbClient = database.GetDB()

func InitServer() {
	r := gin.Default()

	// [TMP]All Origins Allowed
	r.Use(cors.Default())

	r.GET("/tasks", getTasks)

	r.Run("localhost:8080")
}

func getTasks(context *gin.Context) {
	var tasks []Task

	rows, err := dbClient.Query("SELECT * FROM tasks")
	if err != nil {
		context.IndentedJSON(http.StatusInternalServerError, err)
	}

	defer rows.Close()
	for rows.Next() {
		var task Task
		if err := rows.Scan(&task.ID, &task.Title, &task.IsCompleted); err != nil {
			context.IndentedJSON(http.StatusInternalServerError, err)
		}
		tasks = append(tasks, task)
	}

	if err := rows.Err(); err != nil {
		context.IndentedJSON(http.StatusInternalServerError, err)
	}

	context.IndentedJSON(http.StatusOK, tasks)
}
