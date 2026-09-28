-- Add GetaPro as a quota area for weekly proposal activity.

insert into public.portal_quota_metrics (
  area_key,
  area_label,
  metric_key,
  metric_label,
  description,
  calculation_key,
  sort_order
)
values (
  'getapro',
  'GetaPro',
  'sent-proposals',
  'Izsūtītie piedāvājumi',
  'Pabeigtie uzdevumi, kas piesaistīti šīs nedēļas GetaPro piedāvājumu kvotai.',
  'completed-quota-tasks',
  10
)
on conflict (area_key, metric_key) do update
set
  area_label = excluded.area_label,
  metric_label = excluded.metric_label,
  description = excluded.description,
  calculation_key = excluded.calculation_key,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = statement_timestamp();
