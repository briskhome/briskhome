// 'use strict';
//
// module.exports = function(options, imports, server) {
//
//   const db = imports.db;
//   const log = imports.log;
//
//   const Schema = db.Schema;
//   const UserSchema = new Schema({
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, required: true },
//     }, {
//     collection: 'people.users'
//   });
//   const GuestSchema = new Schema({
//     body: { type: String, required: true, unique: true },
//     timestamp: { type : Date, default: Date.now }
//   }, {
//     collection: 'people.guests'
//   });
//   const User = db.model('User', UserSchema);
//   const Guest = db.model('Guest', GuestSchema);
//
// };
