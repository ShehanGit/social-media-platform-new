FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]


# # Backend Dockerfile
# FROM openjdk:17-jdk-slim as build
# WORKDIR /app
# COPY pom.xml ./
# COPY src ./src
# RUN ./mvnw clean package -DskipTests

# FROM openjdk:17-jdk-slim
# WORKDIR /app
# COPY --from=build /app/target/social-media-backend-0.0.1-SNAPSHOT.jar app.jar
# EXPOSE 8080
# ENTRYPOINT ["java", "-jar", "app.jar"]
