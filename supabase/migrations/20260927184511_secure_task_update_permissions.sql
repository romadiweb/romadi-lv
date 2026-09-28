-- Keep task editing aligned with the portal workflow:
-- creators can edit the full task, while assignees can only complete it.

drop policy if exists "portal users can create tasks" on public.portal_tasks;
create policy "portal users can create tasks"
  on public.portal_tasks for insert to authenticated
  with check (
    (select auth.uid()) is not null
    and created_by_user_id = (select auth.uid())
    and (select auth.jwt()) -> 'app_metadata' ->> 'role' in ('admin', 'super-admin')
  );

drop policy if exists "portal users can update tasks" on public.portal_tasks;
create policy "task creators and assignees can update tasks"
  on public.portal_tasks for update to authenticated
  using (
    (select auth.uid()) is not null
    and (
      (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'super-admin'
      or created_by_user_id = (select auth.uid())
      or assigned_to_user_id = (select auth.uid())
      or (
        created_by_user_id is null
        and lower(created_by) = lower(coalesce((select auth.jwt()) ->> 'email', ''))
      )
      or (
        assigned_to_user_id is null
        and lower(assigned_to) = lower(coalesce((select auth.jwt()) ->> 'email', ''))
      )
    )
  )
  with check (
    (select auth.uid()) is not null
    and (
      (select auth.jwt()) -> 'app_metadata' ->> 'role' = 'super-admin'
      or created_by_user_id = (select auth.uid())
      or assigned_to_user_id = (select auth.uid())
      or (
        created_by_user_id is null
        and lower(created_by) = lower(coalesce((select auth.jwt()) ->> 'email', ''))
      )
      or (
        assigned_to_user_id is null
        and lower(assigned_to) = lower(coalesce((select auth.jwt()) ->> 'email', ''))
      )
    )
  );

create or replace function private.guard_portal_task_update()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  current_user_email text := lower(coalesce((select auth.jwt()) ->> 'email', ''));
  current_user_role text := (select auth.jwt()) -> 'app_metadata' ->> 'role';
  is_creator boolean;
  is_assignee boolean;
begin
  if current_user_id is null or current_user_role = 'super-admin' then
    return new;
  end if;

  if new.id is distinct from old.id
    or new.created_by is distinct from old.created_by
    or new.created_by_user_id is distinct from old.created_by_user_id
    or new.created_at is distinct from old.created_at
  then
    raise exception using
      errcode = '42501',
      message = 'Task ownership fields cannot be changed.';
  end if;

  is_creator := old.created_by_user_id = current_user_id
    or (
      old.created_by_user_id is null
      and lower(coalesce(old.created_by, '')) = current_user_email
    );
  if is_creator then
    return new;
  end if;

  is_assignee := old.assigned_to_user_id = current_user_id
    or (
      old.assigned_to_user_id is null
      and lower(coalesce(old.assigned_to, '')) = current_user_email
    );

  if not is_assignee then
    raise exception using
      errcode = '42501',
      message = 'Only the task creator can edit this task.';
  end if;

  if new.status <> 'done'
    or new.title is distinct from old.title
    or new.description is distinct from old.description
    or new.assigned_to is distinct from old.assigned_to
    or new.assigned_to_user_id is distinct from old.assigned_to_user_id
    or new.priority is distinct from old.priority
    or new.task_type is distinct from old.task_type
    or new.due_date is distinct from old.due_date
    or new.source_module is distinct from old.source_module
    or new.source_record_id is distinct from old.source_record_id
  then
    raise exception using
      errcode = '42501',
      message = 'Task assignees can only mark a task as done.';
  end if;

  new.completed_at := statement_timestamp();
  return new;
end;
$$;

revoke all on function private.guard_portal_task_update() from public;

drop trigger if exists portal_tasks_authorize_update on public.portal_tasks;
create trigger portal_tasks_authorize_update
before update on public.portal_tasks
for each row execute function private.guard_portal_task_update();
