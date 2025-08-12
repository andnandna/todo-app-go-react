package database

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/go-sql-driver/mysql"
)

var dbClient *sql.DB

func InitDB() {
	cfg := mysql.NewConfig()
	cfg.User = "root"
	cfg.Net = "tcp"
	cfg.Addr = "127.0.0.1:3306"
	cfg.DBName = "todo_go_react"

	var err error
	dbClient, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	pingErr := dbClient.Ping()
	if pingErr != nil {
		log.Fatal(err)
	}
	fmt.Println("DB connected.")
}

func GetDB() *sql.DB {
	// memo: mainで接続してもapi.goでそのまま使えず、このチェックを入れている
	if dbClient == nil {
		InitDB()
	}
	return dbClient
}
