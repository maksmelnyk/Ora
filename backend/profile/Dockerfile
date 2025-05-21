FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw

COPY src src/
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

RUN adduser -D -u 1001 appuser \
    && mkdir -p logs && chown -R appuser:appuser logs

COPY --from=build /app/target/*.jar profile.jar

USER appuser

ENTRYPOINT ["java", "-jar", "profile.jar"]
