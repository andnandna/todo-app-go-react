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

func InitServer() {
	r := gin.Default()

	// [TMP]All Origins Allowed
	r.Use(cors.Default())

	r.GET("/tasks", getTasks)
	r.POST("/tasks", createTasks)
	r.PUT("/tasks", editTasks)
	r.DELETE("/tasks", deleteTasks)

	r.Run("localhost:8080")
}

func getTasks(context *gin.Context) {
	var tasks []Task

	rows, err := database.DBClient.Query("SELECT * FROM tasks")
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

func createTasks(context *gin.Context) {
	var newTask Task
	if err := context.BindJSON(&newTask); err != nil {
		context.IndentedJSON(http.StatusInternalServerError, err)
	}

	_, err := database.DBClient.Exec("INSERT INTO tasks (title, isCompleted) VALUES (?, ?)", newTask.Title, false)
	if err != nil {
		context.IndentedJSON(http.StatusInternalServerError, err)
	}

	context.IndentedJSON(http.StatusCreated, nil)
}

func editTasks(context *gin.Context) {
	var task Task
	if err := context.BindJSON(&task); err != nil {
		context.IndentedJSON(http.StatusInternalServerError, err)
	}

	_, err := database.DBClient.Exec("UPDATE tasks SET title = ?, isCompleted = ? WHERE id = ?", task.Title, task.IsCompleted, task.ID)
	if err != nil {
		context.IndentedJSON(http.StatusInternalServerError, err)
	}

	context.IndentedJSON(http.StatusNoContent, nil)
}

func deleteTasks(context *gin.Context) {
	var task Task
	if err := context.BindJSON(&task); err != nil {
		context.IndentedJSON(http.StatusInternalServerError, err)
	}

	_, err := database.DBClient.Exec("DELETE FROM tasks WHERE id = ?", task.ID)

	if err != nil {
		context.IndentedJSON(http.StatusInternalServerError, err)
	}

	context.IndentedJSON(http.StatusNoContent, nil)
}
