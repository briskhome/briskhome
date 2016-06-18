/**
 * @briskhome/core.db <lib/core.db/index.js>
 * └ models/sensor.model.js
 *
 * Модель данных датчика.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 * @version 0.3.0
 */

'use strict';

module.exports = function (db) {

  const uuid = require('uuid-1345');

  const Schema = db.Schema;
  const SensorSchema = new Schema({

    // Уникальный идентификатор (UUID) датчика. Должен быть либо версии 4, либо версии 5. В случае
    // использования версии 5 в качестве пространства имен используется UUID устройства.
    _id: { type: String, default: uuid.v4() },

    // Серийный номер датчика. У датчиков 1-wire указывается вместе с категорией (например,
    // 7E.E12000001000), для остальных датчиков серийным номером может выступать уникальная
    // строка, позволяющая его однозначно идентифицировать.
    serial: { type: String, required: true },

    // Зарегистрированное в системе устройство, которое управляет или считывает данные с датчика.
    // Временно (до рефактора компонента Onewire) установлен как необязательный.
    device: { type: String, required: false },

    // Параметр kind показывает вид датчика. Заполняется вариантом из предложенного списка. В
    // случае, если датчик поддерживает снятие нескольких показаний различных видов одновременно,
    // (например, устройства 1-wire серии 7E), в пользовательской логике необходимо искать датчик
    // одновременно по серийному номеру (например, 7E.E12000001000) и типу (например, pressure).
    // Таким образом, в базе данных будет ДВА датчика с ОДНИМ серийным номером, то разными типами.
    kind: { type: String, required: true, enum: [
      'humidity',
      'moisture',
      'pressure',
      'temperature',
    ]},

    // Местоположение датчика. Необходимо для привязки в веб-интерфейсе и пользовательской логике.
    // Используется схема core:allocation.
    location: db.model('core:allocation').schema,
  }, {
    collection: 'sensors',
    timestamps: true,
  });

  return db.model('core:sensor', SensorSchema);
};
