# Hugging Face Space (Docker SDK) — builds the Banking System backend from GitHub.
# Put this file (and README.md) at the ROOT of your Space repo. The Space supplies
# DB_URL / REDIS_* / JWT_SECRET / etc. as Variables & Secrets (read as env vars).

FROM maven:3.9-eclipse-temurin-21 AS build
ARG REPO=https://github.com/CJ2k4/BankingSystem.git
ARG REF=main
RUN git clone --depth 1 --branch ${REF} ${REPO} /src
WORKDIR /src/backend
RUN mvn -B -q clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /src/backend/target/*.jar app.jar
# Hugging Face routes traffic to app_port (set to 8080 in README.md).
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
