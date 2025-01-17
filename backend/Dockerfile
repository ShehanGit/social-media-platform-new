# Stage 1: Build the application
FROM maven:3.8.4-openjdk-17-slim AS build

# Set working directory
WORKDIR /app

# Copy only pom.xml first to leverage Docker cache layers
COPY pom.xml .

# Download all required dependencies into one layer
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image
FROM openjdk:17-jdk-slim

# Add a volume pointing to /tmp
VOLUME /tmp

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Set application's JAR file
ARG JAR_FILE=/app/target/*.jar

# Copy the JAR file from build stage
COPY --from=build ${JAR_FILE} app.jar

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Run the jar file
ENTRYPOINT ["java", "-jar", "/app.jar"]