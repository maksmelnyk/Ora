begin;

create table if not exists transaction (
   id                      bigint            generated always as identity primary key,
   user_id                 uuid              not null,
   product_id              bigint            not null,
   scheduled_event_id      bigint,
   provider_id             bigint            not null,
   provider_reference_id   varchar(255)      not null,
   price                   numeric(18,2)     not null,
   currency                varchar(10)       not null,
   status                  varchar(50)       not null,
   created_at              timestamptz       not null,
   updated_at              timestamptz       not null
);

create index if not exists idx_transaction_user_id on transaction(user_id);

commit;