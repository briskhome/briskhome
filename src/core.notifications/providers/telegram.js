/**
 * @briskhome
 * └core.notifications <providers/telegram.js>
 */

const TelegramBot = require('node-telegram-bot-api');

module.exports = function setup(options, imports, register) {
  const log = imports.log();
  const config = imports.config();

  function Bot() {
    const { token } = config;

    this.bot = new TelegramBot(token, { polling: true });
    this.chats = {};
    this.invites = {};

    this.bot.on('message', msg => {
      const chatId = msg.chat.id;
      const commandId = msg.text.split(' ').shift();

      switch (commandId) {
        case '/start': {
          const inviteId = msg.text.split(' ').pop();
          log.info(`Processing invite ${inviteId} from chat ${chatId}`);
          if (Object.keys(this.invites).includes(inviteId)) {
            log.trace(`Invite ${inviteId} is valid – executing callback`);
            this.invites[inviteId](chatId);
          }
          break;
        }

        default: {
          break;
        }
      }
    });

    this.bot.on('error', err => {
      log.error(err);
    });
  }

  Bot.prototype.verify = function invite(inviteId, done) {
    this.invites[inviteId] = done;
    return `tg://resolve?domain=BriskhomeBot?start=${inviteId}`;
  };

  Bot.prototype.send = async function send({ chatId, event }) {
    return this.bot.sendMessage(chatId, event.name);
  };

  register(null, { telegram: new Bot() });
};
