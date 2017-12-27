let page;
const uri = 'http://localhost:4000/login';

jest.setTimeout(10000);

beforeEach(async () => {
  page = await global.browser.newPage();
});

afterEach(async () => {
  await page.close();
});

describe('core.webapp -> /login', () => {
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
    await page.goto(uri);
    await page.waitForSelector('form.briskhome-login');
    await page.click('input[name=username]');
    await page.type('input[name=username]', 'jdoe');
    await page.click('input[name=password]');
    await page.type('input[name=password]', '12345');
    await page.click('a[type=submit]');
    await page.waitForSelector('div.dashboard');
  });
});
