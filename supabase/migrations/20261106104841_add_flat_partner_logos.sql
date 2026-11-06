-- Keep flat partner marks separate from portfolio and metallic project marks.
alter table public.projects add column partner_logo_url text;
comment on column public.projects.partner_logo_url is
  'Flat transparent logo for the white homepage partner belt. Never use metallic artwork here.';

update public.projects set partner_logo_url = case slug
  when 'diana-hunt' then '/images/clients/diana.png'
  when 'liepajas-teltis' then '/images/clients/liepajas-teltis.svg'
  when 'rtu-liepajas-jurniecibas-koledza' then '/images/clients/ljk.png'
  when 'lalu' then '/images/clients/lalu.svg'
  when 'lr-events' then '/images/clients/lr-events.svg'
end
where slug in ('diana-hunt', 'liepajas-teltis', 'rtu-liepajas-jurniecibas-koledza', 'lalu', 'lr-events');
