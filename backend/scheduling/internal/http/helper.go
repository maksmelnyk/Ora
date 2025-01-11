package http

import (
	"encoding/json"
	"net/http"
)

// WriteJson writes a JSON response with the given status code and data
func WriteJson(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		return
	}
}

// WriteError writes an error message to the response with the given status code.
func WriteError(w http.ResponseWriter, e *RestError) {
	WriteJson(w, e.Status, e)
}
