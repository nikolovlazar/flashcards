# Stage 1: Build the Go binary
FROM golang:1.21.4 as builder

WORKDIR /build

# Copy the Go modules files
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code
COPY . .

# Build the Go binary
ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64
RUN go build -ldflags="-s -w" -o apiserver .

# Stage 2: Create a small image to run the Go binary
FROM scratch

WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder ["/build/apiserver", "/"]

# Expose the port
EXPOSE 3001

# Run the binary
ENTRYPOINT ["/apiserver"]
