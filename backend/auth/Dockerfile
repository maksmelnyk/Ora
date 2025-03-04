FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY .mvn .mvn
COPY mvnw mvnw
COPY pom.xml pom.xml
RUN chmod +x mvnw
COPY src src/
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

COPY --from=build /app/target/*.jar auth.jar

RUN adduser -D appuser
USER appuser

ENTRYPOINT ["java", "-jar", "auth.jar"]
