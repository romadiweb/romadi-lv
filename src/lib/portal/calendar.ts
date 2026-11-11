import type { Database } from '@/types/database';

type Event = Database['public']['Tables']['portal_calendar_events']['Row'];
type Entry = {
  title: string;
  date: string;
  kind: Event['event_type'] | 'quota' | 'task';
  tag?: string;
  notes?: string;
};
const labels = { event: 'Notikumi', social: 'Sociālie tīkli', quota: 'Kvotas', task: 'Uzdevumi' };
const rigaDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Riga', dateStyle: 'short' });
const monthLabel = new Intl.DateTimeFormat('lv-LV', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});
const dateKey = (date: Date) => date.toISOString().slice(0, 10);

export function initPortalCalendar(
  root: HTMLElement,
  request: <T>(url: string, options?: RequestInit) => Promise<T>,
  deadlines: () => Entry[],
) {
  const today = () => rigaDate.format(new Date());
  let selected = today();
  let month = selected.slice(0, 7);
  let events: Event[] = [];
  let revision = 0;
  let saving = false;
  const dialog = root.querySelector<HTMLDialogElement>('[data-calendar-dialog]')!;
  const form = dialog.querySelector<HTMLFormElement>('[data-calendar-form]')!;
  const search = dialog.querySelector<HTMLInputElement>('[data-calendar-search]')!;
  const status = dialog.querySelector<HTMLElement>('[data-calendar-status]')!;
  const detail = dialog.querySelector<HTMLElement>('[data-calendar-detail]')!;
  const agenda = root.querySelector<HTMLElement>('[data-calendar-agenda]')!;
  const grids = root.querySelectorAll<HTMLElement>('[data-calendar-grid]');

  const node = (tag: string, text: string) => {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
  };
  const button = (text: string, action: () => void, label?: string) => {
    const element = document.createElement('button');
    element.type = 'button';
    element.textContent = text;
    if (label) element.setAttribute('aria-label', label);
    element.addEventListener('click', action);
    return element;
  };
  const add = (date: string) => {
    form.reset();
    (form.elements.namedItem('event_date') as HTMLInputElement).value = date;
    detail.hidden = true;
    form.hidden = false;
    form.querySelector('input')?.focus();
  };
  const showDetail = (entry: Entry) => {
    form.hidden = true;
    detail.replaceChildren(
      node('h3', entry.title),
      node('p', [entry.date, labels[entry.kind], entry.tag].filter(Boolean).join(' · ')),
      node('p', entry.notes ?? ''),
    );
    detail.hidden = false;
    detail.scrollIntoView({ block: 'nearest' });
  };

  function render() {
    const entries: Entry[] = [
      ...deadlines(),
      ...events.map((event) => ({
        title: event.title,
        date: event.event_date,
        kind: event.event_type,
        tag: event.tag,
        notes: event.notes,
      })),
    ];
    const first = new Date(month + '-01T12:00:00Z');
    const length = new Date(
      Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0),
    ).getUTCDate();
    const leading = (first.getUTCDay() + 6) % 7;
    for (const grid of grids) {
      const full = grid.dataset.calendarGrid === 'full';
      const nav = node('div', '');
      nav.className = 'portal-calendar-nav';
      nav.append(
        button('‹', () => move(-1), 'Iepriekšējais mēnesis'),
        node('strong', monthLabel.format(first)),
        button('›', () => move(1), 'Nākamais mēnesis'),
        button('Šodien', () => choose(today())),
      );
      const days = node('div', '');
      days.className = 'portal-calendar-days';
      for (const name of ['Pr', 'Ot', 'Tr', 'Ce', 'Pk', 'Se', 'Sv'])
        days.append(node('span', name));
      for (let offset = 0; offset < leading; offset++) days.append(node('div', ''));
      const query = full ? search.value.trim().toLocaleLowerCase('lv') : '';
      for (let day = 1; day <= length; day++) {
        const date = month + '-' + String(day).padStart(2, '0');
        const items = entries.filter(
          (entry) =>
            entry.date === date &&
            (!query ||
              [entry.title, entry.tag, entry.notes, labels[entry.kind]]
                .join(' ')
                .toLocaleLowerCase('lv')
                .includes(query)),
        );
        const cell = node('div', '');
        cell.className = 'portal-calendar-day';
        cell.toggleAttribute('data-today', date === today());
        cell.toggleAttribute('data-selected', date === selected);
        if (full) {
          cell.append(button(String(day), () => add(date), 'Pievienot notikumu ' + date));
          for (const entry of items) {
            const chip = button(
              entry.title,
              () => showDetail(entry),
              labels[entry.kind] + ': ' + entry.title,
            );
            chip.className = 'portal-calendar-entry';
            chip.dataset.kind = entry.kind;
            cell.append(chip);
          }
        } else {
          cell.append(
            button(
              String(day) + (items.length ? ' •' : ''),
              () => {
                selected = date;
                render();
                root
                  .querySelector<HTMLButtonElement>(
                    '[data-calendar-grid="mini"] [data-selected] button',
                  )
                  ?.focus();
              },
              date + ' · ' + items.length + ' ieraksti',
            ),
          );
        }
        days.append(cell);
      }
      grid.replaceChildren(nav, days);
    }
    const items = entries.filter((entry) => entry.date === selected);
    agenda.replaceChildren(
      node('li', selected),
      ...items.map((entry) => node('li', labels[entry.kind] + ': ' + entry.title)),
    );
    if (!items.length) agenda.append(node('li', 'Šajā dienā nav ierakstu.'));
  }

  async function refresh() {
    const current = ++revision;
    status.textContent = 'Ielādē kalendāru…';
    try {
      const response = await request<{ data: Event[] }>('/api/portal/calendar?month=' + month);
      if (current !== revision) return;
      events = response.data;
      status.textContent = '';
      render();
    } catch (error) {
      if (current !== revision) return;
      status.textContent = error instanceof Error ? error.message : 'Kalendāru neizdevās ielādēt.';
    }
  }
  function choose(date: string) {
    selected = date;
    month = date.slice(0, 7);
    detail.hidden = true;
    render();
    void refresh();
  }
  function move(offset: number) {
    const next = new Date(month + '-01T12:00:00Z');
    next.setUTCMonth(next.getUTCMonth() + offset);
    choose(dateKey(next));
  }

  for (const open of root.querySelectorAll('[data-calendar-open]')) {
    open.addEventListener('click', () => {
      render();
      dialog.showModal();
      void refresh();
    });
  }
  search.addEventListener('input', render);
  dialog.querySelector('[data-calendar-add]')?.addEventListener('click', () => add(selected));
  dialog.querySelector('[data-calendar-cancel]')?.addEventListener('click', () => {
    form.hidden = true;
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (saving) return;
    saving = true;
    const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
    submit.disabled = true;
    try {
      const result = await request<{ data: Event }>('/api/portal/calendar', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      form.hidden = true;
      search.value = '';
      events.push(result.data);
      choose(result.data.event_date);
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : 'Notikumu neizdevās saglabāt.';
    } finally {
      saving = false;
      submit.disabled = false;
    }
  });

  render();
  void refresh();
  return { render };
}
