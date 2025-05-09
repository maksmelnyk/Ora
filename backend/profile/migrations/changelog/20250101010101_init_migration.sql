begin;

create table if not exists user_profile (
    id                  uuid            not null    primary key,
    first_name          varchar(50)     not null,
    last_name           varchar(50)     not null,
    image_url           varchar(500),
    bio                 varchar(2000),
    birth_date          date            not null,
    created_date        timestamptz     not null,
    last_modified_date  timestamptz,
    deleted_date        timestamptz
);

create index if not exists  idx_user_profile_active
    on user_profile(id)
    where deleted_date is null;

create table if not exists educator_profile (
    user_profile_id     uuid            not null    references user_profile(id),
    bio                 varchar(2000),
    experience          varchar(2000),
    status              int             not null,
    has_product         boolean         not null,
    created_date        timestamptz     not null,
    last_modified_date  timestamptz,
    deleted_date        timestamptz
);

create index if not exists  idx_educator_profile_active
    on educator_profile(user_profile_id)
    where deleted_date is null;

commit;