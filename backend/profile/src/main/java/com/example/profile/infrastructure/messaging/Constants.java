package com.example.profile.infrastructure.messaging;

public class Constants {
    // Queues
    public static final String PROFILE_QUEUE_NAME = "profile-events-queue";
    public static final String PROFILE_DLQ_NAME = "profile-events-dlq";
    public static final String PROFILE_DLQ_ROUTING_KEY = "dlq.profile";

    // Patterns
    public static final String AUTH_TO_PROFILE_PATTERN = "auth.to.profile.#";
    public static final String LEARNING_TO_PROFILE_PATTERN = "learning.to.profile.#";

    // Routing keys
    public static final String REGISTRATION_COMPLETED_KEY = "profile.to.auth.registration.completed";
    public static final String EDUCATOR_CREATED_KEY = "profile.to.auth.educator.created";
    public static final String EDUCATOR_UPDATED_KEY = "profile.to.learning.educator.updated";

    // Event types
    public static final String EDUCATOR_CREATED = "EDUCATOR_CREATED";
    public static final String EDUCATOR_PRODUCT_CREATED = "EDUCATOR_PRODUCT_CREATED";
    public static final String EDUCATOR_PROFILE_UPDATED = "EDUCATOR_PROFILE_UPDATED";
    public static final String REGISTRATION_INITIATED = "REGISTRATION_INITIATED";
    public static final String REGISTRATION_COMPLETED = "REGISTRATION_COMPLETED";
}
