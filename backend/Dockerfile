# Use OpenJDK 17 base image
FROM openjdk:17-jdk-slim

# Set working directory inside container
WORKDIR /app

# Copy the jar file into the container
COPY target/backend.jar backend.jar

# Expose the port your backend uses
EXPOSE 8080

# Command to run the app
ENTRYPOINT ["java", "-jar", "backend.jar"]



