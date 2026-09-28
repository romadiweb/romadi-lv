-- Count contacted GetAPro leads in the weekly GetAPro quota.

update public.portal_quota_metrics
set
  calculation_key = 'contacted-getapro-leads',
  description = 'GetAPro atrastie lead, kas šajā nedēļā ir uzrunāti.',
  updated_at = statement_timestamp()
where area_key = 'getapro'
  and metric_key = 'sent-proposals';
