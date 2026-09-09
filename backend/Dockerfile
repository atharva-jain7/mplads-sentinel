# Stage 1: Build the Spring Boot application using Maven and Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the executable jar skipping tests
RUN mvn clean package -DskipTests

# Find the built executable jar (ignoring any .original jar) and copy to standard location
RUN find target -name "*.jar" ! -name "*original*" -exec cp {} app.jar \;

# Stage 2: Minimal Java 21 runtime image
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy executable jar from build stage
COPY --from=build /app/app.jar app.jar

# Render exposes dynamic PORT (default fallback 8080)
ENV PORT=8080
EXPOSE 8080

# Configure JVM flags optimized for Render Free Tier (512MB RAM limit)
ENTRYPOINT ["sh", "-c", "java -XX:MaxRAMPercentage=75.0 -XX:+UseSerialGC -Xss512k -Dserver.port=${PORT} -jar app.jar"]
