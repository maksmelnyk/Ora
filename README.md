# Ora – Learning Platform (Microservices Sandbox Project)

> ⚠️ **Disclaimer:** This is a personal **learning project** used to explore and experiment with different technologies and architectural patterns.
> The project is still in **early development**, and as such, it **may contain bugs, broken logic, and incomplete features**. Contributions and suggestions are always welcome!

### 🚀 Project Overview

Ora is a full-featured learning platform where educators can offer:

* 🎥 **Pre-recorded courses** — Instant access after purchase
* 👥 **Group sessions** — Live sessions on scheduled dates
* 👤 **Private sessions** — Booked by users, approved by educators
* 🌐 **Online courses** — Live, multi-session courses with predefined schedules

Regular users can browse, purchase, and consume content — and optionally **apply to become educators** and sell their own content.

The platform will also support:
* 💬 **Private and group chat** between users and educators (planned)
* 📅 **Scheduling tools** for educators to define availability and event calendars
* ⚙️ **Automated booking logic** for online courses, sessions, and meetings

### 🧱 Architecture

This platform uses a **polyglot microservices architecture** with a containerized environment managed via **Docker Compose**.

### 📂 Folder Structure

```bash
.
├── backend/                # Microservices
│   ├── auth/               # Java + Spring Boot + Keycloak
│   ├── profile/            # Java + Spring Boot + JPA
│   ├── learning/           # ASP.NET 9 + EF Core
│   ├── scheduling/         # Go + Chi + SQLX
│   ├── payment/            # Python + FastAPI
│   └── chat/               # (Planned) NestJS + WebRTC
├── frontend/               # Web client (React + Vite + TS + Tailwind)
│   └── web/                # Main web app
├── configs/                # Keycloak realm + Observability configs
├── scripts/                # Utility scripts
├── nginx/                  # NGINX reverse proxy + certs
├── .env.docker             # Environment variables
└── docker-compose.yml      # Compose file
```

### 🛠️ Technologies

### ✨ Frontend

* **React + TypeScript + Vite + Tailwind CSS**
* Hosted via **NGINX**

### 🧩 Backend Microservices

| Service        | Language     | Stack                           |
| -------------- | ------------ | ------------------------------- |
| **Auth**       | Java 21      | Spring Boot, Keycloak (sidecar) |
| **Profile**    | Java 21      | Spring Boot, JPA, Logback       |
| **Learning**   | .NET 9       | ASP.NET, EF, Serilog            |
| **Scheduling** | Go 1.24+     | Chi, SQLX, Zap logger           |
| **Payment**    | Python 3.11+ | FastAPI, SQLAlchemy, Loguru     |
| **Chat**       | *(Planned)*  | NestJS                          |

* **RabbitMQ**: Async messaging between services
* **PostgreSQL**: Database for all services (one per service)
* **Liquibase**: DB migrations (enabled via script)

### 🔍 Observability Stack

* **OpenTelemetry**: Tracing and metrics
* **Grafana + Prometheus**: Monitoring dashboards
* **Loki + Tempo**: Logs and distributed traces

### 🌐 Infrastructure

* **NGINX**: Reverse proxy with HTTPS support (certs included)
* Services communicate internally over Docker networks
* External access via NGINX gateway
* Expects SSL certificates to be placed in the `nginx/certs/` directory
* HTTPS is enabled by default for all public services

### 🔧 Scripts & Tools

### ✅ `scripts/init-db.sh`

Initializes PostgreSQL databases for all services.

### ▶ `scripts/run.ps1`

Run the full stack using Docker Compose with optional parameters:

```powershell
Param(
    [string]$df = "docker-compose.yml",     # Docker Compose file (default)
    [string]$ef = ".env.example",           # Environment variable file
    [switch]$wm = $false                    # Run Liquibase migrations (true/false)
)
```

Example usage:

```powershell
.\scripts\run.ps1 -df "docker-compose.yml" -ef ".env.example" -wm
```

### 📦 Docker Overview

* All services are containerized and orchestrated via **Docker Compose**.
* Each backend service runs in its own container and exposes APIs internally.
* The **frontend web app** is built and served via **NGINX**.
* The **NGINX container** acts as a reverse proxy and HTTPS termination point.

### 📈 Monitoring & Logging

In the `configs/` folder:

* `otel-config.yml`: OpenTelemetry agent configuration
* `prometheus.yml`: Prometheus scraping targets
* `loki-config.yml`, `tempo-config.yml`: Logging and tracing configs
* `grafana/`: Dashboards and datasource config
* Each microservice integrates OpenTelemetry + structured logging

### 🔐 Authentication & Authorization

* **Keycloak** is used as the authentication and identity provider.
* A custom **Auth service** wraps Keycloak with domain-specific logic.
* Realm configuration is stored in `configs/realm-config.json`.

### 🧪 Development Notes

* All services are under **active development** and subject to change.
* Many components are incomplete or experimental.
* Expect **bugs, inconsistent behavior, and rough edges** — this is a **learning-first** project.
