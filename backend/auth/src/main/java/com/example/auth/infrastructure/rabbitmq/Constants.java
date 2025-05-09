package com.example.auth.infrastructure.rabbitmq;

public class Constants {
    // Queues
    public static final String AUTH_QUEUE_NAME = "auth-events-queue";
    public static final String AUTH_DLQ_NAME = "auth-events-dlq";
    public static final String AUTH_DLQ_ROUTING_KEY = "dlq.auth";

    // Patterns
    public static final String AUTH_TO_PROFILE_PATTERN = "auth.to.profile.#";
    public static final String PROFILE_TO_AUTH_PATTERN = "profile.to.auth.#";

    // Routing keys
    public static final String REGISTRATION_INITIATED_KEY = "auth.to.profile.registration.initiated";
    public static final String REGISTRATION_COMPLETED_KEY = "profile.to.auth.registration.completed";
    public static final String TEACHER_REQUEST_KEY = "profile.to.auth.teacher.request";

    // Event types
    public static final String EDUCATOR_CREATED = "EDUCATOR_CREATED";
    public static final String REGISTRATION_INITIATED = "REGISTRATION_INITIATED";
    public static final String REGISTRATION_COMPLETED = "REGISTRATION_COMPLETED";
}
