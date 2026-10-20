-- Preserve the actual completer, rather than assuming the assignee completed a task.
alter table public.portal_tasks add column completed_by text;
-- Keep the historical actor snapshot even if their account is later removed.
alter table public.portal_tasks add column completed_by_user_id uuid;

-- Fill known historical completers from audit records; leave unknown actors unspecified.
with completions as (
  select distinct on (record_id) record_id, actor_id
  from public.cms_audit_log
  where table_name = 'portal_tasks' and new_data ->> 'status' = 'done'
    and (old_data ->> 'status') is distinct from 'done'
  order by record_id, changed_at desc
)
update public.portal_tasks t set completed_by_user_id = u.id, completed_by = u.email
from completions c left join public.portal_users u on u.id = c.actor_id
where t.id = c.record_id and t.status = 'done';

create function private.stamp_portal_task_completion()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if new.status = 'done' then
    if tg_op = 'INSERT' or old.status is distinct from 'done' then
      new.completed_at := statement_timestamp();
      new.completed_by := (select auth.jwt()) ->> 'email';
      new.completed_by_user_id := (select auth.uid());
    else
      new.completed_at := old.completed_at;
      new.completed_by := old.completed_by;
      new.completed_by_user_id := old.completed_by_user_id;
    end if;
  else
    new.completed_at := null;
    new.completed_by := null;
    new.completed_by_user_id := null;
  end if;
  return new;
end;
$$;
revoke all on function private.stamp_portal_task_completion() from public;
create trigger portal_tasks_z_stamp_completion before insert or update on public.portal_tasks
for each row execute function private.stamp_portal_task_completion();

create table public.portal_task_notifications (
  id bigint generated always as identity primary key,
  task_id bigint not null references public.portal_tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index portal_task_notifications_user_created_idx
on public.portal_task_notifications(user_id, created_at desc);
create index portal_task_notifications_task_idx on public.portal_task_notifications(task_id);
alter table public.portal_task_notifications enable row level security;
revoke all on public.portal_task_notifications from anon, authenticated;
grant select on public.portal_task_notifications to authenticated;
grant update(read_at) on public.portal_task_notifications to authenticated;
create policy "Recipients can read task notifications" on public.portal_task_notifications
for select to authenticated using (user_id = (select auth.uid())
and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin'));
create policy "Recipients can mark task notifications read" on public.portal_task_notifications
for update to authenticated using (user_id = (select auth.uid())
and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin'))
with check (user_id = (select auth.uid())
and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin'));

-- The private trigger writes for the recipient; callers cannot create arbitrary notifications.
create function private.notify_portal_task_assignment()
returns trigger language plpgsql security definer set search_path = '' as $$
declare recipient uuid;
begin
  if (select auth.uid()) is null then return new; end if;
  recipient := new.assigned_to_user_id;
  if recipient is null then
    select id into recipient from public.portal_users
    where lower(email) = lower(new.assigned_to) and is_active limit 1;
  end if;
  if tg_op = 'UPDATE' then
    if new.assigned_to_user_id is not distinct from old.assigned_to_user_id
      and (new.assigned_to_user_id is not null
        or lower(new.assigned_to) is not distinct from lower(old.assigned_to)) then return new; end if;
    delete from public.portal_task_notifications where task_id = new.id;
  end if;
  if recipient is not null and new.status not in ('done', 'cant_do') then
    insert into public.portal_task_notifications(task_id, user_id) values (new.id, recipient);
  end if;
  return new;
end;
$$;
revoke all on function private.notify_portal_task_assignment() from public;
create trigger portal_tasks_notify_assignment after insert or update on public.portal_tasks
for each row execute function private.notify_portal_task_assignment();

-- Existing open assignments should be discoverable on first use too.
insert into public.portal_task_notifications(task_id, user_id, created_at)
select t.id, u.id, t.created_at from public.portal_tasks t join public.portal_users u
on u.id = t.assigned_to_user_id or (t.assigned_to_user_id is null and lower(u.email) = lower(t.assigned_to))
where t.status not in ('done', 'cant_do') and u.is_active;


-- Complete the two existing portfolio case studies.
update public.projects set summary = 'Telšu un pasākumu inventāra nomas vietne ar pārskatāmu katalogu, nomas sarakstu un rezervācijas pieprasījumu vienuviet.', project_url = coalesce(project_url, 'https://liepajasteltis.lv'), challenge = coalesce(challenge, 'Palīdzēt pasākumu rīkotājiem atrast piemērotas teltis un inventāru un ērti nosūtīt vienotu nomas pieprasījumu.'), solution = coalesce(solution, 'Izveidojām vietni ar inventāra kategorijām, nomas sarakstu un pieteikuma formu, kur norādīt pasākuma datumu, vietu un vajadzīgo aprīkojumu.'), features = case when cardinality(features) = 0 then array['Telšu un inventāra katalogs', 'Nomas saraksts', 'Rezervācijas pieprasījuma forma', 'Piegādes un kontaktinformācija'] else features end where slug = 'liepajas-teltis';
update public.projects set summary = 'Jūrniecības koledžas vietne, kas apvieno studiju programmas, aktualitātes un ikdienā nepieciešamo informāciju topošajiem un esošajiem studentiem.', project_url = coalesce(project_url, 'https://ljk.lv'), challenge = coalesce(challenge, 'Sakārtot plašo koledžas informāciju tā, lai studiju interesenti un studenti ātri atrastu sev vajadzīgo.'), solution = coalesce(solution, 'Veidojām pārskatāmu informācijas struktūru ar studiju programmām, aktualitātēm, dokumentiem un koledžas kontaktinformāciju.'), features = case when cardinality(features) = 0 then array['Studiju programmu pārskats', 'Koledžas aktualitātes', 'Dokumenti un noderīga informācija', 'Kontaktinformācija'] else features end where slug = 'rtu-liepajas-jurniecibas-koledza';
