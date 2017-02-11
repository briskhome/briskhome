/**
 * @briskhome/core.db <lib/core.db/index.js>
 * └ models/sensor.model.js
 *
 * Модель данных датчика.
 *
 * @author Egor Zaitsev <ezaitsev@briskhome.com>
 */

'use strict';

const uuid = require('uuid-1345');

module.exports = function model(db) {
  const Schema = db.Schema;
  const SensorSchema = new Schema({

    // Уникальный идентификатор (UUID) датчика. Должен быть либо версии 4, либо версии 5. В случае
    // использования версии 5 в качестве пространства имен используется UUID устройства.
    _id: {
      type: String,
      default: () => uuid.v4(),
    },

    // Серийный номер датчика. У датчиков 1-wire указывается вместе с категорией (например,
    // 7E.E12000001000), для остальных датчиков серийным номером может выступать уникальная
    // строка, позволяющая его однозначно идентифицировать.
    serial: {
      type: String,
      unique: true,
    },

    // Зарегистрированное в системе устройство, которое управляет или считывает данные с датчика.
    // Временно (до завершения рефакторинга компонента `Onewire`) установлено как необязательное.
    device: {
      type: String,
      required: false,
    },

    // Параметр 'isOnline' показывает результат последней попытки подключения к датчику. В случае,
    // если попытка подключения неуспешна, необходимо установить параметр в значение 'false'. Если
    // попытка успешна, необходимо убедиться, что значение параметра равно 'true', в противном слу-
    // чае его нужно изменить на противоположное. Дату и время последнего успешного подключения к
    // датчику можно узнать из коллекции 'readings'.
    isOnline: {
      type: Boolean,
      default: true,
    },

    // Параметр `values` показывает типы показателей, которые предоставляет датчик. массив за-
    // полняется вариантами из предложенного списка. В базе должен храниться только ОДИН дачик на
    // каждый уникальный серийный номер с ненулевым набором предоставляемых показателей.
    values: [{
      type: String,
      enum: [
        'distance',
        'humidity',
        'moisture',
        'pressure',
        'temperature',
      ],
    }],

    // Местоположение датчика. Необходимо для привязки в веб-интерфейсе и пользовательской логике.
    // Используется схема core:allocation.
    location: { type: Schema.Types.Mixed },
  }, {
    collection: 'sensors',
    timestamps: true,
  });

  // SensorSchema.methods.addValueType = function() {};
  //
  // Warning will remore all readings of this subtype;
  // SensorSchema.methods.removeValueType = function() {};
  //
  SensorSchema.methods.setOnline = function setOnline(state) {
    this.isOnline = state;
    return this.save(); // ?
  };
  //
  // SensorSchema.statics.addSensor = function() {};
  //
  //

  return db.model('core:sensor', SensorSchema);
};
