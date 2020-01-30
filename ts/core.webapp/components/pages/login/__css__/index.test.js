let page;
const uri = 'http://localhost:4000/login';
beforeEach(async () => {
  page = await global.browser.newPage();
});
afterEach(async () => {
  await page.close();
});
describe('core.webapp -> /login', () => {
  it('initial state', async () => {
    await page.goto(uri);
    await page.waitForSelector('form.briskhome-login');
    const element = await page.$('form.briskhome-login');
    expect((await element.screenshot())).toMatchImageSnapshot();
  });
  it('invalid state', async () => {
    await page.goto(uri);
    await page.waitForSelector('form.briskhome-login');
    await page.click('a[type=submit]');
    const element = await page.$('form.briskhome-login');
    expect((await element.screenshot())).toMatchImageSnapshot();
  });
});