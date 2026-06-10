begin;

insert into users (email, password_hash, display_name)
values ('user@example.com', 'example', 'Example User')
on conflict (email) do nothing;

commit;