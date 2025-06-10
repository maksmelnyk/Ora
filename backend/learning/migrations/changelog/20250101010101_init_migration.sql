begin;

create table if not exists profile_summary (
    user_id         uuid            not null    primary key, 
    first_name      varchar(255)    not null,
    last_name       varchar(255)    not null,
    image_url       varchar(500)
);

create table if not exists category (
    id      bigint      generated always as identity primary key,
    name    text        not null    unique
);

create table if not exists sub_category (
    id              bigint      generated always as identity primary key,
    name            text        not null,
    category_id     bigint      not null references category(id) on delete cascade,
    unique (name, category_id)
);

create table if not exists product (
    id                  bigint          generated always as identity primary key,
    educator_id         uuid            not null,
    sub_category_id     bigint          not null references sub_category(id),
    type                int             not null,
    status              int             not null,
    level               int             not null,
    title               varchar(255)    not null,
    objectives          varchar(2000),
    description         varchar(2000),
    highlights          varchar(2000),
    audience            varchar(2000),
    requirements        varchar(2000),
    language            varchar(10),
    image_url           varchar(200),
    video_url           varchar(200),
    price               decimal(18,2)   not null,
    has_enrollment      boolean         not null,
    created_at          timestamptz     not null default current_timestamp,
    updated_at          timestamptz     not null default current_timestamp,
    deleted_at          timestamptz,
    last_scheduled_at   timestamptz
);

create table if not exists private_session_product (
    product_id      bigint  primary key,
    duration_min    int     not null,
    foreign key (product_id) references product (id) on delete cascade
);

create table if not exists online_course_product (
    product_id          bigint          primary key,
    max_participants    int             not null,
    start_time          timestamptz,
    end_time            timestamptz,
    foreign key (product_id) references product (id) on delete cascade
);

create table if not exists group_session_product (
    product_id          bigint  primary key,
    duration_min        int     not null,
    max_participants    int     not null,
    foreign key (product_id) references product (id) on delete cascade
);

create table if not exists module (
    id              bigint          generated always as identity primary key,
    product_id      bigint          not null,
    title           varchar(255)    not null,
    description     varchar(2000),
    sort_order      int             not null,
    created_at      timestamptz     not null default current_timestamp,
    updated_at      timestamptz     not null default current_timestamp,
    deleted_at      timestamptz,
    foreign key (product_id) references product (id) on delete cascade
);

create table if not exists lesson (
    id              bigint          generated always as identity primary key,
    module_id       bigint          not null,
    title           varchar(255)    not null,
    description     varchar(2000),
    duration_min    int             not null,
    sort_order      int             not null,
    created_at      timestamptz     not null default current_timestamp,
    updated_at      timestamptz     not null default current_timestamp,
    deleted_at      timestamptz,
    foreign key (module_id) references module (id) on delete cascade
);

create table if not exists enrollment (
    id                      bigint          generated always as identity primary key,
    product_id              bigint          not null    references product (id),
    scheduled_event_id      bigint          not null,
    user_id                 uuid            not null,
    status                  int             not null,
    created_at              timestamptz     not null default current_timestamp,
    updated_at              timestamptz     not null default current_timestamp
);

create index if not exists idx_product_not_deleted on product (id) where deleted_at is null;
create index if not exists idx_product_educator_id_not_deleted on product (educator_id) where deleted_at is null;
create index if not exists idx_product_sub_category_id_not_deleted on product (sub_category_id) where deleted_at is null;
create index if not exists idx_product_status_not_deleted on product (status) where deleted_at is null;
create index if not exists idx_product_type_not_deleted on product (type) where deleted_at is null;
create index if not exists idx_product_level_not_deleted on product (level) where deleted_at is null;
create index if not exists idx_product_language_not_deleted on product (language) where deleted_at is null;
create index if not exists idx_product_last_scheduled_at_not_deleted on product (last_scheduled_at) where deleted_at is null;

create index if not exists idx_module_product_id_sort_order_not_deleted on module (product_id, sort_order) where deleted_at is null;

create index if not exists idx_lesson_module_id_sort_order_not_deleted on lesson (module_id, sort_order) where deleted_at is null;

create index if not exists idx_enrollment_user_id_created_at on enrollment (user_id, created_at desc);
create index if not exists idx_enrollment_product_id on enrollment (product_id);

commit;