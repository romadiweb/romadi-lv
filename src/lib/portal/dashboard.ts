import type { PortalLead, PortalPricingItem, PortalTextTemplateRow } from '@/types/database';
import type { TextTemplateVariant } from '@/lib/portal/text-templates';

type Resource = 'projects' | 'reviews' | 'pricing_plans';
type View = Resource | 'audit' | 'calculator' | 'dashboard' | 'leads' | 'templates';
type PortalRecord = Record<string, unknown> & { id: number };
type PortalTextTemplate = Omit<PortalTextTemplateRow, 'variants'> & {
  variants: TextTemplateVariant[];
};
type FieldType = 'text' | 'textarea' | 'url' | 'number' | 'date' | 'list' | 'checkbox';
type LeadStatus = PortalLead['status'];
type PricingCategory = PortalPricingItem['category'];

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

const getContactChannelFromPlatform = (platform: string): PortalLead['contact_channel'] | null => {
  const value = platform.trim().toLocaleLowerCase('lv-LV');
  if (value.includes('instagram')) return 'instagram';
  if (value.includes('facebook')) return 'facebook';
  if (value.includes('linkedin')) return 'linkedin';
  if (value.includes('tiktok') || value.includes('tik tok')) return 'tiktok';
  if (value.includes('email') || value.includes('e-past')) return 'email';
  if (value.includes('telefon') || value.includes('phone')) return 'phone';
  return null;
};

const pricingCategoryLabels: Record<PricingCategory, string> = {
  addon: 'Papildinājumi',
  adjustment: 'Korekcijas',
  base: 'Pamata komplekti',
  hourly: 'Stundu darbs',
  integration: 'Integrācijas',
  page: 'Lapas',
};

const pricingUnitLabels: Record<PortalPricingItem['unit'], string> = {
  hour: 'st.',
  item: 'gab.',
  page: 'lapa',
  project: 'projekts',
};

const pricingCategoryOrder: PricingCategory[] = [
  'base',
  'page',
  'integration',
  'addon',
  'hourly',
  'adjustment',
];

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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('lv-LV', {
    currency: 'EUR',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    style: 'currency',
  }).format(value);

const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat('lv-LV', { day: '2-digit', month: 'short' }).format(
        new Date(`${value}T12:00:00`),
      )
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
  const homeView = $<HTMLElement>(root, '[data-dashboard-home-view]');
  const homeTaskList = $<HTMLElement>(root, '[data-home-task-list]');
  const templateGrid = $<HTMLElement>(root, '[data-template-grid]');
  const templateStatus = $<HTMLElement>(root, '[data-template-status]');
  const templateSearch = $<HTMLInputElement>(root, '[data-template-search]');
  const templateCategoryFilter = $<HTMLSelectElement>(root, '[data-template-category-filter]');
  const templateCategoryOptions = $<HTMLDataListElement>(root, '[data-template-category-options]');
  const templateList = $<HTMLElement>(root, '[data-template-list]');
  const templateForm = $<HTMLFormElement>(root, '[data-template-form]');
  const templateEmpty = $<HTMLElement>(root, '[data-template-empty]');
  const templateEditorTitle = $<HTMLElement>(root, '[data-template-editor-title]');
  const templateFormState = $<HTMLElement>(root, '[data-template-form-state]');
  const templateSaveStatus = $<HTMLElement>(root, '[data-template-save-status]');
  const templateDeleteButton = $<HTMLButtonElement>(root, '[data-template-delete]');
  const templateResetButton = $<HTMLButtonElement>(root, '[data-template-reset]');
  const addVariantButton = $<HTMLButtonElement>(root, '[data-add-variant]');
  const variantList = $<HTMLElement>(root, '[data-variant-list]');
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
  const leadOutreachFields = $<HTMLElement>(leadForm, '[data-lead-outreach-fields]');
  const leadEditorTitle = $<HTMLElement>(root, '[data-lead-editor-title]');
  const leadEditorCopy = $<HTMLElement>(root, '[data-lead-editor-copy]');
  const leadFormState = $<HTMLElement>(root, '[data-lead-form-state]');
  const leadSaveStatus = $<HTMLElement>(root, '[data-lead-save-status]');
  const leadDeleteButton = $<HTMLButtonElement>(root, '[data-lead-delete]');
  const leadResetButton = $<HTMLButtonElement>(root, '[data-lead-reset]');
  const calculatorGrid = $<HTMLElement>(root, '[data-calculator-grid]');
  const priceStatus = $<HTMLElement>(root, '[data-price-status]');
  const priceSearch = $<HTMLInputElement>(root, '[data-price-search]');
  const priceList = $<HTMLElement>(root, '[data-price-list]');
  const calculatorBuilder = $<HTMLElement>(root, '[data-calculator-builder]');
  const calculatorLines = $<HTMLElement>(root, '[data-calculator-lines]');
  const calculatorSubtotal = $<HTMLElement>(root, '[data-calculator-subtotal]');
  const calculatorDiscount = $<HTMLElement>(root, '[data-calculator-discount]');
  const calculatorVat = $<HTMLElement>(root, '[data-calculator-vat]');
  const calculatorTotal = $<HTMLElement>(root, '[data-calculator-total]');
  const discountPercent = $<HTMLInputElement>(root, '[data-discount-percent]');
  const vatToggle = $<HTMLInputElement>(root, '[data-vat-toggle]');
  const copyEstimateButton = $<HTMLButtonElement>(root, '[data-copy-estimate]');
  const priceForm = $<HTMLFormElement>(root, '[data-price-form]');
  const priceEditorTitle = $<HTMLElement>(root, '[data-price-editor-title]');
  const priceFormState = $<HTMLElement>(root, '[data-price-form-state]');
  const priceSaveStatus = $<HTMLElement>(root, '[data-price-save-status]');
  const priceDeleteButton = $<HTMLButtonElement>(root, '[data-price-delete]');
  const priceResetButton = $<HTMLButtonElement>(root, '[data-price-reset]');

  const cache = new Map<Resource, PortalRecord[]>();
  let leads: PortalLead[] = [];
  let pricingItems: PortalPricingItem[] = [];
  let selectedPricingItemIds = new Set<number>();
  let activePricingItem: PortalPricingItem | null = null;
  let templates: PortalTextTemplate[] = [];
  let templatesLoaded = false;
  let activeResource: Resource = 'projects';
  let activeView: View = 'dashboard';
  let activeRecord: PortalRecord | null = null;
  let activeLead: PortalLead | null = null;
  let activeTemplate: PortalTextTemplate | null = null;
  let deleteMode: 'cms' | 'lead' | 'pricing' | 'template' | null = null;
  let isDirty = false;
  let toastTimer = 0;

  const setDirty = (dirty: boolean) => {
    isDirty = dirty;
    const target =
      activeView === 'leads'
        ? leadSaveStatus
        : activeView === 'templates'
          ? templateSaveStatus
          : activeView === 'calculator'
            ? priceSaveStatus
            : saveStatus;
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

  const updateCount = (
    view: Resource | 'leads' | 'portal_pricing_items' | 'text_templates',
    count: number,
  ) => {
    const counter = root.querySelector<HTMLElement>(`[data-count="${view}"]`);
    if (counter) counter.textContent = String(count);
  };

  const setNavState = (view: View) => {
    root
      .querySelectorAll<HTMLButtonElement>('[data-resource], [data-section]')
      .forEach((button) => {
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

  const loadTemplates = async (force = false): Promise<PortalTextTemplate[]> => {
    if (!force && templatesLoaded) return templates;
    const response = await request<{ data: PortalTextTemplate[] }>('/api/portal/text-templates');
    templates = response.data;
    templatesLoaded = true;
    updateCount('text_templates', templates.length);
    return templates;
  };

  const loadPricingItems = async (force = false): Promise<PortalPricingItem[]> => {
    if (!force && pricingItems.length > 0) return pricingItems;
    const response = await request<{ data: PortalPricingItem[] }>('/api/portal/pricing-items');
    pricingItems = response.data;
    updateCount('portal_pricing_items', pricingItems.length);
    return pricingItems;
  };

  const hideWorkspaceViews = () => {
    calculatorGrid.hidden = true;
    homeView.hidden = true;
    leadGrid.hidden = true;
    templateGrid.hidden = true;
    workGrid.hidden = true;
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
    const displayValue = Array.isArray(value)
      ? value.join('\n')
      : value == null
        ? ''
        : String(value);
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
    hideWorkspaceViews();
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
    hideWorkspaceViews();
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
          text(
            'time',
            new Intl.DateTimeFormat('lv-LV', { dateStyle: 'medium', timeStyle: 'short' }).format(
              new Date(String(entry.changed_at)),
            ),
          ),
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
        text(
          'p',
          error instanceof Error ? error.message : 'Žurnālu nevar ielādēt.',
          'portal-list-empty is-error',
        ),
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
      } else if (field.type === 'number')
        result[field.key] = input.value ? Number(input.value) : null;
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
    if (!(
      control instanceof HTMLInputElement ||
      control instanceof HTMLTextAreaElement ||
      control instanceof HTMLSelectElement
    )) {
      throw new Error(`Missing lead field: ${name}`);
    }
    return control as T;
  };

  const setLeadOutreachState = (isContacted: boolean, clearDetails = false) => {
    const toggle = leadControl<HTMLInputElement>('is_contacted');
    const status = leadControl<HTMLSelectElement>('status');
    const owner = leadControl<HTMLInputElement>('outreach_owner');
    const contactedAt = leadControl<HTMLInputElement>('contacted_at');
    const contactChannel = leadControl<HTMLSelectElement>('contact_channel');
    const followUp = leadControl<HTMLInputElement>('follow_up_enabled');

    toggle.checked = isContacted;
    toggle.setAttribute('aria-expanded', String(isContacted));
    leadOutreachFields.hidden = !isContacted;
    owner.required = isContacted;

    if (isContacted) {
      if (!status.value || status.value === 'not_contacted') status.value = 'contacted';
      const platformChannel = getContactChannelFromPlatform(
        leadControl<HTMLInputElement>('found_on').value,
      );
      if (platformChannel && (!activeLead || activeLead.status === 'not_contacted')) {
        contactChannel.value = platformChannel;
      }
      return;
    }

    status.value = 'not_contacted';
    followUp.checked = false;
    if (clearDetails) {
      owner.value = '';
      contactedAt.value = '';
    }
  };

  const resetLeadForm = () => {
    setDirty(false);
    activeLead = null;
    leadForm.reset();
    setLeadOutreachState(false, true);
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
    const isContacted = lead.status !== 'not_contacted';
    setLeadOutreachState(isContacted);
    leadControl<HTMLInputElement>('contacted_at').value = lead.contacted_at ?? '';
    leadControl<HTMLInputElement>('outreach_owner').value = lead.outreach_owner ?? '';
    leadControl<HTMLSelectElement>('contact_channel').value = lead.contact_channel;
    leadControl<HTMLSelectElement>('status').value = lead.status;
    leadControl<HTMLInputElement>('has_website').checked = lead.has_website;
    leadControl<HTMLInputElement>('follow_up_enabled').checked = lead.follow_up_enabled;
    leadControl<HTMLTextAreaElement>('notes').value = lead.notes ?? '';
    leadEditorTitle.textContent = lead.company_name;
    leadEditorCopy.textContent =
      lead.status === 'not_contacted'
        ? `${lead.found_on}${lead.industry ? ` · ${lead.industry}` : ''}`
        : `${channelLabels[lead.contact_channel]} · ${lead.found_on}`;
    leadFormState.textContent = lead.follow_up_due_at
      ? `Follow-up: ${formatDate(lead.follow_up_due_at)}`
      : 'Nav follow-up';
    leadFormState.dataset.state = isFollowUpDue(lead) ? 'published' : 'draft';
    leadDeleteButton.hidden = !canDelete;
  };

  const serializeLeadForm = () => {
    const isContacted = leadControl<HTMLInputElement>('is_contacted').checked;

    return {
      company_name: leadControl<HTMLInputElement>('company_name').value.trim(),
      contact_channel: leadControl<HTMLSelectElement>('contact_channel').value,
      contacted_at: isContacted
        ? leadControl<HTMLInputElement>('contacted_at').value || null
        : null,
      follow_up_enabled: isContacted && leadControl<HTMLInputElement>('follow_up_enabled').checked,
      found_on: leadControl<HTMLInputElement>('found_on').value.trim(),
      has_website: leadControl<HTMLInputElement>('has_website').checked,
      industry: leadControl<HTMLInputElement>('industry').value.trim() || null,
      notes: leadControl<HTMLTextAreaElement>('notes').value.trim() || null,
      outreach_owner: isContacted
        ? leadControl<HTMLInputElement>('outreach_owner').value.trim() || null
        : null,
      status: isContacted ? leadControl<HTMLSelectElement>('status').value : 'not_contacted',
    };
  };

  const renderLeadBoard = () => {
    const query = leadSearch.value.trim().toLowerCase();
    const filtered = query
      ? leads.filter((lead) =>
          [lead.company_name, lead.found_on, lead.industry, lead.outreach_owner, lead.notes]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(query)),
        )
      : leads;

    const openCount = leads.filter(
      (lead) => !['client', 'rejected', 'no_response'].includes(lead.status),
    ).length;
    const dueCount = leads.filter(isFollowUpDue).length;
    root.querySelector<HTMLElement>('[data-lead-metric="open"]')!.textContent = String(openCount);
    root.querySelector<HTMLElement>('[data-lead-metric="followups"]')!.textContent =
      String(dueCount);
    leadStatus.textContent = `${filtered.length} no ${leads.length} lead`;

    if (leads.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'portal-list-empty';
      empty.append(
        text('strong', 'Lead pipeline ir tukšs.'),
        text('p', 'Izveido pirmo lead un sāc plūsmu no “Nav uzrunāts”.'),
      );
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
          text(
            'b',
            lead.status === 'not_contacted' ? lead.found_on : channelLabels[lead.contact_channel],
          ),
          text('small', lead.has_website ? 'Ir mājaslapa' : 'Nav mājaslapas'),
        );
        card.append(
          text('strong', lead.company_name),
          text(
            'small',
            lead.status === 'not_contacted'
              ? (lead.industry ?? 'Nav nozares')
              : `${lead.found_on}${lead.industry ? ` · ${lead.industry}` : ''}`,
          ),
          meta,
          text(
            'em',
            lead.status === 'not_contacted'
              ? 'Nav uzrunāts'
              : lead.follow_up_due_at
                ? `Follow-up ${formatDate(lead.follow_up_due_at)}`
                : `Uzrunāts ${formatDate(lead.contacted_at)}`,
          ),
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
    hideWorkspaceViews();
    leadGrid.hidden = false;
    sectionTitle.textContent = 'Leads';
    sectionDescription.textContent =
      'Vadi jaunos kontaktus no atrašanas brīža līdz klienta statusam.';
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
        text(
          'p',
          error instanceof Error
            ? error.message
            : 'Pārbaudi datubāzes migrāciju un mēģini vēlreiz.',
        ),
      );
      const retry = text('button', 'Mēģināt vēlreiz') as HTMLButtonElement;
      retry.type = 'button';
      retry.addEventListener('click', () => void showLeads());
      failure.append(retry);
      leadKanban.replaceChildren(failure);
    }
  };

  const copyToClipboard = async (value: string) => {
    if (!value.trim()) {
      notify('Šis teksta variants vēl ir tukšs.', 'error');
      return;
    }

    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(value);
      notify('Teksts nokopēts starpliktuvē.');
    } catch {
      notify('Tekstu neizdevās nokopēt. Iezīmē to un kopē manuāli.', 'error');
    }
  };

  const templateControl = <T extends HTMLInputElement | HTMLTextAreaElement>(name: string): T => {
    const control = templateForm.elements.namedItem(name);
    if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement)) {
      throw new Error(`Missing template field: ${name}`);
    }
    return control as T;
  };

  const readVariantDrafts = (): TextTemplateVariant[] =>
    Array.from(variantList.querySelectorAll<HTMLElement>('[data-variant]')).map((card) => ({
      id: card.dataset.variantId ?? crypto.randomUUID(),
      label: card.querySelector<HTMLInputElement>('[data-variant-label]')?.value.trim() ?? '',
      content:
        card.querySelector<HTMLTextAreaElement>('[data-variant-content]')?.value.trim() ?? '',
    }));

  const renderVariantFields = (variants: TextTemplateVariant[]) => {
    const fragment = document.createDocumentFragment();
    variants.forEach((variant, index) => {
      const card = document.createElement('article');
      card.className = 'portal-variant-card';
      card.dataset.variant = '';
      card.dataset.variantId = variant.id;

      const header = document.createElement('header');
      const label = document.createElement('label');
      label.append(text('span', `Tona nosaukums ${index + 1}`));
      const labelInput = document.createElement('input');
      labelInput.required = true;
      labelInput.maxLength = 80;
      labelInput.value = variant.label;
      labelInput.placeholder = 'Formāls, draudzīgs…';
      labelInput.dataset.variantLabel = '';
      label.append(labelInput);

      const actions = document.createElement('div');
      const copyButton = text('button', 'Kopēt') as HTMLButtonElement;
      copyButton.type = 'button';
      copyButton.className = 'portal-variant-copy';
      copyButton.addEventListener('click', () => {
        const content = card.querySelector<HTMLTextAreaElement>('[data-variant-content]');
        if (content) void copyToClipboard(content.value);
      });
      const removeButton = text('button', 'Noņemt') as HTMLButtonElement;
      removeButton.type = 'button';
      removeButton.className = 'portal-variant-remove';
      removeButton.disabled = variants.length === 1;
      removeButton.addEventListener('click', () => {
        const current = readVariantDrafts();
        if (current.length === 1) return;
        renderVariantFields(current.filter((item) => item.id !== variant.id));
        setDirty(true);
      });
      actions.append(copyButton, removeButton);
      header.append(label, actions);

      const contentLabel = document.createElement('label');
      contentLabel.append(text('span', 'Teksts'));
      const content = document.createElement('textarea');
      content.required = true;
      content.maxLength = 12_000;
      content.rows = 8;
      content.value = variant.content;
      content.placeholder = 'Raksti tekstu, ko pēc tam varēsi nokopēt…';
      content.dataset.variantContent = '';
      contentLabel.append(content);
      card.append(header, contentLabel);
      fragment.append(card);
    });
    variantList.replaceChildren(fragment);
  };

  const openTemplateEditor = (template: PortalTextTemplate | null) => {
    setDirty(false);
    activeTemplate = template;
    templateForm.reset();
    templateControl<HTMLInputElement>('title').value = template?.title ?? '';
    templateControl<HTMLInputElement>('category').value = template?.category ?? '';
    templateControl<HTMLTextAreaElement>('notes').value = template?.notes ?? '';
    renderVariantFields(
      template?.variants ?? [{ id: crypto.randomUUID(), label: 'Draudzīgs', content: '' }],
    );
    templateEditorTitle.textContent = template?.title ?? 'Jauna sagatave';
    templateFormState.textContent = template
      ? `Atjaunināta ${new Intl.DateTimeFormat('lv-LV', { dateStyle: 'medium' }).format(new Date(template.updated_at))}`
      : 'Nav saglabāta';
    templateFormState.dataset.state = template ? 'published' : 'draft';
    templateDeleteButton.hidden = !template || !canDelete;
    templateSaveStatus.textContent = '';
    templateEmpty.hidden = true;
    templateForm.hidden = false;
    renderTemplateList();
    window.setTimeout(() => templateControl<HTMLInputElement>('title').focus(), 120);
  };

  const renderTemplateCategories = () => {
    const currentFilter = templateCategoryFilter.value;
    const categories = [...new Set(templates.map((template) => template.category))].sort((a, b) =>
      a.localeCompare(b, 'lv-LV'),
    );
    const filterOptions = [new Option('Visas kategorijas', '')];
    const dataOptions: HTMLOptionElement[] = [];
    categories.forEach((category) => {
      filterOptions.push(new Option(category, category));
      dataOptions.push(new Option(category));
    });
    templateCategoryFilter.replaceChildren(...filterOptions);
    templateCategoryOptions.replaceChildren(...dataOptions);
    if (categories.includes(currentFilter)) templateCategoryFilter.value = currentFilter;
  };

  const renderTemplateList = () => {
    const query = templateSearch.value.trim().toLocaleLowerCase('lv-LV');
    const category = templateCategoryFilter.value;
    const filtered = templates.filter((template) => {
      const matchesCategory = !category || template.category === category;
      const haystack = [
        template.title,
        template.category,
        template.notes,
        ...template.variants.flatMap((variant) => [variant.label, variant.content]),
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('lv-LV');
      return matchesCategory && (!query || haystack.includes(query));
    });

    templateStatus.textContent = `${filtered.length} no ${templates.length} sagatavēm`;
    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'portal-list-empty';
      empty.append(
        text('strong', templates.length ? 'Nekas netika atrasts.' : 'Bibliotēka vēl ir tukša.'),
        text(
          'p',
          templates.length
            ? 'Maini meklējumu vai kategorijas filtru.'
            : 'Izveido pirmo kopīgo teksta sagatavi.',
        ),
      );
      templateList.replaceChildren(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    filtered.forEach((template) => {
      const row = document.createElement('article');
      row.className = 'portal-template-list-item';
      row.classList.toggle('is-selected', activeTemplate?.id === template.id);

      const selectButton = document.createElement('button');
      selectButton.type = 'button';
      selectButton.className = 'portal-template-select';
      const copy = document.createElement('span');
      copy.append(
        text('small', template.category),
        text('strong', template.title),
        text('em', template.variants.map((variant) => variant.label).join(' · ')),
      );
      selectButton.append(copy, text('b', String(template.variants.length)));
      selectButton.addEventListener('click', () => {
        void afterDiscard(() => openTemplateEditor(template));
      });

      const quickCopy = text('button', 'Kopēt pirmo variantu') as HTMLButtonElement;
      quickCopy.type = 'button';
      quickCopy.className = 'portal-template-quick-copy';
      quickCopy.addEventListener(
        'click',
        () => void copyToClipboard(template.variants[0]?.content ?? ''),
      );
      row.append(selectButton, quickCopy);
      fragment.append(row);
    });
    templateList.replaceChildren(fragment);
  };

  const showTemplates = async () => {
    setDirty(false);
    activeView = 'templates';
    setNavState('templates');
    hideWorkspaceViews();
    templateGrid.hidden = false;
    sectionTitle.textContent = 'Tekstu sagataves';
    sectionDescription.textContent =
      'Veido kopīgu uzrunu bibliotēku ar kategorijām un vairākiem teksta toņiem.';
    createButton.hidden = false;
    createButton.querySelector('span')?.replaceChildren(document.createTextNode('Jauna sagatave'));
    templateStatus.textContent = 'Ielādē…';

    try {
      await loadTemplates();
      renderTemplateCategories();
      renderTemplateList();
      if (!activeTemplate) {
        templateForm.hidden = true;
        templateEmpty.hidden = false;
      }
    } catch (error) {
      templateStatus.textContent = 'Savienojuma kļūda';
      const failure = document.createElement('div');
      failure.className = 'portal-list-empty is-error';
      failure.append(
        text('strong', 'Sagataves nevar ielādēt.'),
        text('p', error instanceof Error ? error.message : 'Mēģini vēlreiz.'),
      );
      const retry = text('button', 'Mēģināt vēlreiz') as HTMLButtonElement;
      retry.type = 'button';
      retry.addEventListener('click', () => void showTemplates());
      failure.append(retry);
      templateList.replaceChildren(failure);
    }
  };

  const serializeTemplateForm = () => ({
    title: templateControl<HTMLInputElement>('title').value.trim(),
    category: templateControl<HTMLInputElement>('category').value.trim(),
    notes: templateControl<HTMLTextAreaElement>('notes').value.trim() || null,
    variants: readVariantDrafts(),
  });

  const priceControl = <T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    name: string,
  ): T => {
    const control = priceForm.elements.namedItem(name);
    if (!(
      control instanceof HTMLInputElement ||
      control instanceof HTMLTextAreaElement ||
      control instanceof HTMLSelectElement
    )) {
      throw new Error(`Missing pricing field: ${name}`);
    }
    return control as T;
  };

  const resetPriceForm = () => {
    setDirty(false);
    activePricingItem = null;
    priceForm.reset();
    priceControl<HTMLSelectElement>('category').value = 'integration';
    priceControl<HTMLSelectElement>('unit').value = 'item';
    priceControl<HTMLInputElement>('default_quantity').value = '1';
    priceControl<HTMLInputElement>('sort_order').value = '100';
    priceControl<HTMLInputElement>('is_active').checked = true;
    priceEditorTitle.textContent = 'Jauna cena';
    priceFormState.textContent = 'Nav saglabāta';
    priceFormState.dataset.state = 'draft';
    priceDeleteButton.hidden = true;
    priceSaveStatus.textContent = '';
  };

  const openPriceEditor = (item: PortalPricingItem | null) => {
    resetPriceForm();
    activePricingItem = item;
    if (!item) {
      window.setTimeout(() => priceControl<HTMLInputElement>('name').focus(), 120);
      return;
    }

    priceControl<HTMLInputElement>('name').value = item.name;
    priceControl<HTMLInputElement>('item_key').value = item.item_key;
    priceControl<HTMLSelectElement>('category').value = item.category;
    priceControl<HTMLSelectElement>('unit').value = item.unit;
    priceControl<HTMLInputElement>('price_eur').value = String(item.price_eur);
    priceControl<HTMLInputElement>('default_quantity').value = String(item.default_quantity);
    priceControl<HTMLInputElement>('sort_order').value = String(item.sort_order);
    priceControl<HTMLInputElement>('is_active').checked = item.is_active;
    priceControl<HTMLTextAreaElement>('description').value = item.description ?? '';
    priceEditorTitle.textContent = item.name;
    priceFormState.textContent = item.is_active ? 'Aktīva' : 'Paslēpta';
    priceFormState.dataset.state = item.is_active ? 'published' : 'draft';
    priceDeleteButton.hidden = !canDelete;
  };

  const serializePriceForm = () => ({
    category: priceControl<HTMLSelectElement>('category').value,
    default_quantity: Number(priceControl<HTMLInputElement>('default_quantity').value),
    description: priceControl<HTMLTextAreaElement>('description').value.trim() || null,
    is_active: priceControl<HTMLInputElement>('is_active').checked,
    item_key: priceControl<HTMLInputElement>('item_key').value.trim(),
    name: priceControl<HTMLInputElement>('name').value.trim(),
    price_eur: Number(priceControl<HTMLInputElement>('price_eur').value),
    sort_order: Number(priceControl<HTMLInputElement>('sort_order').value),
    unit: priceControl<HTMLSelectElement>('unit').value,
  });

  const selectedPricingItems = () =>
    pricingItems.filter((item) => item.is_active && selectedPricingItemIds.has(item.id));

  const getLineQuantityInput = (item: PortalPricingItem) =>
    calculatorBuilder.querySelector<HTMLInputElement>(`[data-price-quantity="${item.id}"]`);

  const getLineQuantity = (item: PortalPricingItem) => {
    const control = getLineQuantityInput(item);
    const parsed = Number(control?.value ?? item.default_quantity);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : item.default_quantity;
  };

  const calculateItemTotal = (item: PortalPricingItem) => item.price_eur * getLineQuantity(item);

  const getDiscountPercent = () => {
    const parsed = Number(discountPercent.value);
    if (!Number.isFinite(parsed) || parsed <= 0) return 0;
    return Math.min(parsed, 100);
  };

  const updateCalculatorTotals = () => {
    const selected = selectedPricingItems();
    const subtotal = selected.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    const discount = subtotal * (getDiscountPercent() / 100);
    const discountedSubtotal = Math.max(0, subtotal - discount);
    const vat = vatToggle.checked ? discountedSubtotal * 0.21 : 0;

    calculatorSubtotal.textContent = formatCurrency(subtotal);
    calculatorDiscount.textContent = `-${formatCurrency(discount)}`;
    calculatorVat.textContent = formatCurrency(vat);
    calculatorTotal.textContent = formatCurrency(discountedSubtotal + vat);

    if (selected.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'portal-calculator-empty';
      empty.textContent = 'Atzīmē cenu rindas katalogā, lai saliktu aprēķinu.';
      calculatorLines.replaceChildren(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    selected.forEach((item) => {
      const row = document.createElement('article');
      row.className = 'portal-calculator-line';
      const quantity = getLineQuantity(item);
      const copy = document.createElement('span');
      copy.append(
        text('strong', item.name),
        text(
          'small',
          `${quantity} ${pricingUnitLabels[item.unit]} × ${formatCurrency(item.price_eur)}`,
        ),
      );
      row.append(copy, text('b', formatCurrency(item.price_eur * quantity)));
      fragment.append(row);
    });
    calculatorLines.replaceChildren(fragment);
  };

  const renderCalculatorBuilder = () => {
    const active = pricingItems.filter((item) => item.is_active);
    if (active.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'portal-list-empty';
      empty.append(
        text('strong', 'Nav aktīvu cenu rindu.'),
        text('p', 'Pievieno vai aktivizē cenu katalogā, lai kalkulators sāktu strādāt.'),
      );
      calculatorBuilder.replaceChildren(empty);
      updateCalculatorTotals();
      return;
    }

    const fragment = document.createDocumentFragment();
    pricingCategoryOrder.forEach((category) => {
      const items = active.filter((item) => item.category === category);
      if (items.length === 0) return;

      const section = document.createElement('section');
      section.className = 'portal-calculator-group';
      section.append(text('h3', pricingCategoryLabels[category]));
      items.forEach((item) => {
        const row = document.createElement('label');
        row.className = 'portal-calculator-option';
        const input = document.createElement('input');
        input.type = item.category === 'base' ? 'radio' : 'checkbox';
        input.name = item.category === 'base' ? 'calculator-base' : `calculator-${item.id}`;
        input.checked = selectedPricingItemIds.has(item.id);
        input.addEventListener('change', () => {
          if (item.category === 'base') {
            pricingItems
              .filter((candidate) => candidate.category === 'base')
              .forEach((candidate) => selectedPricingItemIds.delete(candidate.id));
          }
          if (input.checked) selectedPricingItemIds.add(item.id);
          else selectedPricingItemIds.delete(item.id);
          renderCalculatorBuilder();
        });

        const copy = document.createElement('span');
        const heading = document.createElement('strong');
        heading.append(
          text('span', item.name),
          text('b', `${formatCurrency(item.price_eur)} / ${pricingUnitLabels[item.unit]}`),
        );
        copy.append(heading, text('small', item.description ?? 'Bez apraksta'));

        const quantity = document.createElement('input');
        quantity.type = 'number';
        quantity.min = '0.01';
        quantity.step = '0.01';
        quantity.value = String(item.default_quantity);
        quantity.dataset.priceQuantity = String(item.id);
        quantity.disabled = !selectedPricingItemIds.has(item.id);
        quantity.setAttribute('aria-label', `${item.name} daudzums`);
        quantity.addEventListener('input', updateCalculatorTotals);

        row.append(input, copy, quantity);
        section.append(row);
      });
      fragment.append(section);
    });
    calculatorBuilder.replaceChildren(fragment);
    updateCalculatorTotals();
  };

  const renderPriceList = () => {
    const query = priceSearch.value.trim().toLocaleLowerCase('lv-LV');
    const filtered = pricingItems.filter((item) => {
      const haystack = [
        item.name,
        item.item_key,
        item.description,
        pricingCategoryLabels[item.category],
        pricingUnitLabels[item.unit],
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('lv-LV');
      return !query || haystack.includes(query);
    });

    priceStatus.textContent = `${filtered.length} no ${pricingItems.length} cenām`;
    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'portal-list-empty';
      empty.append(
        text('strong', pricingItems.length ? 'Nekas netika atrasts.' : 'Katalogs vēl ir tukšs.'),
        text(
          'p',
          pricingItems.length ? 'Maini meklējumu vai pievieno jaunu cenu.' : 'Izveido pirmo cenu.',
        ),
      );
      priceList.replaceChildren(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    pricingCategoryOrder.forEach((category) => {
      const items = filtered.filter((item) => item.category === category);
      if (items.length === 0) return;
      const group = document.createElement('section');
      group.className = 'portal-price-group';
      group.append(text('h3', pricingCategoryLabels[category]));
      items.forEach((item) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'portal-price-item';
        button.classList.toggle('is-selected', activePricingItem?.id === item.id);
        button.classList.toggle('is-muted', !item.is_active);
        const copy = document.createElement('span');
        copy.append(text('strong', item.name), text('small', item.description ?? item.item_key));
        const meta = document.createElement('span');
        meta.append(
          text('b', formatCurrency(item.price_eur)),
          text('small', pricingUnitLabels[item.unit]),
        );
        button.append(copy, meta);
        button.addEventListener('click', () => {
          void afterDiscard(() => {
            openPriceEditor(item);
            renderPriceList();
          });
        });
        group.append(button);
      });
      fragment.append(group);
    });
    priceList.replaceChildren(fragment);
  };

  const showCalculator = async () => {
    setDirty(false);
    activeView = 'calculator';
    setNavState('calculator');
    hideWorkspaceViews();
    calculatorGrid.hidden = false;
    sectionTitle.textContent = 'Cenu kalkulators';
    sectionDescription.textContent =
      'Rediģē cenu katalogu un ātri saliec projekta provizorisko aprēķinu.';
    createButton.hidden = false;
    createButton.querySelector('span')?.replaceChildren(document.createTextNode('Jauna cena'));
    priceStatus.textContent = 'Ielādē…';

    try {
      await loadPricingItems();
      selectedPricingItemIds = new Set(
        selectedPricingItemIds.size
          ? [...selectedPricingItemIds].filter((id) =>
              pricingItems.some((item) => item.id === id && item.is_active),
            )
          : pricingItems
              .filter((item) => item.is_active && ['base', 'page'].includes(item.category))
              .slice(0, 2)
              .map((item) => item.id),
      );
      renderPriceList();
      renderCalculatorBuilder();
      if (!activePricingItem) resetPriceForm();
    } catch (error) {
      priceStatus.textContent = 'Savienojuma kļūda';
      const failure = document.createElement('div');
      failure.className = 'portal-list-empty is-error';
      failure.append(
        text('strong', 'Cenu katalogu nevar ielādēt.'),
        text('p', error instanceof Error ? error.message : 'Mēģini vēlreiz.'),
      );
      const retry = text('button', 'Mēģināt vēlreiz') as HTMLButtonElement;
      retry.type = 'button';
      retry.addEventListener('click', () => void showCalculator());
      failure.append(retry);
      priceList.replaceChildren(failure);
    }
  };

  const copyEstimate = async () => {
    const selected = selectedPricingItems();
    if (selected.length === 0) {
      notify('Aprēķinā vēl nav nevienas rindas.', 'error');
      return;
    }
    const subtotal = selected.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    const discountPercentValue = getDiscountPercent();
    const discount = subtotal * (discountPercentValue / 100);
    const discountedSubtotal = Math.max(0, subtotal - discount);
    const vat = vatToggle.checked ? discountedSubtotal * 0.21 : 0;
    const lines = selected.map((item) => {
      const quantity = getLineQuantity(item);
      return `- ${item.name}: ${quantity} ${pricingUnitLabels[item.unit]} × ${formatCurrency(item.price_eur)} = ${formatCurrency(item.price_eur * quantity)}`;
    });
    await copyToClipboard(
      [
        'ROMADI provizoriskais aprēķins',
        ...lines,
        `Starpsumma: ${formatCurrency(subtotal)}`,
        `Atlaide (${discountPercentValue}%): -${formatCurrency(discount)}`,
        `PVN: ${formatCurrency(vat)}`,
        `Kopā: ${formatCurrency(discountedSubtotal + vat)}`,
      ].join('\n'),
    );
  };

  const renderDashboard = () => {
    const openLeads = leads.filter(
      (lead) => !['client', 'rejected', 'no_response'].includes(lead.status),
    );
    const dueLeads = leads.filter(isFollowUpDue);
    const untouchedLeads = leads.filter((lead) => lead.status === 'not_contacted');
    const taskCandidates = [
      ...dueLeads,
      ...untouchedLeads.filter((lead) => !dueLeads.includes(lead)),
    ];
    const tasks = taskCandidates.slice(0, 6);

    $<HTMLElement>(root, '[data-home-metric="open-leads"]').textContent = String(openLeads.length);
    $<HTMLElement>(root, '[data-home-metric="due-tasks"]').textContent = String(
      taskCandidates.length,
    );
    $<HTMLElement>(root, '[data-home-metric="templates"]').textContent = String(templates.length);

    if (tasks.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'portal-home-empty';
      empty.append(
        text('strong', 'Šodien nekas nedeg.'),
        text('p', 'Jauni follow-up termiņi un neuzrunātie lead parādīsies šeit.'),
      );
      homeTaskList.replaceChildren(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    tasks.forEach((lead) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'portal-home-task';
      const copy = document.createElement('span');
      copy.append(
        text('strong', lead.company_name),
        text('small', `${lead.found_on}${lead.outreach_owner ? ` · ${lead.outreach_owner}` : ''}`),
      );
      const state = text(
        'b',
        isFollowUpDue(lead) ? `Follow-up ${formatDate(lead.follow_up_due_at)}` : 'Vēl nav uzrunāts',
      );
      state.dataset.state = isFollowUpDue(lead) ? 'due' : 'new';
      button.append(copy, state);
      button.addEventListener('click', () => {
        void afterDiscard(async () => {
          await showLeads();
          openLeadEditor(lead);
        });
      });
      fragment.append(button);
    });
    homeTaskList.replaceChildren(fragment);
  };

  const showDashboard = () => {
    setDirty(false);
    activeView = 'dashboard';
    setNavState('dashboard');
    hideWorkspaceViews();
    homeView.hidden = false;
    sectionTitle.textContent = 'Pārskats';
    sectionDescription.textContent =
      'Dienas uzdevumi, aktīvie kontakti un biežāk lietotās darbības vienuviet.';
    createButton.hidden = true;
    renderDashboard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateLeadStatus = async (id: number, status: LeadStatus) => {
    const lead = leads.find((item) => item.id === id);
    if (!lead || lead.status === status) return;
    if (status !== 'not_contacted' && !lead.outreach_owner) {
      openLeadEditor(lead);
      setLeadOutreachState(true);
      leadControl<HTMLSelectElement>('status').value = status;
      setDirty(true);
      leadControl<HTMLInputElement>('outreach_owner').focus();
      notify('Pirms statusa maiņas norādi, kurš uzrunāja lead.', 'error');
      return;
    }
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

  templateForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = templateForm.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!submit) return;
    submit.disabled = true;
    submit.textContent = 'Saglabā…';
    templateSaveStatus.textContent = 'Pārbauda sagatavi';

    try {
      const data = serializeTemplateForm();
      const response = await request<{ data: PortalTextTemplate }>('/api/portal/text-templates', {
        method: activeTemplate ? 'PATCH' : 'POST',
        body: JSON.stringify(activeTemplate ? { id: activeTemplate.id, data } : data),
      });
      setDirty(false);
      if (activeTemplate) {
        templates = templates.map((template) =>
          template.id === activeTemplate?.id ? response.data : template,
        );
      } else {
        templates = [response.data, ...templates];
      }
      templates.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      activeTemplate = response.data;
      updateCount('text_templates', templates.length);
      renderTemplateCategories();
      openTemplateEditor(response.data);
      notify('Teksta sagatave ir saglabāta.');
    } catch (error) {
      templateSaveStatus.textContent =
        error instanceof Error ? error.message : 'Sagatavi neizdevās saglabāt.';
      notify(templateSaveStatus.textContent, 'error');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Saglabāt sagatavi';
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
      if (activeLead)
        leads = leads.map((lead) => (lead.id === activeLead?.id ? response.data : lead));
      else leads = [response.data, ...leads];
      updateCount('leads', leads.length);
      activeLead = response.data;
      openLeadEditor(response.data);
      renderLeadBoard();
      notify('Lead ir saglabāts.');
      leadSaveStatus.textContent = '';
    } catch (error) {
      leadSaveStatus.textContent =
        error instanceof Error ? error.message : 'Lead saglabāšana neizdevās.';
      notify(leadSaveStatus.textContent, 'error');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Saglabāt lead';
    }
  });

  priceForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = priceForm.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!submit) return;
    submit.disabled = true;
    submit.textContent = 'Saglabā…';
    priceSaveStatus.textContent = 'Pārbauda cenu';

    try {
      const data = serializePriceForm();
      const response = await request<{ data: PortalPricingItem }>('/api/portal/pricing-items', {
        method: activePricingItem ? 'PATCH' : 'POST',
        body: JSON.stringify(activePricingItem ? { id: activePricingItem.id, data } : data),
      });
      setDirty(false);
      if (activePricingItem) {
        pricingItems = pricingItems.map((item) =>
          item.id === activePricingItem?.id ? response.data : item,
        );
      } else {
        pricingItems = [...pricingItems, response.data];
      }
      pricingItems.sort(
        (a, b) =>
          pricingCategoryOrder.indexOf(a.category) - pricingCategoryOrder.indexOf(b.category) ||
          a.sort_order - b.sort_order ||
          a.id - b.id,
      );
      activePricingItem = response.data;
      if (!response.data.is_active) selectedPricingItemIds.delete(response.data.id);
      updateCount('portal_pricing_items', pricingItems.length);
      renderPriceList();
      renderCalculatorBuilder();
      openPriceEditor(response.data);
      notify('Cena ir saglabāta.');
    } catch (error) {
      priceSaveStatus.textContent =
        error instanceof Error ? error.message : 'Cenu neizdevās saglabāt.';
      notify(priceSaveStatus.textContent, 'error');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Saglabāt cenu';
    }
  });

  editorForm.addEventListener('input', () => setDirty(true));
  leadForm.addEventListener('input', () => setDirty(true));
  priceForm.addEventListener('input', () => setDirty(true));
  templateForm.addEventListener('input', () => setDirty(true));
  leadControl<HTMLInputElement>('is_contacted').addEventListener('change', (event) => {
    const toggle = event.currentTarget;
    if (!(toggle instanceof HTMLInputElement)) return;
    setLeadOutreachState(toggle.checked, !toggle.checked);
  });
  leadSearch.addEventListener('input', renderLeadBoard);
  priceSearch.addEventListener('input', renderPriceList);
  discountPercent.addEventListener('input', updateCalculatorTotals);
  vatToggle.addEventListener('change', updateCalculatorTotals);
  copyEstimateButton.addEventListener('click', () => void copyEstimate());
  templateSearch.addEventListener('input', renderTemplateList);
  templateCategoryFilter.addEventListener('change', renderTemplateList);
  addVariantButton.addEventListener('click', () => {
    const variants = readVariantDrafts();
    if (variants.length >= 12) {
      notify('Vienai sagatavei var būt ne vairāk kā 12 varianti.', 'error');
      return;
    }
    variants.push({ id: crypto.randomUUID(), label: '', content: '' });
    renderVariantFields(variants);
    setDirty(true);
    window.setTimeout(() => {
      const labels = Array.from(
        variantList.querySelectorAll<HTMLInputElement>('[data-variant-label]'),
      );
      labels.at(-1)?.focus();
    }, 0);
  });

  createButton.addEventListener('click', () => {
    void afterDiscard(() => {
      if (activeView === 'leads') openLeadEditor(null);
      else if (activeView === 'calculator') openPriceEditor(null);
      else if (activeView === 'templates') openTemplateEditor(null);
      else if (activeView !== 'audit') openEditor(null);
    });
  });

  leadResetButton.addEventListener('click', () => void afterDiscard(() => openLeadEditor(null)));
  priceResetButton.addEventListener('click', () => void afterDiscard(() => openPriceEditor(null)));
  templateResetButton.addEventListener('click', () => {
    void afterDiscard(() => openTemplateEditor(activeTemplate));
  });

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

  priceDeleteButton.addEventListener('click', () => {
    if (activePricingItem && canDelete) {
      deleteMode = 'pricing';
      dialog.showModal();
    }
  });

  templateDeleteButton.addEventListener('click', () => {
    if (activeTemplate && canDelete) {
      deleteMode = 'template';
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
      } else if (deleteMode === 'pricing' && activePricingItem) {
        await request('/api/portal/pricing-items', {
          method: 'DELETE',
          body: JSON.stringify({ id: activePricingItem.id }),
        });
        pricingItems = pricingItems.filter((item) => item.id !== activePricingItem?.id);
        selectedPricingItemIds.delete(activePricingItem.id);
        activePricingItem = null;
        setDirty(false);
        updateCount('portal_pricing_items', pricingItems.length);
        resetPriceForm();
        renderPriceList();
        renderCalculatorBuilder();
        notify('Cena ir dzēsta.');
      } else if (deleteMode === 'template' && activeTemplate) {
        await request('/api/portal/text-templates', {
          method: 'DELETE',
          body: JSON.stringify({ id: activeTemplate.id }),
        });
        templates = templates.filter((template) => template.id !== activeTemplate?.id);
        activeTemplate = null;
        setDirty(false);
        updateCount('text_templates', templates.length);
        renderTemplateCategories();
        renderTemplateList();
        templateForm.hidden = true;
        templateEmpty.hidden = false;
        templateEditorTitle.textContent = 'Izvēlies sagatavi';
        templateFormState.textContent = 'Nav izvēlēts';
        notify('Teksta sagatave ir dzēsta.');
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

  root
    .querySelector<HTMLButtonElement>('[data-section="calculator"]')
    ?.addEventListener('click', () => {
      void afterDiscard(showCalculator);
    });

  root
    .querySelector<HTMLButtonElement>('[data-section="templates"]')
    ?.addEventListener('click', () => {
      void afterDiscard(showTemplates);
    });

  root
    .querySelector<HTMLButtonElement>('[data-section="dashboard"]')
    ?.addEventListener('click', () => {
      void afterDiscard(showDashboard);
    });

  $<HTMLButtonElement>(root, '[data-dashboard-brand]').addEventListener('click', () => {
    void afterDiscard(showDashboard);
  });

  root.querySelectorAll<HTMLButtonElement>('[data-home-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.homeAction;
      if (action === 'leads') void afterDiscard(showLeads);
      else if (action === 'new-lead') {
        void afterDiscard(async () => {
          await showLeads();
          openLeadEditor(null);
        });
      } else if (action === 'new-template') {
        void afterDiscard(async () => {
          await showTemplates();
          openTemplateEditor(null);
        });
      } else if (action === 'projects') void afterDiscard(() => showResource('projects'));
    });
  });

  const sidebarToggle = $<HTMLButtonElement>(root, '[data-sidebar-toggle]');
  const setSidebarCollapsed = (collapsed: boolean) => {
    root.classList.toggle('is-sidebar-collapsed', collapsed);
    sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
    sidebarToggle.setAttribute(
      'aria-label',
      collapsed ? 'Izvērst sānu izvēlni' : 'Sakļaut sānu izvēlni',
    );
    const label = sidebarToggle.querySelector('span');
    if (label) label.textContent = collapsed ? 'Izvērst izvēlni' : 'Sakļaut izvēlni';
  };

  try {
    setSidebarCollapsed(localStorage.getItem('romadi_portal_sidebar_collapsed_v1') === 'true');
  } catch {
    setSidebarCollapsed(false);
  }

  sidebarToggle.addEventListener('click', () => {
    const collapsed = !root.classList.contains('is-sidebar-collapsed');
    setSidebarCollapsed(collapsed);
    try {
      localStorage.setItem('romadi_portal_sidebar_collapsed_v1', String(collapsed));
    } catch {
      // The navigation still works when storage is unavailable.
    }
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
    loadPricingItems(),
    loadTemplates(),
    ...(Object.keys(definitions) as Resource[]).map((resource) => loadResource(resource)),
  ]).then(() => showDashboard());
}
