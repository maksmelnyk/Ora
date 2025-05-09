begin;

create table if not exists working_period (
   id             bigint         generated always as identity primary key,
   user_id        uuid           not null,
   start_time     timestamptz    not null,
   end_time       timestamptz    not null,
   created_at     timestamptz    not null default current_timestamp,
   updated_at     timestamptz    not null default current_timestamp
);

create table if not exists scheduled_event (
   id                   bigint         generated always as identity primary key,
   user_id              uuid           not null,
   product_id           bigint         not null,
   lesson_id            bigint,
   title                text,
   working_period_id    bigint         not null    references working_period ( id ),
   start_time           timestamptz,
   end_time             timestamptz,
   max_participants     int            not null,
   created_at           timestamptz    not null    default current_timestamp,
   updated_at           timestamptz    not null    default current_timestamp
);

create table if not exists booking (
   id                   bigint         generated always as identity primary key,
   educator_id          uuid           not null,
   student_id           uuid           not null,
   product_id           bigint         not null,
   enrollment_id        bigint,
   scheduled_event_id   bigint,
   working_period_id    bigint         not null,
   title                text,
   start_time           timestamptz    not null,
   end_time             timestamptz    not null,
   status               int            not null,
   created_at           timestamptz    not null default current_timestamp,
   updated_at           timestamptz    not null default current_timestamp
);

create index if not exists idx_working_period_user_id on working_period (user_id);
create index if not exists idx_working_period_start_time_end_time on working_period (start_time, end_time);

create index if not exists idx_scheduled_event_product_id on scheduled_event (product_id);
create index if not exists idx_scheduled_event_user_id on scheduled_event (user_id);
create index if not exists idx_scheduled_event_working_period_id on scheduled_event (working_period_id);
create index if not exists idx_scheduled_event_start_time_end_time on working_period (start_time, end_time);

create index if not exists idx_booking_educator_id on booking (educator_id);
create index if not exists idx_booking_student_id on booking (student_id);
create index if not exists idx_booking_enrollment_id on booking (enrollment_id);
create index if not exists idx_booking_product_id on booking (product_id);
create index if not exists idx_booking_working_period_id on booking (working_period_id);

commit;