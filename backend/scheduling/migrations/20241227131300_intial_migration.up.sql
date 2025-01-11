BEGIN;

CREATE TABLE working_period (
    id          BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID        NOT NULL,
    date        DATE        NOT NULL,
    start_time  TIME        NOT NULL,
    end_time    TIME        NOT NULL,
    created_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_working_period_user_id ON working_period(user_id);
CREATE INDEX idx_working_period_date ON working_period(date);

CREATE TABLE scheduled_event (
    id                  BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    session_id          BIGINT      NOT NULL,
    working_period_id   BIGINT      NOT NULL,
    user_id             UUID        NOT NULL,
    start_time          TIME,
    end_time            TIME,
    max_participants    INT         NOT NULL,
    created_at          TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (working_period_id) REFERENCES working_period(id) ON DELETE CASCADE
);

CREATE INDEX idx_scheduled_event_session_id ON scheduled_event(session_id);
CREATE INDEX idx_scheduled_event_user_id ON scheduled_event(user_id);
CREATE INDEX idx_scheduled_event_working_period_id ON scheduled_event(working_period_id);

CREATE TABLE booking (
    id                  BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    teacher_id          UUID        NOT NULL,
    student_id          UUID        NOT NULL,
    session_id          BIGINT      NOT NULL,
    scheduled_event_id  BIGINT,
    working_period_id   BIGINT      NOT NULL,
    start_time          TIME        NOT NULL,
    end_time            TIME        NOT NULL,
    status              INT         NOT NULL,
    created_at          TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_booking_teacher_id ON booking(teacher_id);
CREATE INDEX idx_booking_student_id ON booking(student_id);
CREATE INDEX idx_booking_session_id ON booking(session_id);
CREATE INDEX idx_booking_working_period_id ON booking(working_period_id);

COMMIT;