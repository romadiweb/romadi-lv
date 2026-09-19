type Resource = 'projects' | 'reviews' | 'pricing_plans';
type PortalRecord = Record<string, unknown> & { id: number };
type FieldType = 'text' | 'textarea' | 'url' | 'number' | 'date' | 'list' | 'checkbox';

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
      {
        key: 'features',
        label: 'Iespējas',
        type: 'list',
        wide: true,
        hint: 'Viena vērtība katrā rindā',
      },
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
      {
        key: 'features',
        label: 'Iekļautais',
        type: 'list',
        wide: true,
        hint: 'Viena vērtība katrā rindā',
      },
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

  const cache = new Map<Resource, PortalRecord[]>();
  let activeResource: Resource = 'projects';
  let activeRecord: PortalRecord | null = null;
  let isDirty = false;
  let toastTimer = 0;

  const setDirty = (dirty: boolean) => {
    isDirty = dirty;
    if (dirty) saveStatus.textContent = 'Nesaglabātas izmaiņas';
    else if (saveStatus.textContent === 'Nesaglabātas izmaiņas') saveStatus.textContent = '';
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

  const updateCount = (resource: Resource, count: number) => {
    const counter = root.querySelector<HTMLElement>(`[data-count="${resource}"]`);
    if (counter) counter.textContent = String(count);
  };

  const loadResource = async (resource: Resource, force = false): Promise<PortalRecord[]> => {
    if (!force && cache.has(resource)) return cache.get(resource) ?? [];
    const response = await request<{ data: PortalRecord[] }>(`/api/portal/content/${resource}`);
    cache.set(resource, response.data);
    updateCount(resource, response.data.length);
    return response.data;
  };

  const setNavState = (resource: Resource | 'audit') => {
    root.querySelectorAll<HTMLButtonElement>('[data-resource]').forEach((button) => {
      const active = button.dataset.resource === resource;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
    });
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
    activeResource = resource;
    activeRecord = null;
    const definition = definitions[resource];
    setNavState(resource);
    sectionTitle.textContent = definition.title;
    sectionDescription.textContent = definition.description;
    createButton.hidden = false;
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
    setNavState('audit');
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
      }
      else if (field.type === 'number') result[field.key] = input.value ? Number(input.value) : null;
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

  editorForm.addEventListener('input', () => setDirty(true));

  createButton.addEventListener('click', () => {
    void afterDiscard(() => openEditor(null));
  });

  deleteButton.addEventListener('click', () => {
    if (activeRecord && canDelete) dialog.showModal();
  });

  dialog.addEventListener('close', async () => {
    if (dialog.returnValue !== 'confirm' || !activeRecord) return;
    try {
      await request(`/api/portal/content/${activeResource}`, {
        method: 'DELETE',
        body: JSON.stringify({ id: activeRecord.id }),
      });
      setDirty(false);
      cache.delete(activeResource);
      activeRecord = null;
      notify('Ieraksts ir dzēsts.');
      await showResource(activeResource);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Dzēšana neizdevās.', 'error');
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

  void Promise.allSettled(
    (Object.keys(definitions) as Resource[]).map((resource) => loadResource(resource)),
  ).then(() => void showResource('projects'));
}
