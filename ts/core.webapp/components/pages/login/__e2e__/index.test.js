let page;
const uri = 'http://localhost:4000/login';
beforeEach(async () => {
  page = await global.browser.newPage();
});
afterEach(async () => {
  await page.close();
});
describe('core.webapp -> /login', () => {
  xdescribe('image snapshots', () => {
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
  it('submit form with invalid username', async () => {
    await page.goto(uri);
    await page.waitForSelector('form.briskhome-login');
    await page.click('input[name=username]');
    await page.type('input[name=username]', 'invalid');
    await page.click('input[name=password]');
    await page.type('input[name=password]', 'invalid');
    await page.click('a[type=submit]');
    await page.waitForSelector('input.briskhome-input_invalid[name=username]');
  });
  it('submit form with invalid password', async () => {
    await page.goto(uri);
    await page.waitForSelector('form.briskhome-login');
    await page.click('input[name=username]');
    await page.type('input[name=username]', 'jdoe');
    await page.click('input[name=password]');
    await page.type('input[name=password]', 'invalid');
    await page.click('a[type=submit]');
    await page.waitForSelector('input.briskhome-input_invalid[name=password]');
  });
  it('submit empty form', async () => {
    await page.goto(uri);
    await page.waitForSelector('form.briskhome-login');
    await page.click('a[type=submit]');
    await page.waitForSelector('input.briskhome-input_invalid[name=username]');
    await page.waitForSelector('input.briskhome-input_invalid[name=password]');
  });
  it('submit', async () => {
    expect((await page.cookies()).length).toBe(0);
    await page.goto(uri);
    await page.waitForSelector('form.briskhome-login');
    await page.click('input[name=username]');
    await page.type('input[name=username]', 'jdoe');
    await page.click('input[name=password]');
    await page.type('input[name=password]', '12345');
    await page.click('a[type=submit]');
    await page.waitForSelector('div.dashboard');
    expect((await page.cookies()).length).toBe(1);
  });
});