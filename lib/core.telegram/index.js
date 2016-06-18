/**
 * @briskhome/core.pki <lib/core.pki/index.js>
 *
 * Компонент инфраструктуры публичных ключей.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function (options, imports, register) {

  const config = imports.config('core.telegram');
  const log = imports.log('core.telegram', {
    message_id: 'number',
    entities: 'array',
    from: 'object',
    chat: 'object',
    date: 'number',
    text: 'string',
  });
  const ldap = imports.ldap;
  const uuid = require('uuid-1345');

  /**
   * @todo
   * Следует как-то ловить ошибки при работе модуля node-telegram-bot-api (отключи интернет).
   */

  /**
   * @constructor
   */
  function Bot() {
    const TelegramBot = require('node-telegram-bot-api');
    const token = config.token;
    this.bot = new TelegramBot(token, {polling: true});

    const self = this;
    this.chats = {};

    self.bot.on('message', function (msg) {

      // Нужно проверять, есть ли chatID в белом списке, в противном случае отдавать ошибку доступа.
      const chatID = msg.chat.id;
      const command = msg.text.split(' ').shift();
      if (command == '/start') {
        const inviteID = msg.text.split(' ').pop();
        if (inviteID.length === 36) {
          const username = self.invites[msg.text.split(' ').pop()];
          if (typeof username === 'undefined') {
            self.bot.sendMessage(chatID, '*Ошибка*: нет доступа к системе.\nНе удалось привязать аккаунт Telegram с учётной записи *BRISK*HOME. Попробуйте еще раз.', { parse_mode: 'Markdown' });
            return;
          }

          log.info('Получен запрос авторизации в боте Telegram от пользователя', username);
          delete self.invites[inviteID];
          return self.invited(username, chatID);
        } else {
          self.bot.sendMessage(chatID, '*Ошибка*: нет доступа к системе.\nДля использования бота необходимо сначала привязать свой аккаунт Telegram к своей учётной записи *BRISK*HOME в веб-интерфейсе системы.', { parse_mode: 'Markdown' });
          return;
        }
      }
      log.debug({data:msg});
      self.bot.sendMessage(chatID, "Hello!", {caption: "I'm a bot!"});
    });

    self.bot.on('error', function (err) {
      log.error(err);
      log.info('testing 123');
    });

    this.invites = {};

    setTimeout(function() {
      let x = self.invite('ezaitcev');
      console.log(x);
    }, 1000);
  }

  /**
   *
   * @param {String} username  Идентификатор пользователя системы, к которому будет осуществлена
   *                           привязка идентификатора чата.
   */
  Bot.prototype.invite = function invite(username) {
    const self = this;
    const inviteID = uuid.v4();
    self.invites[inviteID] = username;
    return 'https://telegram.me/BriskhomeBot?start=' + inviteID;
  };

  /**
   * @param {String} username
   * @param {String} chatID
   */
  Bot.prototype.invited = function invited(username, chatID) {
    const self = this;
    ldap.findAndUpdate('username', function (err, data) {

    });
    self.bot.sendMessage(chatID, '*Регистрация успешна!* Добро пожаловать, ' + username + '!', { parse_mode: 'Markdown' });
  };

  /**
   *
   */
  Bot.prototype.reload = function reload() {

  };

  /**
   * @param {Object} message
   * @param {String} username
   */
  Bot.prototype.send = function send(message, user, callback) {

    /* Lookup user telegram-chat-id from LDAP */

    if (message.hasOwnProperty('photo')) {

    }

    if (message.hasOwnProperty('text')) {

    }
  };

  register(null, { telegram: new Bot() });
};
