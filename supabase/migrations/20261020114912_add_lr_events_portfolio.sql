-- No screenshot yet: a null portfolio_image_url selects the gradient preview.
insert into public.projects (
  slug, name, type, status, build_platform, logo_url, portfolio_image_url,
  project_url, summary, sort_order, is_featured, is_published
) values (
  'lr-events', 'LR Events', 'website', 'in_progress', 'Custom izstrāde',
  '/images/projects/lr-events-logo.png', null, 'https://lrevents-lv.vercel.app/',
  'Top autosporta pasākumu vietne ar informāciju par auto, moto un sporta pasākumiem Latvijā, reģistrāciju, nolikumiem un rezultātiem.',
  40, false, true
)
on conflict (slug) do nothing;
