# Angular + Spring Boot Application

Important Links:
Backend Repo Link: https://github.com/TIMOTHYBABA2023/turnkey-phonebook-app
Frontend Repo Link: https://github.com/TIMOTHYBABA2023/turnkey-frontend-pb-app



This is a full-stack application built with Angular for the frontend and Spring Boot for the backend. The frontend is developed using TypeScript, Bootstrap for styling, and Reactive Forms for form handling, while the backend is powered by Java 17, PostgreSQL, Spring OpenAPI for API documentation, and ModelMapper for entity-to-DTO conversion.

## Table of Contents
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Requirements
Ensure you have the following installed before running the application:
- [Node.js](https://nodejs.org/) (LTS recommended)
- [Angular CLI](https://angular.io/cli)
- [Git](https://git-scm.com/)
- [Java 17](https://adoptium.net/)
- [Gradle](https://gradle.org/)
- [PostgreSQL](https://www.postgresql.org/)

## Installation
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <project-directory>
   ```
2. Install frontend dependencies:
   ```sh
   npm install
   ```
3. Follow instructions to build the backend from the README.md file of the backend, link below:

    https://github.com/TIMOTHYBABA2023/turnkey-phonebook-app
   ```

## Configuration
Ensure you have the necessary environment settings:

### Frontend (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/contacts'
};
```

### Backend (`src/main/resources/application.yml`):
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/your_database_name
    username: your_username
    password: your_password
    driver-class-name: org.postgresql.Driver
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: update
    show-sql: true
```

## Running the Application
### Backend
Run the Spring Boot backend:
```sh
./gradlew bootRun
```
OR
```sh
java -jar build/libs/your-application.jar
```

### Frontend
Start the Angular frontend:
```sh
ng serve
```
By default, the application runs at:
```
http://localhost:4200/
```

## API Documentation
Once the backend is running, access the API documentation at:
```
http://localhost:8080/swagger-ui.html
```
OR
```
http://localhost:8080/v3/api-docs
```

## Technologies Used
- Angular
- TypeScript
- Bootstrap
- Reactive Forms
- Angular CLI
- Java 17
- Spring Boot
- PostgreSQL
- Spring Data JPA
- Spring OpenAPI (Swagger)
- ModelMapper
- Gradle

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

