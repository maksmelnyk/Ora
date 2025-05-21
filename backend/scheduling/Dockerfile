FROM golang:1.24.3-alpine AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go install github.com/swaggo/swag/cmd/swag@latest
RUN swag init -g cmd/api/main.go
RUN go build -o /go/bin/app ./cmd/api

FROM alpine:latest
RUN apk --no-cache add ca-certificates

COPY --from=builder /go/bin/app /app
COPY --from=builder /app/docs ./docs

CMD ["/app"]
LABEL version="0.0.1" name="scheduling"
