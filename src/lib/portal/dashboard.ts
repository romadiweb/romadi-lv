import type { PortalLead } from '@/types/database';

type Resource = 'projects' | 'reviews' | 'pricing_plans';
type View = Resource | 'audit' | 'leads';
type PortalRecord = Record<string, unknown> & { id: number };
type FieldType = 'text' | 'textarea' | 'url' | 'number' | 'date' | 'list' | 'checkbox';
type LeadStatus = PortalLead['status'];

interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  wide?: boolean;
  min?: number;
  max?: number;
}

interface ResourceDefinition {
  title: string;
  description: string;
  singular: string;
  labelKey: string;
  secondaryKey: string;
  defaults: Record<string, unknown>;
  fields: FieldDefinition[];
}

const leadColumns: { status: LeadStatus; label: string; group: 'pipeline' | 'parked' }[] = [
  { status: 'not_contacted', label: 'Nav uzrunāts', group: 'pipeline' },
  { status: 'contacted', label: 'Uzrunāts', group: 'pipeline' },
  { status: 'answered', label: 'Atbildēja', group: 'pipeline' },
  { status: 'interested', label: 'Ieinteresēts', group: 'pipeline' },
  { status: 'offer_sent', label: 'Piedāvājums nosūtīts', group: 'pipeline' },
  { status: 'negotiation', label: 'Sarunas', group: 'pipeline' },
  { status: 'client', label: 'Klients', group: 'pipeline' },
  { status: 'rejected', label: 'Noraidīts', group: 'parked' },
  { status: 'no_response', label: 'Neatbild', group: 'parked' },
  { status: 'deferred', label: 'Atlikts', group: 'parked' },
];

const channelLabels: Record<PortalLead['contact_channel'], string> = {
  email: 'E-pasts',
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  other: 'Cits',
  phone: 'Telefons',
};

const definitions: Record<Resource, ResourceDefinition> = {
  projects: {
    title: 'Projekti',
    description: 'Pārvaldi portfolio saturu un publicēšanas stāvokli.',
    singular: 'projekts',
    labelKey: 'name',
    secondaryKey: 'type',
    defaults: {
      alt_text: null,
      build_platform: '',
      challenge: null,
      completed_at: null,
      features: [],
      integrations: [],
      is_featured: false,
      is_published: false,
      logo_url: null,
      name: '',
      portfolio_image_url: null,
      project_url: null,
      slug: '',
      solution: null,
      sort_order: 0,
      summary: null,
      technologies: [],
      type: 'website',
    },
    fields: [
      { key: 'name', label: 'Nosaukums', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true, hint: 'mazie-burti-ar-defisem' },
      { key: 'type', label: 'Kategorija', type: 'text', required: true },
      { key: 'build_platform', label: 'Izstrādes platforma', type: 'text' },
      { key: 'summary', label: 'Kopsavilkums', type: 'textarea', wide: true },
      { key: 'challenge', label: 'Izaicinājums', type: 'textarea', wide: true },
      { key: 'solution', label: 'Risinājums', type: 'textarea', wide: true },
      { key: 'project_url', label: 'Projekta URL', type: 'url' },
      { key: 'logo_url', label: 'Logotipa ceļš', type: 'text' },
      { key: 'portfolio_image_url', label: 'Portfolio attēla ceļš', type: 'text' },
      { key: 'alt_text', label: 'Attēla alternatīvais teksts', type: 'text' },
      { key: 'features', label: 'Iespējas', type: 'list', wide: true, hint: 'Viena vērtība katrā rindā' },
      { key: 'technologies', label: 'Tehnoloģijas', type: 'list', wide: true },
      { key: 'integrations', label: 'Integrācijas', type: 'list', wide: true },
      { key: 'completed_at', label: 'Pabeigšanas datums', type: 'date' },
      { key: 'sort_order', label: 'Secība', type: 'number', required: true, min: 0 },
      { key: 'is_featured', label: 'Izcelts projekts', type: 'checkbox' },
      { key: 'is_published', label: 'Publicēts', type: 'checkbox' },
    ],
  },
  reviews: {
    title: 'Atsauksmes',
    description: 'Uzturi klientu citātus, autorus un publicēšanas secību.',
    singular: 'atsauksme',
    labelKey: 'client_name',
    secondaryKey: 'reviewer_name',
    defaults: {
      client_name: '',
      client_url: null,
      is_published: false,
      logo_url: null,
      quote: null,
      rating: 5,
      reviewer_name: null,
      reviewer_role: null,
      slug: '',
      sort_order: 0,
    },
    fields: [
      { key: 'client_name', label: 'Klienta nosaukums', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'quote', label: 'Atsauksmes teksts', type: 'textarea', wide: true },
      { key: 'reviewer_name', label: 'Atsauksmes autors', type: 'text' },
      { key: 'reviewer_role', label: 'Amats vai loma', type: 'text' },
      { key: 'client_url', label: 'Klienta URL', type: 'url' },
      { key: 'logo_url', label: 'Logotipa ceļš', type: 'text' },
      { key: 'rating', label: 'Vērtējums', type: 'number', min: 1, max: 5 },
      { key: 'sort_order', label: 'Secība', type: 'number', required: true, min: 0 },
      { key: 'is_published', label: 'Publicēta', type: 'checkbox' },
    ],
  },
  pricing_plans: {
    title: 'Cenu plāni',
    description: 'Rediģē pakalpojumu cenu kartes, saturu un redzamību.',
    singular: 'cenu plāns',
    labelKey: 'name',
    secondaryKey: 'service_key',
    defaults: {
      cta_href: null,
      cta_label: 'Sazināties',
      description: '',
      features: [],
      is_featured: false,
      is_published: false,
      name: '',
      price_label: '',
      price_prefix: 'Sākot no',
      service_key: '',
      sort_order: 0,
    },
    fields: [
      { key: 'name', label: 'Plāna nosaukums', type: 'text', required: true },
      { key: 'service_key', label: 'Pakalpojuma atslēga', type: 'text', required: true },
      { key: 'price_prefix', label: 'Cenas prefikss', type: 'text' },
      { key: 'price_label', label: 'Cena', type: 'text', required: true },
      { key: 'description', label: 'Apraksts', type: 'textarea', required: true, wide: true },
      { key: 'features', label: 'Iekļautais', type: 'list', wide: true, hint: 'Viena vērtība katrā rindā' },
      { key: 'cta_label', label: 'Pogas teksts', type: 'text', required: true },
      { key: 'cta_href', label: 'Pogas saite', type: 'text' },
      { key: 'sort_order', label: 'Secība', type: 'number', required: true, min: 0 },
      { key: 'is_featured', label: 'Izcelts plāns', type: 'checkbox' },
      { key: 'is_published', label: 'Publicēts', type: 'checkbox' },
    ],
  },
};

const $ = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Missing portal element: ${selector}`);
  return element;
};

const text = (tag: string, value: string, className?: string) => {
  const element = document.createElement(tag);
  element.textContent = value;
  if (className) element.className = className;
  return element;
};

const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat('lv-LV', { day: '2-digit', month: 'short' }).format(new Date(`${value}T12:00:00`))
    : 'Nav datuma';

const isFollowUpDue = (lead: PortalLead) => {
  if (!lead.follow_up_due_at) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return new Date(`${lead.follow_up_due_at}T12:00:00`) <= today;
};

export function initPortalDashboard(): void {
  const root = document.querySelector<HTMLElement>('[data-portal-dashboard]');
  if (!root || root.dataset.initialized === 'true') return;
  root.dataset.initialized = 'true';

  const csrf = root.dataset.csrf ?? '';
  const role = root.dataset.role;
  const canDelete = role === 'super-admin';
  const sectionTitle = $<HTMLElement>(root, '[data-section-title]');
  const sectionDescription = $<HTMLElement>(root, '[data-section-description]');
  const listStatus = $<HTMLElement>(root, '[data-list-status]');
  const contentList = $<HTMLElement>(root, '[data-content-list]');
  const workGrid = $<HTMLElement>(root, '[data-work-grid]');
  const leadGrid = $<HTMLElement>(root, '[data-lead-grid]');
  const editorPanel = $<HTMLElement>(root, '[data-editor-panel]');
  const editorTitle = $<HTMLElement>(root, '[data-editor-title]');
  const editorEmpty = $<HTMLElement>(root, '[data-editor-empty]');
  const editorForm = $<HTMLFormElement>(root, '[data-editor-form]');
  const formFields = $<HTMLElement>(root, '[data-form-fields]');
  const recordState = $<HTMLElement>(root, '[data-record-state]');
  const saveStatus = $<HTMLElement>(root, '[data-save-status]');
  const createButton = $<HTMLButtonElement>(root, '[data-create]');
  const deleteButton = $<HTMLButtonElement>(root, '[data-delete]');
  const dialog = $<HTMLDialogElement>(root, '[data-delete-dialog]');
  const discardDialog = $<HTMLDialogElement>(root, '[data-discard-dialog]');
  const toast = $<HTMLElement>(root, '[data-toast]');
  const leadStatus = $<HTMLElement>(root, '[data-lead-status]');
  const leadKanban = $<HTMLElement>(root, '[data-lead-kanban]');
  const leadSearch = $<HTMLInputElement>(root, '[data-lead-search]');
  const leadForm = $<HTMLFormElement>(root, '[data-lead-form]');
  const leadEditorTitle = $<HTMLElement>(root, '[data-lead-editor-title]');
  const leadEditorCopy = $<HTMLElement>(root, '[data-lead-editor-copy]');
  const leadFormState = $<HTMLElement>(root, '[data-lead-form-state]');
  const leadSaveStatus = $<HTMLElement>(root, '[data-lead-save-status]');
  const leadDeleteButton = $<HTMLButtonElement>(root, '[data-lead-delete]');
  const leadResetButton = $<HTMLButtonElement>(root, '[data-lead-reset]');

  const cache = new Map<Resource, PortalRecord[]>();
  let leads: PortalLead[] = [];
  let activeResource: Resource = 'projects';
  let activeView: View = 'leads';
  let activeRecord: PortalRecord | null = null;
  let activeLead: PortalLead | null = null;
  let deleteMode: 'cms' | 'lead' | null = null;
  let isDirty = false;
  let toastTimer = 0;

  const setDirty = (dirty: boolean) => {
    isDirty = dirty;
    const target = activeView === 'leads' ? leadSaveStatus : saveStatus;
    if (dirty) target.textContent = 'Nesaglabātas izmaiņas';
    else if (target.textContent === 'Nesaglabātas izmaiņas') target.textContent = '';
  };

  const confirmDiscard = (): Promise<boolean> => {
    if (!isDirty) return Promise.resolve(true);

    discardDialog.returnValue = 'cancel';
    discardDialog.showModal();
    return new Promise((resolve) => {
      discardDialog.addEventListener(
        'close',
        () => {
          const confirmed = discardDialog.returnValue === 'confirm';
          if (confirmed) setDirty(false);
          resolve(confirmed);
        },
        { once: true },
      );
    });
  };

  const afterDiscard = async (action: () => void | Promise<void>) => {
    if (await confirmDiscard()) await action();
  };

  const notify = (message: string, kind: 'success' | 'error' = 'success') => {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.dataset.kind = kind;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
      window.setTimeout(() => (toast.hidden = true), 250);
    }, 3_200);
  };

  const request = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(url, {
      ...options,
      credentials: 'same-origin',
      headers: {
        ...(options.body ? { 'content-type': 'application/json' } : {}),
        ...(options.method && options.method !== 'GET' ? { 'x-csrf-token': csrf } : {}),
        ...options.headers,
      },
    });

    if (response.status === 401) {
      window.location.assign('/portal/login?reason=session');
      throw new Error('Session expired');
    }

    const payload = (await response.json().catch(() => ({}))) as { error?: string } & T;
    if (!response.ok) throw new Error(payload.error ?? 'Pieprasījums neizdevās.');
    return payload;
  };

  const updateCount = (view: Resource | 'leads', count: number) => {
    const counter = root.querySelector<HTMLElement>(`[data-count="${view}"]`);
    if (counter) counter.textContent = String(count);
  };

  const setNavState = (view: View) => {
    root.querySelectorAll<HTMLButtonElement>('[data-resource], [data-section]').forEach((button) => {
      const target = button.dataset.resource ?? button.dataset.section;
      const active = target === view;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
    });
  };

  const loadResource = async (resource: Resource, force = false): Promise<PortalRecord[]> => {
    if (!force && cache.has(resource)) return cache.get(resource) ?? [];
    const response = await request<{ data: PortalRecord[] }>(`/api/portal/content/${resource}`);
    cache.set(resource, response.data);
    updateCount(resource, response.data.length);
    return response.data;
  };

  const loadLeads = async (force = false): Promise<PortalLead[]> => {
    if (!force && leads.length > 0) return leads;
    const response = await request<{ data: PortalLead[] }>('/api/portal/leads');
    leads = response.data;
    updateCount('leads', leads.length);
    return leads;
  };

  const createField = (definition: FieldDefinition, record: Record<string, unknown>) => {
    const id = `portal-${activeResource}-${definition.key}`;

    if (definition.type === 'checkbox') {
      const label = document.createElement('label');
      label.className = `portal-checkbox-field${definition.wide ? ' is-wide' : ''}`;
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = definition.key;
      input.id = id;
      input.checked = Boolean(record[definition.key]);
      const control = document.createElement('span');
      control.className = 'portal-checkbox-control';
      label.append(input, control, text('span', definition.label));
      return label;
    }

    const wrapper = document.createElement('label');
    wrapper.className = `portal-field${definition.wide ? ' is-wide' : ''}`;
    wrapper.htmlFor = id;
    wrapper.append(text('span', definition.label));

    const value = record[definition.key];
    const displayValue = Array.isArray(value) ? value.join('\n') : value == null ? '' : String(value);
    const control =
      definition.type === 'textarea' || definition.type === 'list'
        ? document.createElement('textarea')
        : document.createElement('input');
    control.id = id;
    control.name = definition.key;
    control.required = Boolean(definition.required);
    control.value = displayValue;
    control.maxLength = definition.type === 'textarea' ? 4_000 : 500;

    if (control instanceof HTMLInputElement) {
      control.type = definition.type === 'url' ? 'url' : definition.type;
      if (definition.min !== undefined) control.min = String(definition.min);
      if (definition.max !== undefined) control.max = String(definition.max);
      if (definition.type === 'number') control.step = '1';
    }

    wrapper.append(control);
    if (definition.hint) wrapper.append(text('small', definition.hint));
    return wrapper;
  };

  const openEditor = (record: PortalRecord | null) => {
    setDirty(false);
    activeRecord = record;
    const definition = definitions[activeResource];
    const values = record ?? definition.defaults;
    formFields.replaceChildren(...definition.fields.map((field) => createField(field, values)));
    editorTitle.textContent = record
      ? String(record[definition.labelKey] ?? `#${record.id}`)
      : `Jauns ${definition.singular}`;
    recordState.textContent = record
      ? record.is_published
        ? 'Publicēts'
        : 'Melnraksts'
      : 'Jauns ieraksts';
    recordState.dataset.state = record?.is_published ? 'published' : 'draft';
    deleteButton.hidden = !record || !canDelete;
    editorEmpty.hidden = true;
    editorForm.hidden = false;
    saveStatus.textContent = '';
    editorPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => formFields.querySelector<HTMLElement>('input, textarea')?.focus(), 200);
  };

  const renderList = (items: PortalRecord[]) => {
    const definition = definitions[activeResource];
    listStatus.textContent = `${items.length} ieraksti`;
    if (items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'portal-list-empty';
      empty.append(text('strong', 'Šeit vēl nav satura.'), text('p', 'Izveido pirmo ierakstu.'));
      contentList.replaceChildren(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    for (const item of items) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'portal-list-item';
      button.classList.toggle('is-selected', activeRecord?.id === item.id);
      const copy = document.createElement('span');
      copy.append(
        text('strong', String(item[definition.labelKey] ?? `#${item.id}`)),
        text('small', String(item[definition.secondaryKey] ?? 'Bez papildu informācijas')),
      );
      const state = text('b', item.is_published ? 'Publisks' : 'Melnraksts');
      state.dataset.state = item.is_published ? 'published' : 'draft';
      button.append(copy, state);
      button.addEventListener('click', () => {
        void afterDiscard(() => {
          openEditor(item);
          renderList(items);
        });
      });
      fragment.append(button);
    }
    contentList.replaceChildren(fragment);
  };

  const showResource = async (resource: Resource) => {
    setDirty(false);
    activeView = resource;
    activeResource = resource;
    activeRecord = null;
    const definition = definitions[resource];
    setNavState(resource);
    leadGrid.hidden = true;
    workGrid.hidden = false;
    sectionTitle.textContent = definition.title;
    sectionDescription.textContent = definition.description;
    createButton.hidden = false;
    createButton.querySelector('span')?.replaceChildren(document.createTextNode('Jauns ieraksts'));
    workGrid.classList.remove('is-audit');
    editorPanel.hidden = false;
    editorForm.hidden = true;
    editorEmpty.hidden = false;
    editorTitle.textContent = 'Izvēlies ierakstu';
    recordState.textContent = 'Nav izvēlēts';
    listStatus.textContent = 'Ielādē…';
    contentList.replaceChildren();

    try {
      renderList(await loadResource(resource));
    } catch (error) {
      listStatus.textContent = 'Savienojuma kļūda';
      const failure = document.createElement('div');
      failure.className = 'portal-list-empty is-error';
      failure.append(
        text('strong', 'Saturu nevar ielādēt.'),
        text('p', error instanceof Error ? error.message : 'Mēģini vēlreiz.'),
      );
      const retry = text('button', 'Mēģināt vēlreiz') as HTMLButtonElement;
      retry.type = 'button';
      retry.addEventListener('click', () => void showResource(resource));
      failure.append(retry);
      contentList.replaceChildren(failure);
    }
  };

  const showAudit = async () => {
    setDirty(false);
    activeView = 'audit';
    setNavState('audit');
    leadGrid.hidden = true;
    workGrid.hidden = false;
    sectionTitle.textContent = 'Izmaiņu žurnāls';
    sectionDescription.textContent = 'Pēdējās satura izmaiņas ar autoru, laiku un darbības veidu.';
    createButton.hidden = true;
    editorPanel.hidden = true;
    workGrid.classList.add('is-audit');
    listStatus.textContent = 'Ielādē…';
    contentList.replaceChildren();

    try {
      const response = await request<{ data: PortalRecord[] }>('/api/portal/audit');
      listStatus.textContent = `${response.data.length} notikumi`;
      const fragment = document.createDocumentFragment();
      for (const entry of response.data) {
        const row = document.createElement('article');
        row.className = 'portal-audit-item';
        const operationLabels: Record<string, string> = {
          DELETE: 'Dzēsts',
          INSERT: 'Izveidots',
          UPDATE: 'Atjaunināts',
        };
        const operation = String(entry.operation ?? 'UPDATE');
        const heading = document.createElement('div');
        heading.append(
          text('strong', `${operationLabels[operation] ?? operation}: ${String(entry.table_name)}`),
          text('time', new Intl.DateTimeFormat('lv-LV', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(String(entry.changed_at)))),
        );
        row.append(
          heading,
          text(
            'p',
            `Ieraksts #${String(entry.record_id ?? '—')} · ${String(entry.actor_role ?? 'sistēma')} · ${String(entry.actor_id ?? 'servera process')}`,
          ),
        );
        fragment.append(row);
      }
      if (response.data.length === 0) {
        fragment.append(text('p', 'Izmaiņu žurnāls vēl ir tukšs.', 'portal-list-empty'));
      }
      contentList.replaceChildren(fragment);
    } catch (error) {
      listStatus.textContent = 'Kļūda';
      contentList.replaceChildren(
        text('p', error instanceof Error ? error.message : 'Žurnālu nevar ielādēt.', 'portal-list-empty is-error'),
      );
    }
  };

  const serializeForm = (): Record<string, unknown> => {
    const definition = definitions[activeResource];
    const result: Record<string, unknown> = {};
    for (const field of definition.fields) {
      const input = editorForm.elements.namedItem(field.key);
      if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) continue;
      if (field.type === 'checkbox' && input instanceof HTMLInputElement) {
        result[field.key] = input.checked;
      } else if (field.type === 'number') result[field.key] = input.value ? Number(input.value) : null;
      else if (field.type === 'list') {
        result[field.key] = input.value
          .split('\n')
          .map((value) => value.trim())
          .filter(Boolean);
      } else result[field.key] = input.value.trim() || null;
    }

    for (const field of definition.fields.filter((field) => field.required)) {
      if (result[field.key] === null) result[field.key] = '';
    }
    return result;
  };

  const leadControl = <T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    name: string,
  ): T => {
    const control = leadForm.elements.namedItem(name);
    if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement || control instanceof HTMLSelectElement)) {
      throw new Error(`Missing lead field: ${name}`);
    }
    return control as T;
  };

  const resetLeadForm = () => {
    setDirty(false);
    activeLead = null;
    leadForm.reset();
    leadControl<HTMLInputElement>('follow_up_enabled').checked = true;
    leadControl<HTMLSelectElement>('status').value = 'not_contacted';
    leadEditorTitle.textContent = 'Jauns lead';
    leadEditorCopy.textContent = 'Izveido kontaktu un ieliec to pareizajā statusā.';
    leadFormState.textContent = 'Nav saglabāts';
    leadFormState.dataset.state = 'draft';
    leadDeleteButton.hidden = true;
    leadSaveStatus.textContent = '';
  };

  const openLeadEditor = (lead: PortalLead | null) => {
    resetLeadForm();
    activeLead = lead;
    if (!lead) {
      window.setTimeout(() => leadControl<HTMLInputElement>('company_name').focus(), 120);
      return;
    }

    leadControl<HTMLInputElement>('company_name').value = lead.company_name;
    leadControl<HTMLInputElement>('found_on').value = lead.found_on;
    leadControl<HTMLInputElement>('industry').value = lead.industry ?? '';
    leadControl<HTMLInputElement>('contacted_at').value = lead.contacted_at ?? '';
    leadControl<HTMLInputElement>('outreach_owner').value = lead.outreach_owner;
    leadControl<HTMLSelectElement>('contact_channel').value = lead.contact_channel;
    leadControl<HTMLSelectElement>('status').value = lead.status;
    leadControl<HTMLInputElement>('has_website').checked = lead.has_website;
    leadControl<HTMLInputElement>('follow_up_enabled').checked = lead.follow_up_enabled;
    leadControl<HTMLTextAreaElement>('notes').value = lead.notes ?? '';
    leadEditorTitle.textContent = lead.company_name;
    leadEditorCopy.textContent = `${channelLabels[lead.contact_channel]} · ${lead.found_on}`;
    leadFormState.textContent = lead.follow_up_due_at ? `Follow-up: ${formatDate(lead.follow_up_due_at)}` : 'Nav follow-up';
    leadFormState.dataset.state = isFollowUpDue(lead) ? 'published' : 'draft';
    leadDeleteButton.hidden = !canDelete;
  };

  const serializeLeadForm = () => ({
    company_name: leadControl<HTMLInputElement>('company_name').value.trim(),
    contact_channel: leadControl<HTMLSelectElement>('contact_channel').value,
    contacted_at: leadControl<HTMLInputElement>('contacted_at').value || null,
    follow_up_enabled: leadControl<HTMLInputElement>('follow_up_enabled').checked,
    found_on: leadControl<HTMLInputElement>('found_on').value.trim(),
    has_website: leadControl<HTMLInputElement>('has_website').checked,
    industry: leadControl<HTMLInputElement>('industry').value.trim() || null,
    notes: leadControl<HTMLTextAreaElement>('notes').value.trim() || null,
    outreach_owner: leadControl<HTMLInputElement>('outreach_owner').value.trim(),
    status: leadControl<HTMLSelectElement>('status').value,
  });

  const renderLeadBoard = () => {
    const query = leadSearch.value.trim().toLowerCase();
    const filtered = query
      ? leads.filter((lead) =>
          [lead.company_name, lead.found_on, lead.industry, lead.outreach_owner, lead.notes]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(query)),
        )
      : leads;

    const openCount = leads.filter((lead) => !['client', 'rejected', 'no_response'].includes(lead.status)).length;
    const dueCount = leads.filter(isFollowUpDue).length;
    root.querySelector<HTMLElement>('[data-lead-metric="open"]')!.textContent = String(openCount);
    root.querySelector<HTMLElement>('[data-lead-metric="followups"]')!.textContent = String(dueCount);
    leadStatus.textContent = `${filtered.length} no ${leads.length} lead`;

    if (leads.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'portal-list-empty';
      empty.append(text('strong', 'Lead pipeline ir tukšs.'), text('p', 'Izveido pirmo lead un sāc plūsmu no “Nav uzrunāts”.'));
      leadKanban.replaceChildren(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    for (const column of leadColumns) {
      const columnLeads = filtered.filter((lead) => lead.status === column.status);
      const section = document.createElement('section');
      section.className = `portal-kanban-column${column.group === 'parked' ? ' is-parked' : ''}`;
      section.dataset.status = column.status;
      section.addEventListener('dragover', (event) => event.preventDefault());
      section.addEventListener('drop', (event) => {
        event.preventDefault();
        const id = Number(event.dataTransfer?.getData('text/plain'));
        if (Number.isSafeInteger(id)) void updateLeadStatus(id, column.status);
      });

      const header = document.createElement('header');
      header.append(text('h3', column.label), text('span', String(columnLeads.length)));
      section.append(header);

      const cards = document.createElement('div');
      cards.className = 'portal-kanban-cards';
      if (columnLeads.length === 0) {
        cards.append(text('p', 'Tukšs', 'portal-kanban-empty'));
      }

      for (const lead of columnLeads) {
        const card = document.createElement('button');
        card.type = 'button';
        card.draggable = true;
        card.className = 'portal-lead-card';
        card.classList.toggle('is-due', isFollowUpDue(lead));
        card.addEventListener('dragstart', (event) => {
          event.dataTransfer?.setData('text/plain', String(lead.id));
          event.dataTransfer?.setData('application/x-lead-id', String(lead.id));
        });
        card.addEventListener('click', () => openLeadEditor(lead));

        const meta = document.createElement('span');
        meta.append(
          text('b', channelLabels[lead.contact_channel]),
          text('small', lead.has_website ? 'Ir mājaslapa' : 'Nav mājaslapas'),
        );
        card.append(
          text('strong', lead.company_name),
          text('small', `${lead.found_on}${lead.industry ? ` · ${lead.industry}` : ''}`),
          meta,
          text('em', lead.follow_up_due_at ? `Follow-up ${formatDate(lead.follow_up_due_at)}` : `Uzrunāts ${formatDate(lead.contacted_at)}`),
        );
        cards.append(card);
      }

      section.append(cards);
      fragment.append(section);
    }
    leadKanban.replaceChildren(fragment);
  };

  const showLeads = async () => {
    setDirty(false);
    activeView = 'leads';
    setNavState('leads');
    workGrid.hidden = true;
    leadGrid.hidden = false;
    sectionTitle.textContent = 'Leads';
    sectionDescription.textContent = 'Vadi jaunos kontaktus no atrašanas brīža līdz klienta statusam.';
    createButton.hidden = false;
    createButton.querySelector('span')?.replaceChildren(document.createTextNode('Jauns lead'));
    leadStatus.textContent = 'Ielādē…';

    try {
      await loadLeads();
      renderLeadBoard();
      if (!activeLead) resetLeadForm();
    } catch (error) {
      leadStatus.textContent = 'Savienojuma kļūda';
      const failure = document.createElement('div');
      failure.className = 'portal-list-empty is-error';
      failure.append(
        text('strong', 'Lead nevar ielādēt.'),
        text('p', error instanceof Error ? error.message : 'Pārbaudi datubāzes migrāciju un mēģini vēlreiz.'),
      );
      const retry = text('button', 'Mēģināt vēlreiz') as HTMLButtonElement;
      retry.type = 'button';
      retry.addEventListener('click', () => void showLeads());
      failure.append(retry);
      leadKanban.replaceChildren(failure);
    }
  };

  const updateLeadStatus = async (id: number, status: LeadStatus) => {
    const lead = leads.find((item) => item.id === id);
    if (!lead || lead.status === status) return;
    try {
      const response = await request<{ data: PortalLead }>('/api/portal/leads', {
        method: 'PATCH',
        body: JSON.stringify({ id, data: { status } }),
      });
      leads = leads.map((item) => (item.id === id ? response.data : item));
      if (activeLead?.id === id) openLeadEditor(response.data);
      renderLeadBoard();
      notify('Lead statuss atjaunināts.');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Statusu neizdevās mainīt.', 'error');
    }
  };

  editorForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = editorForm.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!submit) return;
    submit.disabled = true;
    submit.textContent = 'Saglabā…';
    saveStatus.textContent = 'Pārbauda saturu';

    try {
      const data = serializeForm();
      const payload = activeRecord ? { id: activeRecord.id, data } : data;
      await request(`/api/portal/content/${activeResource}`, {
        method: activeRecord ? 'PATCH' : 'POST',
        body: JSON.stringify(payload),
      });
      setDirty(false);
      cache.delete(activeResource);
      activeRecord = null;
      notify('Izmaiņas ir saglabātas.');
      await showResource(activeResource);
    } catch (error) {
      saveStatus.textContent = error instanceof Error ? error.message : 'Saglabāšana neizdevās.';
      notify(saveStatus.textContent, 'error');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Saglabāt izmaiņas';
    }
  });

  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = leadForm.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!submit) return;
    submit.disabled = true;
    submit.textContent = 'Saglabā…';
    leadSaveStatus.textContent = 'Pārbauda lead';

    try {
      const data = serializeLeadForm();
      const response = await request<{ data: PortalLead }>('/api/portal/leads', {
        method: activeLead ? 'PATCH' : 'POST',
        body: JSON.stringify(activeLead ? { id: activeLead.id, data } : data),
      });
      setDirty(false);
      if (activeLead) leads = leads.map((lead) => (lead.id === activeLead?.id ? response.data : lead));
      else leads = [response.data, ...leads];
      updateCount('leads', leads.length);
      activeLead = response.data;
      openLeadEditor(response.data);
      renderLeadBoard();
      notify('Lead ir saglabāts.');
      leadSaveStatus.textContent = '';
    } catch (error) {
      leadSaveStatus.textContent = error instanceof Error ? error.message : 'Lead saglabāšana neizdevās.';
      notify(leadSaveStatus.textContent, 'error');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Saglabāt lead';
    }
  });

  editorForm.addEventListener('input', () => setDirty(true));
  leadForm.addEventListener('input', () => setDirty(true));
  leadSearch.addEventListener('input', renderLeadBoard);

  createButton.addEventListener('click', () => {
    void afterDiscard(() => {
      if (activeView === 'leads') openLeadEditor(null);
      else if (activeView !== 'audit') openEditor(null);
    });
  });

  leadResetButton.addEventListener('click', () => void afterDiscard(() => openLeadEditor(null)));

  deleteButton.addEventListener('click', () => {
    if (activeRecord && canDelete) {
      deleteMode = 'cms';
      dialog.showModal();
    }
  });

  leadDeleteButton.addEventListener('click', () => {
    if (activeLead && canDelete) {
      deleteMode = 'lead';
      dialog.showModal();
    }
  });

  dialog.addEventListener('close', async () => {
    if (dialog.returnValue !== 'confirm') {
      deleteMode = null;
      return;
    }

    try {
      if (deleteMode === 'lead' && activeLead) {
        await request('/api/portal/leads', {
          method: 'DELETE',
          body: JSON.stringify({ id: activeLead.id }),
        });
        leads = leads.filter((lead) => lead.id !== activeLead?.id);
        updateCount('leads', leads.length);
        activeLead = null;
        setDirty(false);
        resetLeadForm();
        renderLeadBoard();
        notify('Lead ir dzēsts.');
      } else if (deleteMode === 'cms' && activeRecord) {
        await request(`/api/portal/content/${activeResource}`, {
          method: 'DELETE',
          body: JSON.stringify({ id: activeRecord.id }),
        });
        setDirty(false);
        cache.delete(activeResource);
        activeRecord = null;
        notify('Ieraksts ir dzēsts.');
        await showResource(activeResource);
      }
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Dzēšana neizdevās.', 'error');
    } finally {
      deleteMode = null;
    }
  });

  root.querySelectorAll<HTMLButtonElement>('[data-resource]').forEach((button) => {
    button.addEventListener('click', () => {
      const resource = button.dataset.resource;
      if (resource === 'audit') void afterDiscard(showAudit);
      else if (resource && resource in definitions) {
        void afterDiscard(() => showResource(resource as Resource));
      }
    });
  });

  root.querySelector<HTMLButtonElement>('[data-section="leads"]')?.addEventListener('click', () => {
    void afterDiscard(showLeads);
  });

  $<HTMLButtonElement>(root, '[data-logout]').addEventListener('click', async () => {
    if (!(await confirmDiscard())) return;
    try {
      const response = await request<{ redirect: string }>('/api/portal/logout', {
        method: 'POST',
        body: '{}',
      });
      window.location.assign(response.redirect);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Neizdevās izrakstīties.', 'error');
    }
  });

  window.addEventListener('beforeunload', (event) => {
    if (!isDirty) return;
    event.preventDefault();
  });

  void Promise.allSettled([
    loadLeads(),
    ...(Object.keys(definitions) as Resource[]).map((resource) => loadResource(resource)),
  ]).then(() => void showLeads());
}
