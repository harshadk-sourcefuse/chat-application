SET search_path
TO main,public;

insert into auth_clients
  (client_id, client_secret, secret, redirect_url)
values
  ('avengers', 'avengers', 'secret', 'http://localhost:4200/');

insert into roles
  (name, permissions, role_type)
values
  ('Admin', ARRAY['ViewMessage', 'CreateMessage', 'UpdateMessage', 'DeleteMessage', 'CreateMessageRecipient', 'ViewMessageRecipient', 'UpdateMessageRecipient', 'DeleteMessageRecipient', '1', '2', '3', '4', '5', '6', '7', '8', 'CreateAttachmentFile', 'ViewAttachmentFile', 'UpdateAttachmentFile', 'DeleteAttachmentFile', 'ViewNotification', 'CreateNotification', 'UpdateNotification', 'DeleteNotification', 'CanGetNotificationAccess', 'ViewChannel', 'CreateChannel', 'UpdateChannel', 'DeleteChannel'], 0),
  ('User', ARRAY['ViewMessage', 'CreateMessage', 'UpdateMessage', 'DeleteMessage', 'CreateMessageRecipient', 'ViewMessageRecipient', 'UpdateMessageRecipient', 'DeleteMessageRecipient', '1', '2', '3', '4', '5', '6', '7', '8', 'CreateAttachmentFile', 'ViewAttachmentFile', 'UpdateAttachmentFile', 'DeleteAttachmentFile', 'ViewNotification', 'CreateNotification', 'UpdateNotification', 'DeleteNotification', 'CanGetNotificationAccess', 'ViewChannel', 'CreateChannel', 'UpdateChannel', 'DeleteChannel'], 1);

insert into tenants
  (name, status, key)
values
  ('avengers', 1, 'avengers');

/* Password - Pass@123 */
insert into users
    (first_name, last_name, username, email, default_tenant_id)
select 'Thor', 'Odinson', 'thor.odinson', 'thor.odinson@avengers.com', id
from tenants
where key = 'avengers';
insert into user_tenants
    (user_id, tenant_id, status, role_id)
select (select id
    from users
    where username = 'thor.odinson'), (select id
    from tenants
    where key = 'avengers'), 1, id
from roles
where role_type = 1;
insert into user_credentials
    (user_id, auth_provider, password)
select id, 'internal', '$2a$10$dH/FhlVpNRfrNJgBfh6SJOqieyC.Ta1u/oo8e52CeF5bqbCDmT2ty'
from users
where username = 'thor.odinson';
update users set auth_client_ids = ARRAY[(select id from auth_clients where client_id = 'avengers')::integer];

/* Password - Pass@123 */
insert into users
    (first_name, last_name, username, email, default_tenant_id)
select 'Tony', 'Stark', 'tony.stark', 'tony.stark@avengers.com', id
from tenants
where key = 'avengers';
insert into user_tenants
    (user_id, tenant_id, status, role_id)
select (select id
    from users
    where username = 'tony.stark'), (select id
    from tenants
    where key = 'avengers'), 1, id
from roles
where role_type = 1;
insert into user_credentials
    (user_id, auth_provider, password)
select id, 'internal', '$2a$10$dH/FhlVpNRfrNJgBfh6SJOqieyC.Ta1u/oo8e52CeF5bqbCDmT2ty'
from users
where username = 'tony.stark';
update users set auth_client_ids = ARRAY[(select id from auth_clients where client_id = 'avengers')::integer];