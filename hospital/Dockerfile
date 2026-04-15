FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy all project files
COPY . .

# Give permission to mvnw
RUN chmod +x mvnw

# Build the project (this creates the JAR inside container)
RUN ./mvnw clean package -DskipTests

# Run the application
CMD ["java", "-jar", "target/*.jar"]
