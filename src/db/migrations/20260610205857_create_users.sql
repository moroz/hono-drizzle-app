-- +goose Up
create extension if not exists citext;

create table users (
    id uuid not null primary key default uuidv7(),
    email citext not null unique,
    password_hash varchar(255),
    display_name varchar(255) not null,
    inserted_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

-- +goose Down
drop table users;
