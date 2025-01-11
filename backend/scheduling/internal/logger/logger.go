package logger

import (
	"log"
	"os"
)

var (
	infoLogger  *log.Logger
	errorLogger *log.Logger
)

func InitLogger() {
	infoLogger = log.New(os.Stdout, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
	errorLogger = log.New(os.Stderr, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)
}

func Infof(format string, v ...interface{}) {
	infoLogger.Printf(format, v...)
}

func Error(v ...interface{}) {
	errorLogger.Println(v...)
}

func Errorf(format string, v ...interface{}) {
	errorLogger.Printf(format, v...)
}
