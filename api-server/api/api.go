package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Task struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	IsCompleted bool   `json:"isCompleted"`
}

// for debug
var tasks = []Task{
	{ID: 1, Title: "りんごを買う", IsCompleted: false},
	{ID: 2, Title: "散歩する", IsCompleted: false},
	{ID: 3, Title: "猫にご飯をあげる", IsCompleted: true},
}

func InitServer() {
	r := gin.Default()
	r.GET("/tasks", getTasks)

	r.Run("localhost:8080")
}

func getTasks(context *gin.Context) {
	context.IndentedJSON(http.StatusOK, tasks)
}
