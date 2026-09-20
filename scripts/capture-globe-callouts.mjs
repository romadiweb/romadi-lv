import { chromium } from 'playwright';

const browser = await chromium.launch();

const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await desktop.goto('http://127.0.0.1:4321/pakalpojumi/majaslapu-izstrade-liepaja');
const desktopReject = desktop.getByRole('button', { name: 'Noraidīt' });
if (await desktopReject.isVisible()) await desktopReject.click();
const desktopGlobe = desktop.locator('[data-romadi-globe]');
await desktopGlobe.scrollIntoViewIfNeeded();
await desktop.waitForTimeout(900);
await desktopGlobe.screenshot({ path: '.impeccable/review/callouts-desktop-a.png' });

const stage = desktop.locator('[data-stage]');
const stageBox = await stage.boundingBox();
if (stageBox) {
  const x = stageBox.x + stageBox.width * 0.52;
  const y = stageBox.y + stageBox.height * 0.55;
  await desktop.mouse.move(x, y);
  await desktop.mouse.down();
  await desktop.mouse.move(x - 230, y, { steps: 12 });
  await desktop.mouse.up();
  await desktop.waitForTimeout(500);
}
await desktopGlobe.screenshot({ path: '.impeccable/review/callouts-desktop-b.png' });

const visibleCalloutSets = [];
if (stageBox) {
  const x = stageBox.x + stageBox.width * 0.52;
  const y = stageBox.y + stageBox.height * 0.55;
  for (let index = 0; index < 12; index += 1) {
    await desktop.mouse.move(x, y);
    await desktop.mouse.down();
    await desktop.mouse.move(x + 90, y, { steps: 6 });
    await desktop.mouse.up();
    await desktop.waitForTimeout(120);
    const ids = await desktop.locator('[data-callout].is-visible').evaluateAll((callouts) =>
      callouts.map((callout) => (callout instanceof HTMLElement ? callout.dataset.callout : '')),
    );
    visibleCalloutSets.push(ids);
    if (ids.includes('commerce')) {
      await desktopGlobe.screenshot({ path: '.impeccable/review/callouts-desktop-commerce.png' });
      break;
    }
  }
}
console.log(JSON.stringify({ visibleCalloutSets }));
await desktop.close();

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto('http://127.0.0.1:4321/pakalpojumi/majaslapu-izstrade-liepaja');
const mobileReject = mobile.getByRole('button', { name: 'Noraidīt' });
if (await mobileReject.isVisible()) await mobileReject.click();
const mobileGlobe = mobile.locator('[data-romadi-globe]');
await mobileGlobe.scrollIntoViewIfNeeded();
await mobile.waitForTimeout(900);
await mobileGlobe.screenshot({ path: '.impeccable/review/callouts-mobile.png' });
await mobile.close();

await browser.close();
