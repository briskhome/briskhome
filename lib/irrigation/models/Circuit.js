/**
* @briskhome/irrigation <lib/irrigation/index.js>
* └ models/circuit.js
*
* Irrigation circuit database model (currently unused).
*
* @author Egor Zaitsev <ezaitsev@briskhome.com>
* @version 0.1.2
*/

'use strict';

module.exports = function(options, imports) {

const db = imports.db;

const Schema = db.Schema;
const CircuitSchema = new Schema({
  id: { type: Number, index: true },
  pin: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  flow: { type: Number, max: 10, default: 10 },
  isActive: { type: Boolean, default: false},
  isDisabled: { type: Boolean, default: false},
}, {
  collection: 'irrigation.circuits'
});

const Circuit = db.model('Circuit', CircuitSchema);

};
