const NodeEnvironment = require('jest-environment-node');

const puppeteer = require('puppeteer');

module.exports = class ChromeEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    this.global.browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async teardown() {
    await this.global.browser.close();
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }

};