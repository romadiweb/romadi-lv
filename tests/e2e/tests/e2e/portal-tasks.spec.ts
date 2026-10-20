import { expect, test } from '@playwright/test';
import { renderPortalFixture } from '../../fixtures/portal';

let html: string;
const me = '11111111-1111-4111-8111-111111111111';
const teammate = '22222222-2222-4222-8222-222222222222';

test.beforeAll(async () => {
  html = await renderPortalFixture();
});

test('opens summaries, persists notification reads, and shows completed work', async ({
  page,
}, testInfo) => {
  const tasks = [
    {
      id: 1,
      title: 'Portfolio un footer atjauninājumi',
      description: 'Pievienot saites un aprakstus.\nPārbaudīt mobilajā ierīcē.',
      assigned_to: 'me@romadi.lv',
      assigned_to_user_id: me,
      created_by: 'Anna',
      created_by_user_id: teammate,
      created_at: '2026-10-19T10:00:00Z',
      updated_at: '2026-10-19T10:00:00Z',
      due_date: '2026-10-21',
      priority: 'normal',
      status: 'todo',
      task_type: 'manual',
      source_module: null,
      source_record_id: null,
      completed_at: null,
      completed_by: null,
      completed_by_user_id: null,
    },
    {
      id: 2,
      title: 'Iepriekš pabeigtais darbs',
      description: null,
      assigned_to: 'Anna',
      assigned_to_user_id: teammate,
      created_by: 'Anna',
      created_by_user_id: teammate,
      created_at: '2026-10-18T10:00:00Z',
      updated_at: '2026-10-19T10:00:00Z',
      due_date: null,
      priority: 'normal',
      status: 'done',
      task_type: 'manual',
      source_module: null,
      source_record_id: null,
      completed_at: '2026-10-19T10:00:00Z',
      completed_by: 'Anna',
      completed_by_user_id: teammate,
    },
  ];
  const notifications = [
    {
      id: 1,
      task_id: 1,
      user_id: me,
      created_at: '2026-10-19T10:00:00Z',
      read_at: null as string | null,
    },
  ];
  await page.route('**/__portal-fixture', (route) =>
    route.fulfill({ contentType: 'text/html', body: html }),
  );
  await page.route('**/api/portal/**', async (route) => {
    const resource = new URL(route.request().url()).pathname.split('/').pop();
    let data: unknown = [];
    if (resource === 'tasks') {
      if (route.request().method() === 'PATCH') {
        expect(route.request().postDataJSON()).toEqual({ id: 1, data: { status: 'done' } });
        Object.assign(tasks[0]!, {
          status: 'done',
          completed_at: '2026-10-20T12:00:00Z',
          completed_by: 'me@romadi.lv',
          completed_by_user_id: me,
        });
        data = tasks[0];
      } else data = tasks;
    } else if (resource === 'notifications') {
      if (route.request().method() === 'PATCH') {
        notifications[0]!.read_at = '2026-10-20T12:00:00Z';
        data = notifications[0];
      } else data = notifications;
    } else if (resource === 'users')
      data = [
        { id: me, email: 'me@romadi.lv', display_name: 'Roberts', is_active: true, role: 'admin' },
        {
          id: teammate,
          email: 'anna@romadi.lv',
          display_name: 'Anna',
          is_active: true,
          role: 'admin',
        },
      ];
    await route.fulfill({ json: { data } });
  });
  const openFixture = async () => {
    await page.goto('/__portal-fixture');
    await page.addScriptTag({
      type: 'module',
      content:
        "import { initPortalDashboard } from '/src/lib/portal/dashboard.ts'; initPortalDashboard();",
    });
  };
  const navigate = async (section: string) => {
    if (page.viewportSize()!.width <= 960) await page.locator('[data-mobile-menu-toggle]').click();
    await page.locator('[data-section="' + section + '"]').click();
  };
  await openFixture();
  const card = page.locator('[data-home-task-list] button').filter({ hasText: tasks[0]!.title });
  await expect(card).toHaveClass(/is-mine/);
  await expect(page.locator('[data-notification-count]')).toHaveText('1');
  await expect(page.locator('[data-home-completed-list]')).toContainText('Anna');
  await expect(page.getByText('Ātrās darbības', { exact: true })).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('dashboard.png'), fullPage: true });
  await card.click();
  const summary = page.locator('[data-task-detail-dialog]');
  await expect(summary).toBeVisible();
  await expect(summary).toContainText('Kopsavilkums');
  await page.screenshot({ path: testInfo.outputPath('summary.png'), fullPage: true });
  await expect(summary).toContainText('Pārbaudīt mobilajā ierīcē.');
  await expect(page.locator('[data-task-editor-panel]')).toBeHidden();
  await expect(page.locator('[data-task-detail-edit]')).toBeHidden();
  await expect(page.locator('[data-task-complete]')).toBeVisible();
  await expect(page.locator('[data-notification-count]')).toBeHidden();
  await page.locator('[data-task-detail-dismiss]').click();
  await navigate('notifications');
  await page.locator('[data-notification-list] button').first().click();
  await expect(summary).toBeVisible();
  await page.locator('[data-task-complete]').click();
  await expect(summary).toContainText('Pabeigts');
  await expect(summary).toContainText('Roberts');
  await expect(page.locator('[data-task-complete]')).toBeHidden();
  await page.locator('[data-task-detail-dismiss]').click();
  await navigate('dashboard');
  await expect(page.locator('[data-home-task-list]')).not.toContainText(tasks[0]!.title);
  await expect(page.locator('[data-home-completed-list]')).toContainText(tasks[0]!.title);
  await expect(page.locator('[data-home-completed-list]')).toContainText('Roberts');
  await expect(page.locator('[data-notification-count]')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    page.viewportSize()!.width,
  );
  await openFixture();
  await expect(page.locator('[data-home-completed-list]')).toContainText(tasks[0]!.title);
  await expect(page.locator('[data-notification-count]')).toBeHidden();

  // A creator also sees the summary first and must explicitly choose editing.
  tasks[0]!.created_by_user_id = me;
  await openFixture();
  await page
    .locator('[data-home-completed-list] button')
    .filter({ hasText: tasks[0]!.title })
    .click();
  await expect(page.locator('[data-task-editor-panel]')).toBeHidden();
  await page.locator('[data-task-detail-edit]').click();
  await expect(page.locator('[data-task-editor-panel]')).toBeVisible();
  await expect(page.locator('[data-task-form] [name="title"]')).toHaveValue(tasks[0]!.title);
});
