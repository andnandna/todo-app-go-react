package database

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/go-sql-driver/mysql"
)

var DBClient *sql.DB

func InitDB() {
	cfg := mysql.NewConfig()
	cfg.User = "root"
	cfg.Net = "tcp"
	cfg.Addr = "127.0.0.1:3306"
	cfg.DBName = "todo_go_react"

	var err error
	DBClient, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	pingErr := DBClient.Ping()
	if pingErr != nil {
		log.Fatal(err)
	}
	fmt.Println("DB connected.")
}

func CloseDB() {
	DBClient.Close()
}
