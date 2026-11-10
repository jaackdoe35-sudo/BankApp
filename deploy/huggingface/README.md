---
title: Banking System API
emoji: 🏦
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 8080
pinned: false
---

# Banking System — Backend API

Spring Boot backend for the [Banking System](https://github.com/CJ2k4/BankingSystem).
This Space builds the backend from the GitHub repo via the Dockerfile and runs it on
port 8080. Data services (Postgres, Redis) and secrets are configured as Space
**Variables and secrets**.

Health check: `/actuator/health` · API docs: `/swagger-ui.html`
