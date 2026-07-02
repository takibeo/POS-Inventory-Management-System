# pos-inventory-backend

Backend for the POS and Inventory Management system built with Spring Boot, PostgreSQL, Spring Security, JWT, and JPA.

## Tech stack

- Java 17+
- Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA + PostgreSQL
- Flyway for database migrations
- OpenAPI / Swagger UI
- JUnit 5 + Mockito for testing

## Prerequisites

- JDK 17 or newer
- PostgreSQL running locally or via Docker
- Maven 3.8+

## Environment variables

The application uses the following main settings in [src/main/resources/application.yml](src/main/resources/application.yml):

- `spring.datasource.url` / `spring.datasource.username` / `spring.datasource.password`
- `jwt.secret`
- `jwt.expiration-ms`
- `jwt.refresh-expiration-ms`

For local development, keep sensitive values in environment variables or a local override file if needed.

## Run locally

1. Start the database

If you are using Docker Compose from the repository root:

```bash
docker compose up -d postgres
```

2. Build the project

```bash
mvn clean package
```

3. Run the application

```bash
mvn spring-boot:run
```

The API will be available at:

- http://localhost:8080/api
- Swagger UI: http://localhost:8080/swagger-ui/index.html

## Main modules

- Authentication and user management
- Branch, category, supplier, product, inventory management
- Purchase order and sale invoice workflows
- Reporting endpoints for revenue, profit, best sellers, and low stock

## Testing

Run unit tests:

```bash
mvn test
```

Run a single test class:

```bash
mvn -Dtest=ReportServiceImplTest test
```

## Security and performance notes

- JWT secrets should be kept out of source control in real deployments.
- Use strong database credentials and limit direct DB access.
- Keep validation enabled on all request DTOs to avoid malformed input.
- Monitor runtime logs and slow endpoints during demo and production load.
- Inventory updates now use pessimistic locking to reduce race conditions during concurrent adjustments.
- JPA open-in-view is disabled and SQL logging is reduced to avoid unnecessary overhead in production-like runs.

## Week 4 backend completion summary

The backend has been hardened for the Week 4 implementation milestone:
- Added validation for null/blank category names and invalid report limits.
- Prevented inventory adjustments that would push quantities below zero.
- Improved global error handling for malformed JSON and bad request input.
- Expanded Swagger documentation for main controllers.
- Added and verified unit tests for core service behavior.

